-- =========================================================
-- ERNEST RENTALS
-- SECURITY HARDENING + API RATE LIMITING
-- 2026-09-23
-- =========================================================

begin;


-- =========================================================
-- 1. HARDEN BROAD RLS POLICIES
-- =========================================================

alter policy
  "Authenticated users can view billboard photos"
on public.billboard_photos
using (
  public.current_user_can_access_crm()
);

alter policy
  "Authenticated users can add billboard photos"
on public.billboard_photos
with check (
  public.current_user_can_access_crm()
);

alter policy
  "Authenticated users can update billboard photos"
on public.billboard_photos
using (
  public.current_user_can_access_crm()
)
with check (
  public.current_user_can_access_crm()
);

alter policy
  "Authenticated users can delete billboard photos"
on public.billboard_photos
using (
  public.current_user_can_access_crm()
);


alter policy
  "Authenticated users can view campaign activities"
on public.campaign_activities
using (
  public.current_user_can_access_crm()
);

alter policy
  "Authenticated users can add campaign activities"
on public.campaign_activities
with check (
  public.current_user_can_access_crm()
  and created_by = auth.uid()
);


alter policy
  "Authenticated staff can view billboard reviews"
on public.billboard_reviews
using (
  public.current_user_can_access_crm()
);

alter policy
  "Authenticated staff can moderate billboard reviews"
on public.billboard_reviews
using (
  public.current_user_can_access_crm()
)
with check (
  public.current_user_can_access_crm()
);


alter policy
  "Authenticated users can view meetings"
on public.meetings
using (
  public.current_user_can_access_crm()
);


-- =========================================================
-- 2. SECURITY DEFINER EXECUTION PERMISSIONS
--
-- Default:
--   PUBLIC        no
--   anon          no
--   authenticated yes
--   service_role  yes
--
-- Public website RPCs are explicitly granted anon access.
-- =========================================================

do $$
declare
  fn record;

  public_rpc_names text[] := array[
    'get_next_public_billboard_availability',
    'get_public_ad_packages',
    'get_public_billboard_details',
    'get_public_billboard_photos',
    'get_public_billboard_reviews',
    'get_public_billboard_sitemap',
    'get_public_location_billboards',
    'get_public_static_billboard_packages',
    'search_public_billboard_availability',
    'submit_public_billboard_review',
    'submit_public_campaign_inquiry'
  ];
begin

  for fn in
    select
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(
        p.oid
      ) as arguments
    from pg_proc p
    join pg_namespace n
      on n.oid = p.pronamespace
    where
      n.nspname = 'public'
      and p.prosecdef = true
      and p.proname <>
        'check_api_rate_limit'
  loop

    execute format(
      'revoke execute on function %I.%I(%s) from public',
      fn.schema_name,
      fn.function_name,
      fn.arguments
    );

    execute format(
      'revoke execute on function %I.%I(%s) from anon',
      fn.schema_name,
      fn.function_name,
      fn.arguments
    );

    execute format(
      'grant execute on function %I.%I(%s) to authenticated',
      fn.schema_name,
      fn.function_name,
      fn.arguments
    );

    execute format(
      'grant execute on function %I.%I(%s) to service_role',
      fn.schema_name,
      fn.function_name,
      fn.arguments
    );

    if
      fn.function_name =
      any(
        public_rpc_names
      )
    then

      execute format(
        'grant execute on function %I.%I(%s) to anon',
        fn.schema_name,
        fn.function_name,
        fn.arguments
      );

    end if;

  end loop;

end
$$;


-- =========================================================
-- 3. SERVER-ONLY INTERNAL HELPERS
--
-- These functions calculate or synchronize derived
-- financial/campaign values and should not be callable
-- directly from ordinary authenticated browser sessions.
-- =========================================================

revoke execute
on function public.refresh_campaign_creative_status(uuid)
from public, anon, authenticated;

revoke execute
on function public.refresh_campaign_payment_status(uuid)
from public, anon, authenticated;

revoke execute
on function public.refresh_invoice_payment_status(uuid)
from public, anon, authenticated;

revoke execute
on function public.refresh_invoice_totals(uuid)
from public, anon, authenticated;

revoke execute
on function public.refresh_quotation_totals(uuid)
from public, anon, authenticated;

revoke execute
on function public.sync_invoice_payment_to_campaign(uuid)
from public, anon, authenticated;


grant execute
on function public.refresh_campaign_creative_status(uuid)
to service_role;

grant execute
on function public.refresh_campaign_payment_status(uuid)
to service_role;

grant execute
on function public.refresh_invoice_payment_status(uuid)
to service_role;

grant execute
on function public.refresh_invoice_totals(uuid)
to service_role;

grant execute
on function public.refresh_quotation_totals(uuid)
to service_role;

grant execute
on function public.sync_invoice_payment_to_campaign(uuid)
to service_role;


-- =========================================================
-- 4. API RATE-LIMIT STORAGE
-- =========================================================

create table if not exists public.api_rate_limits (
  rate_key text primary key,

  window_started_at timestamptz
    not null
    default now(),

  request_count integer
    not null
    default 0,

  updated_at timestamptz
    not null
    default now(),

  constraint api_rate_limits_request_count_check
    check (
      request_count >= 0
    ),

  constraint api_rate_limits_rate_key_length_check
    check (
      length(rate_key) >= 1
      and length(rate_key) <= 200
    )
);


alter table public.api_rate_limits
  enable row level security;


-- Browser clients receive no direct table access.

revoke all
on table public.api_rate_limits
from anon, authenticated;


-- =========================================================
-- 5. ATOMIC SERVER-SIDE RATE LIMIT FUNCTION
-- =========================================================

create or replace function public.check_api_rate_limit(
  p_rate_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz :=
    now();

  v_window_started_at timestamptz;

  v_request_count integer;

  v_elapsed_seconds integer;

  v_retry_after integer;
begin

  if
    p_rate_key is null
    or btrim(
      p_rate_key
    ) = ''
    or length(
      p_rate_key
    ) > 200
  then

    raise exception
      'A valid rate-limit key is required.';

  end if;


  if
    p_max_requests is null
    or p_max_requests < 1
    or p_max_requests > 10000
  then

    raise exception
      'Invalid maximum request count.';

  end if;


  if
    p_window_seconds is null
    or p_window_seconds < 1
    or p_window_seconds > 86400
  then

    raise exception
      'Invalid rate-limit window.';

  end if;


  insert into public.api_rate_limits (
    rate_key,
    window_started_at,
    request_count,
    updated_at
  )
  values (
    btrim(
      p_rate_key
    ),
    v_now,
    1,
    v_now
  )

  on conflict (
    rate_key
  )

  do update
  set
    window_started_at =
      case
        when
          public.api_rate_limits.window_started_at
          +
          make_interval(
            secs =>
              p_window_seconds
          )
          <=
          v_now
        then
          v_now
        else
          public.api_rate_limits.window_started_at
      end,

    request_count =
      case
        when
          public.api_rate_limits.window_started_at
          +
          make_interval(
            secs =>
              p_window_seconds
          )
          <=
          v_now
        then
          1
        else
          public.api_rate_limits.request_count
          +
          1
      end,

    updated_at =
      v_now

  returning
    api_rate_limits.window_started_at,
    api_rate_limits.request_count

  into
    v_window_started_at,
    v_request_count;


  v_elapsed_seconds :=
    greatest(
      0,

      floor(
        extract(
          epoch from (
            v_now -
            v_window_started_at
          )
        )
      )::integer
    );


  v_retry_after :=
    greatest(
      0,

      p_window_seconds -
      v_elapsed_seconds
    );


  return query
  select
    v_request_count <=
      p_max_requests,

    greatest(
      p_max_requests -
      v_request_count,
      0
    ),

    case
      when
        v_request_count >
        p_max_requests
      then
        v_retry_after
      else
        0
    end;

end;
$$;


-- =========================================================
-- 6. RATE-LIMIT FUNCTION PERMISSIONS
-- =========================================================

revoke execute
on function public.check_api_rate_limit(
  text,
  integer,
  integer
)
from public, anon, authenticated;


grant execute
on function public.check_api_rate_limit(
  text,
  integer,
  integer
)
to service_role;


commit;