begin;

-- Quotation numbers previously depended on the number of rows in the table.
-- If an older quotation was removed, that could reuse a number which was
-- still present and fail the insert with quotations_quote_number_key.
-- Serialize number assignment per quotation year and always continue after
-- the highest number that already exists for that year.
create or replace function public.assign_quotation_number()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  quotation_year integer;
  next_number bigint;
begin
  quotation_year := extract(
    year from coalesce(new.quote_date, current_date)
  )::integer;

  perform pg_advisory_xact_lock(
    hashtextextended(
      'ernest-rentals:quotation-number:' || quotation_year::text,
      0
    )
  );

  select coalesce(
    max(
      substring(
        quotation.quote_number
        from '[0-9]+$'
      )::bigint
    ),
    0
  ) + 1
  into next_number
  from public.quotations as quotation
  where quotation.quote_number ~ (
    '^QT-' || quotation_year::text || '-[0-9]+$'
  );

  new.quote_number := format(
    'QT-%s-%s',
    quotation_year,
    lpad(next_number::text, 5, '0')
  );

  return new;
end;
$$;

drop trigger if exists assign_quotation_number_before_insert
on public.quotations;

drop trigger if exists zz_assign_quotation_number_before_insert
on public.quotations;

-- PostgreSQL runs triggers with the same timing alphabetically. The zz prefix
-- makes this final collision-safe assignment win over any legacy numbering
-- trigger retained by the original schema.
create trigger zz_assign_quotation_number_before_insert
before insert on public.quotations
for each row
execute function public.assign_quotation_number();

comment on function public.assign_quotation_number() is
  'Assigns the next collision-safe annual quotation number before insert.';

notify pgrst, 'reload schema';

commit;
