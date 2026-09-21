-- ============================================================
-- ERNEST RENTALS
-- PUBLIC BILLBOARD + BOOKING DATABASE FUNCTIONS
--
-- Backup date: 2026-09-21
--
-- Contains:
-- 1. get_public_location_billboards
-- 2. get_next_public_billboard_availability
-- 3. submit_public_campaign_inquiry
--
-- IMPORTANT:
-- This file is stored in Git as the source-controlled copy
-- of the public booking functions used by ernestrentals.com.
-- ============================================================


-- ============================================================
-- 1. PUBLIC LOCATION BILLBOARD INVENTORY
-- ============================================================

create or replace function public.get_public_location_billboards()
returns table (
  billboard_id uuid,
  billboard_code text,
  billboard_name text,
  location text,
  billboard_type text,
  image_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    b.id as billboard_id,
    b.billboard_code,
    b.name as billboard_name,
    b.location,
    b.billboard_type,
    b.image_url

  from public.billboards b

  order by
    b.billboard_code asc;
$$;

grant execute
on function public.get_public_location_billboards()
to anon, authenticated;


-- ============================================================
-- 2. NEXT AVAILABLE BILLBOARD CAMPAIGN PERIOD
-- ============================================================

create or replace function public.get_next_public_billboard_availability(
  p_billboard_id uuid,
  p_billboard_type text,
  p_package_type text,
  p_duration_value integer,
  p_duration_unit text,
  p_search_from date,
  p_max_days integer default 730
)
returns table (
  next_start_date date,
  next_end_date date
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_candidate date;
  v_end_date date;
  v_limit date;

  v_step_days integer :=
    1;

  v_billboard_type text :=
    lower(
      trim(
        coalesce(
          p_billboard_type,
          ''
        )
      )
    );

  v_package_type text :=
    lower(
      trim(
        coalesce(
          p_package_type,
          ''
        )
      )
    );

  v_duration_unit text :=
    lower(
      trim(
        coalesce(
          p_duration_unit,
          ''
        )
      )
    );

  v_available boolean;
begin

  if
    p_billboard_id is null

    or
    p_duration_value is null

    or
    p_duration_value <= 0

    or
    p_duration_unit is null
  then
    return;
  end if;

  v_candidate :=
    greatest(
      coalesce(
        p_search_from,
        current_date
      ),
      current_date
    );

  -- ----------------------------------------------------------
  -- DIGITAL STANDARD / PREMIUM
  -- Start on Mondays.
  -- ----------------------------------------------------------

  if
    v_billboard_type =
      'digital'

    and
    v_package_type in (
      'standard',
      'premium'
    )
  then

    v_candidate :=
      v_candidate +
      (
        (
          8 -
          extract(
            isodow
            from v_candidate
          )::integer
        ) % 7
      );

    v_step_days :=
      7;

  end if;

  v_limit :=
    v_candidate +
    greatest(
      coalesce(
        p_max_days,
        730
      ),
      1
    );

  loop

    -- --------------------------------------------------------
    -- CALCULATE CAMPAIGN CHANGEOVER DATE
    -- --------------------------------------------------------

    if
      v_duration_unit in (
        'day',
        'days'
      )
    then

      v_end_date :=
        v_candidate +
        p_duration_value;

    elsif
      v_duration_unit in (
        'week',
        'weeks'
      )
    then

      v_end_date :=
        v_candidate +
        (
          p_duration_value *
          7
        );

    elsif
      v_duration_unit in (
        'month',
        'months'
      )
    then

      v_end_date :=
        (
          v_candidate +
          make_interval(
            months =>
              p_duration_value
          )
        )::date;

    elsif
      v_duration_unit in (
        'year',
        'years'
      )
    then

      v_end_date :=
        (
          v_candidate +
          make_interval(
            years =>
              p_duration_value
          )
        )::date;

    else
      return;
    end if;

    -- --------------------------------------------------------
    -- USE THE EXISTING AVAILABILITY ENGINE
    -- --------------------------------------------------------

    select exists (
      select
        1

      from public.search_public_billboard_availability(
        p_start_date =>
          v_candidate,

        p_end_date =>
          v_end_date,

        p_location =>
          null,

        p_billboard_type =>
          v_billboard_type
      ) as availability

      where
        availability.billboard_id =
          p_billboard_id

        and lower(
          availability.availability_status
        ) =
          'available'

        and (
          (
            v_billboard_type =
              'static'

            and
            coalesce(
              availability.available_static_faces,
              0
            ) >
              0
          )

          or

          (
            v_billboard_type =
              'digital'

            and
            v_package_type =
              'standard'

            and
            coalesce(
              availability.available_standard_slots,
              0
            ) >
              0
          )

          or

          (
            v_billboard_type =
              'digital'

            and
            v_package_type =
              'premium'

            and
            coalesce(
              availability.available_premium_slots,
              0
            ) >
              0
          )

          or

          (
            v_billboard_type =
              'digital'

            and
            v_package_type =
              'shoutout'

            and
            coalesce(
              availability.available_shoutout_slots,
              0
            ) >
              0
          )
        )
    )
    into
      v_available;

    if
      v_available
    then

      return query
      select
        v_candidate,
        v_end_date;

      return;

    end if;

    v_candidate :=
      v_candidate +
      v_step_days;

    exit when
      v_candidate >
      v_limit;

  end loop;

  return;

end;
$$;

grant execute
on function public.get_next_public_billboard_availability(
  uuid,
  text,
  text,
  integer,
  text,
  date,
  integer
)
to anon, authenticated;


-- ============================================================
-- 3. PUBLIC CAMPAIGN INQUIRY
-- ============================================================

create or replace function public.submit_public_campaign_inquiry(
  p_company_name text default null::text,
  p_contact_person text default null::text,
  p_email text default null::text,
  p_phone text default null::text,
  p_whatsapp text default null::text,
  p_billboard_id uuid default null::uuid,
  p_start_date date default null::date,
  p_changeover_date date default null::date,
  p_billboard_type text default null::text,
  p_ad_option text default null::text,
  p_campaign_name text default null::text,
  p_campaign_objective text default null::text,
  p_artwork_ready boolean default null::boolean,
  p_message text default null::text,
  p_requested_package_id uuid default null::uuid
)
returns table (
  success boolean,
  lead_id uuid
)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  -- ---------------------------------------------------------
  -- CURRENT SAINT LUCIA DATE
  -- ---------------------------------------------------------

  v_today date :=
    (
      current_timestamp
      at time zone 'America/St_Lucia'
    )::date;

  -- ---------------------------------------------------------
  -- BILLBOARD
  -- ---------------------------------------------------------

  v_billboard_code text;
  v_billboard_name text;
  v_location text;
  v_billboard_type text;

  -- ---------------------------------------------------------
  -- PACKAGE
  -- ---------------------------------------------------------

  v_package_id uuid;
  v_package_name text;
  v_package_code text;
  v_package_type text;
  v_package_price numeric;
  v_package_currency text;

  v_package_duration_value integer;
  v_package_duration_unit text;

  -- ---------------------------------------------------------
  -- PACKAGE SCHEDULE
  -- ---------------------------------------------------------

  v_expected_changeover date;

  -- ---------------------------------------------------------
  -- AVAILABILITY
  -- ---------------------------------------------------------

  v_availability_status text;

  v_available_static_faces integer :=
    0;

  v_available_standard_slots integer :=
    0;

  v_available_premium_slots integer :=
    0;

  v_available_shoutout_slots integer :=
    0;

  -- ---------------------------------------------------------
  -- CRM LEAD
  -- ---------------------------------------------------------

  v_lead_id uuid;

begin

  -- =========================================================
  -- CUSTOMER VALIDATION
  -- =========================================================

  if
    nullif(
      trim(
        coalesce(
          p_contact_person,
          ''
        )
      ),
      ''
    )
    is null
  then

    raise exception
      'Contact person is required.';

  end if;

  if
    nullif(
      trim(
        coalesce(
          p_email,
          ''
        )
      ),
      ''
    )
    is null

    and

    nullif(
      trim(
        coalesce(
          p_phone,
          ''
        )
      ),
      ''
    )
    is null

    and

    nullif(
      trim(
        coalesce(
          p_whatsapp,
          ''
        )
      ),
      ''
    )
    is null
  then

    raise exception
      'Email, phone or WhatsApp is required.';

  end if;


  -- =========================================================
  -- CAMPAIGN VALIDATION
  -- =========================================================

  if
    p_billboard_id
    is null
  then

    raise exception
      'Billboard is required.';

  end if;

  if
    p_start_date
    is null

    or
    p_changeover_date
    is null
  then

    raise exception
      'Start date and changeover date are required.';

  end if;

  -- ---------------------------------------------------------
  -- NO PAST CAMPAIGN START DATES
  -- ---------------------------------------------------------

  if
    p_start_date <
    v_today
  then

    raise exception
      'Campaign start date cannot be before today.';

  end if;

  if
    p_changeover_date <=
    p_start_date
  then

    raise exception
      'Changeover date must be after the start date.';

  end if;


  -- =========================================================
  -- VALIDATE BILLBOARD
  -- =========================================================

  select
    b.billboard_code,
    b.name,
    b.location,

    lower(
      trim(
        b.billboard_type
      )
    )

  into
    v_billboard_code,
    v_billboard_name,
    v_location,
    v_billboard_type

  from public.billboards b

  where
    b.id =
      p_billboard_id

    and
    b.status =
      'active';

  if not found then

    raise exception
      'Selected billboard is not available for public enquiries.';

  end if;

  -- ---------------------------------------------------------
  -- NEVER TRUST BILLBOARD TYPE FROM THE BROWSER
  -- ---------------------------------------------------------

  if
    nullif(
      trim(
        coalesce(
          p_billboard_type,
          ''
        )
      ),
      ''
    )
    is not null

    and

    lower(
      trim(
        p_billboard_type
      )
    ) <>
      v_billboard_type
  then

    raise exception
      'Billboard type does not match the selected billboard.';

  end if;

  if
    v_billboard_type not in (
      'static',
      'digital'
    )
  then

    raise exception
      'Unsupported billboard type.';

  end if;


  -- =========================================================
  -- STATIC PACKAGE VALIDATION
  -- =========================================================

  if
    v_billboard_type =
      'static'
  then

    if
      p_requested_package_id
      is null
    then

      raise exception
        'A rental package is required for static billboard campaigns.';

    end if;

    select
      sp.package_id,
      sp.package_name,
      sp.package_code,

      'static',

      sp.price,
      sp.currency_code,

      sp.duration_value::integer,
      sp.duration_unit

    into
      v_package_id,
      v_package_name,
      v_package_code,
      v_package_type,
      v_package_price,
      v_package_currency,
      v_package_duration_value,
      v_package_duration_unit

    from public.get_public_static_billboard_packages()
      as sp

    where
      sp.package_id =
        p_requested_package_id

      and
      sp.billboard_id =
        p_billboard_id

    limit 1;

    if not found then

      raise exception
        'The selected rental package does not belong to this billboard.';

    end if;

  end if;


  -- =========================================================
  -- DIGITAL PACKAGE VALIDATION
  -- =========================================================

  if
    v_billboard_type =
      'digital'
  then

    if
      p_requested_package_id
      is not null
    then

      select
        ap.id,
        ap.name,
        ap.package_code,

        lower(
          trim(
            ap.package_type
          )
        ),

        ap.price,
        ap.currency_code,

        ap.duration_value::integer,
        ap.duration_unit

      into
        v_package_id,
        v_package_name,
        v_package_code,
        v_package_type,
        v_package_price,
        v_package_currency,
        v_package_duration_value,
        v_package_duration_unit

      from public.ad_packages ap

      where
        ap.id =
          p_requested_package_id

        and
        ap.status =
          'active'

        and
        coalesce(
          ap.creative_service_only,
          false
        ) =
          false

        and
        lower(
          trim(
            ap.package_type
          )
        ) in (
          'standard',
          'premium',
          'shoutout'
        );

      if not found then

        raise exception
          'Selected digital advertising package is not available.';

      end if;

    else

      -- -----------------------------------------------------
      -- LEGACY / SEARCH RESULT FLOW
      -- -----------------------------------------------------

      if
        lower(
          coalesce(
            p_ad_option,
            ''
          )
        )
        like
          '%premium%'
      then

        v_package_type :=
          'premium';

      elsif
        lower(
          coalesce(
            p_ad_option,
            ''
          )
        )
        like
          '%shoutout%'
      then

        v_package_type :=
          'shoutout';

      elsif
        lower(
          coalesce(
            p_ad_option,
            ''
          )
        )
        like
          '%standard%'
      then

        v_package_type :=
          'standard';

      else

        raise exception
          'Please select a digital advertising option before submitting the campaign.';

      end if;

    end if;

  end if;


  -- =========================================================
  -- PACKAGE DURATION VALIDATION
  -- =========================================================

  if
    v_package_id
    is not null

    and
    v_package_duration_value
    is not null

    and
    v_package_duration_unit
    is not null
  then

    case
      lower(
        trim(
          v_package_duration_unit
        )
      )

      when 'day' then

        v_expected_changeover :=
          p_start_date +
          v_package_duration_value;

      when 'days' then

        v_expected_changeover :=
          p_start_date +
          v_package_duration_value;

      when 'week' then

        v_expected_changeover :=
          p_start_date +
          (
            v_package_duration_value *
            7
          );

      when 'weeks' then

        v_expected_changeover :=
          p_start_date +
          (
            v_package_duration_value *
            7
          );

      when 'month' then

        v_expected_changeover :=
          (
            p_start_date +
            make_interval(
              months =>
                v_package_duration_value
            )
          )::date;

      when 'months' then

        v_expected_changeover :=
          (
            p_start_date +
            make_interval(
              months =>
                v_package_duration_value
            )
          )::date;

      when 'year' then

        v_expected_changeover :=
          (
            p_start_date +
            make_interval(
              years =>
                v_package_duration_value
            )
          )::date;

      when 'years' then

        v_expected_changeover :=
          (
            p_start_date +
            make_interval(
              years =>
                v_package_duration_value
            )
          )::date;

      else

        v_expected_changeover :=
          null;

    end case;

    if
      v_expected_changeover
      is not null

      and
      p_changeover_date <>
        v_expected_changeover
    then

      raise exception
        'The campaign dates do not match the selected package duration.';

    end if;

  end if;


  -- =========================================================
  -- DIGITAL START DATE RULES
  -- =========================================================

  if
    v_billboard_type =
      'digital'
  then

    -- Digital campaigns begin no earlier than tomorrow.
    if
      p_start_date <=
        v_today
    then

      raise exception
        'Digital campaigns must begin from the next available day.';

    end if;

    -- Standard and Premium start on Mondays.
    if
      v_package_type in (
        'standard',
        'premium'
      )

      and
      extract(
        isodow
        from p_start_date
      )::integer <>
        1
    then

      raise exception
        'Standard and Premium digital campaigns must begin on a Monday.';

    end if;

  end if;


  -- =========================================================
  -- FINAL LIVE AVAILABILITY CHECK
  -- =========================================================

  select
    a.availability_status,

    coalesce(
      a.available_static_faces,
      0
    ),

    coalesce(
      a.available_standard_slots,
      0
    ),

    coalesce(
      a.available_premium_slots,
      0
    ),

    coalesce(
      a.available_shoutout_slots,
      0
    )

  into
    v_availability_status,
    v_available_static_faces,
    v_available_standard_slots,
    v_available_premium_slots,
    v_available_shoutout_slots

  from public.search_public_billboard_availability(
    p_start_date =>
      p_start_date,

    p_end_date =>
      p_changeover_date,

    p_location =>
      null,

    p_billboard_type =>
      v_billboard_type
  ) as a

  where
    a.billboard_id =
      p_billboard_id

  limit 1;

  if not found then

    raise exception
      'This billboard is not available for the requested campaign period.';

  end if;

  if
    lower(
      coalesce(
        v_availability_status,
        ''
      )
    ) <>
      'available'
  then

    raise exception
      'This billboard is already booked for part or all of the requested campaign period.';

  end if;


  -- =========================================================
  -- VERIFY INVENTORY
  -- =========================================================

  if
    v_billboard_type =
      'static'

    and
    v_available_static_faces <=
      0
  then

    raise exception
      'No static billboard face is available for the requested campaign period.';

  end if;

  if
    v_billboard_type =
      'digital'
  then

    if
      v_package_type =
        'standard'

      and
      v_available_standard_slots <=
        0
    then

      raise exception
        'No Standard digital advertising slot is available for the requested campaign period.';

    end if;

    if
      v_package_type =
        'premium'

      and
      v_available_premium_slots <=
        0
    then

      raise exception
        'No Premium digital advertising slot is available for the requested campaign period.';

    end if;

    if
      v_package_type =
        'shoutout'

      and
      v_available_shoutout_slots <=
        0
    then

      raise exception
        'No Shoutout advertising slot is available for the requested campaign period.';

    end if;

  end if;


  -- =========================================================
  -- CREATE CRM LEAD
  -- =========================================================

  insert into public.leads (
    company_name,
    contact_person,
    email,
    phone,
    whatsapp,

    lead_type,
    source,
    status,
    estimated_value,
    currency_code,

    interested_in,
    notes,

    requested_billboard_id,
    requested_start_date,
    requested_changeover_date,

    requested_package_id,
    requested_package_name,
    requested_package_code,
    requested_package_type,
    requested_package_price,
    requested_package_currency
  )
  values (
    nullif(
      trim(
        coalesce(
          p_company_name,
          ''
        )
      ),
      ''
    ),

    trim(
      p_contact_person
    ),

    nullif(
      lower(
        trim(
          coalesce(
            p_email,
            ''
          )
        )
      ),
      ''
    ),

    nullif(
      trim(
        coalesce(
          p_phone,
          ''
        )
      ),
      ''
    ),

    nullif(
      trim(
        coalesce(
          p_whatsapp,
          ''
        )
      ),
      ''
    ),

    'business',

    'website',

    'new',

    v_package_price,

    coalesce(
      v_package_currency,
      'XCD'
    ),

    concat_ws(
      ' - ',

      'Website Inquiry',

      initcap(
        v_billboard_type
      ),

      v_billboard_name
    ),

    concat_ws(
      E'\n',

      'Source: Ernest Rentals public website',

      'Billboard: ' ||
        coalesce(
          v_billboard_code,
          ''
        ) ||
        ' - ' ||
        coalesce(
          v_billboard_name,
          ''
        ),

      'Location: ' ||
        coalesce(
          v_location,
          ''
        ),

      'Billboard Type: ' ||
        coalesce(
          v_billboard_type,
          ''
        ),

      'Requested Start: ' ||
        p_start_date::text ||
        ' at 9:00 AM',

      'Requested Changeover: ' ||
        p_changeover_date::text ||
        ' at 9:00 AM',

      case
        when
          v_package_id
          is not null
        then

          'Requested Package: ' ||
          coalesce(
            v_package_name,
            ''
          ) ||

          case
            when
              v_package_code
              is not null
            then

              ' (' ||
              v_package_code ||
              ')'

            else
              ''

          end

        else
          null
      end,

      case
        when
          v_package_price
          is not null
        then

          'Package Price: ' ||
          coalesce(
            v_package_currency,
            'XCD'
          ) ||
          ' ' ||
          v_package_price::text

        else
          null
      end,

      case
        when
          nullif(
            trim(
              coalesce(
                p_ad_option,
                ''
              )
            ),
            ''
          )
          is not null
        then

          'Advertising Option: ' ||
          trim(
            p_ad_option
          )

        else
          null
      end,

      case
        when
          nullif(
            trim(
              coalesce(
                p_campaign_name,
                ''
              )
            ),
            ''
          )
          is not null
        then

          'Campaign Name: ' ||
          trim(
            p_campaign_name
          )

        else
          null
      end,

      case
        when
          nullif(
            trim(
              coalesce(
                p_campaign_objective,
                ''
              )
            ),
            ''
          )
          is not null
        then

          'Campaign Objective: ' ||
          trim(
            p_campaign_objective
          )

        else
          null
      end,

      case
        when
          p_artwork_ready
          is true
        then

          'Artwork Ready: Yes'

        when
          p_artwork_ready
          is false
        then

          'Artwork Ready: No'

        else

          'Artwork Ready: Not specified'

      end,

      case
        when
          nullif(
            trim(
              coalesce(
                p_message,
                ''
              )
            ),
            ''
          )
          is not null
        then

          'Customer Notes: ' ||
          trim(
            p_message
          )

        else
          null
      end
    ),

    p_billboard_id,
    p_start_date,
    p_changeover_date,

    v_package_id,
    v_package_name,
    v_package_code,
    v_package_type,
    v_package_price,
    v_package_currency
  )

  returning
    id

  into
    v_lead_id;

  return query
  select
    true,
    v_lead_id;

end;
$function$;