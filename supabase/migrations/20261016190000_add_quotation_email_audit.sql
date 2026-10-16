-- Mirrored from the CRM repository because both projects share one database.
alter table public.quotations
  add column if not exists last_emailed_at timestamptz,
  add column if not exists last_emailed_by uuid,
  add column if not exists last_email_provider_id text,
  add column if not exists email_send_count integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quotations_email_send_count_nonnegative'
      and conrelid = 'public.quotations'::regclass
  ) then
    alter table public.quotations
      add constraint quotations_email_send_count_nonnegative
      check (email_send_count >= 0);
  end if;
end
$$;

create index if not exists quotations_last_emailed_at_idx
  on public.quotations (last_emailed_at desc)
  where last_emailed_at is not null;

comment on column public.quotations.last_emailed_at is
  'Most recent successful direct-email send time from the CRM.';

comment on column public.quotations.last_emailed_by is
  'Authenticated staff user who most recently emailed the quotation.';

comment on column public.quotations.last_email_provider_id is
  'Provider message identifier for the most recent successful quotation email.';

comment on column public.quotations.email_send_count is
  'Number of successful direct-email sends recorded by the CRM.';

create or replace function public.record_quotation_email_sent(
  p_quotation_id uuid,
  p_user_id uuid,
  p_provider_message_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.quotations
  set
    status = 'sent',
    last_emailed_at = now(),
    last_emailed_by = p_user_id,
    last_email_provider_id = nullif(trim(p_provider_message_id), ''),
    email_send_count = coalesce(email_send_count, 0) + 1
  where id = p_quotation_id;

  if not found then
    raise exception 'Quotation not found.';
  end if;
end;
$$;

revoke all on function public.record_quotation_email_sent(uuid, uuid, text)
from public, anon, authenticated;

grant execute on function public.record_quotation_email_sent(uuid, uuid, text)
to service_role;

comment on function public.record_quotation_email_sent(uuid, uuid, text) is
  'Atomically records a successful server-side quotation email and marks it sent.';

notify pgrst, 'reload schema';
