begin;

-- Ernest Rentals digital billboard rate card, effective for new selections.
-- Historical campaigns retain their agreed value in campaigns.package_price,
-- while quotation_items and invoice_items retain their own unit-price snapshots.
-- The superseded four-week rows stay in place for those historical links.
update public.ad_packages
set
  status = 'inactive',
  notes = 'Superseded by the calendar-month digital rate card. Retained for historical records.',
  updated_at = now()
where package_code in (
  'PACKAGE-STD-4W',
  'PACKAGE-PREM-4W'
);

insert into public.ad_packages (
  package_code,
  name,
  package_type,
  slot_duration_seconds,
  duration_value,
  duration_unit,
  duration_label,
  price,
  currency_code,
  includes_ad_creation,
  creative_service_only,
  status,
  sort_order,
  notes,
  billboard_id
)
values
  ('PACKAGE-STD-1W', '10-Second Standard Advertising - 1 Week', 'standard', 10, 1, 'week', '1 Week', 400, 'XCD', false, false, 'active', 10, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-STD-2W', '10-Second Standard Advertising - 2 Weeks', 'standard', 10, 2, 'week', '2 Weeks', 750, 'XCD', false, false, 'active', 15, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-STD-1M', '10-Second Standard Advertising - 1 Month', 'standard', 10, 1, 'month', '1 Month', 1400, 'XCD', false, false, 'active', 20, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-STD-3M', '10-Second Standard Advertising - 3 Months', 'standard', 10, 3, 'month', '3 Months', 3900, 'XCD', false, false, 'active', 30, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-STD-6M', '10-Second Standard Advertising - 6 Months', 'standard', 10, 6, 'month', '6 Months', 7200, 'XCD', false, false, 'active', 40, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-STD-12M', '10-Second Standard Advertising - 12 Months', 'standard', 10, 12, 'month', '12 Months', 13200, 'XCD', false, false, 'active', 50, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-1W', '15-Second Premium Advertising - 1 Week', 'premium', 15, 1, 'week', '1 Week', 600, 'XCD', false, false, 'active', 110, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-2W', '15-Second Premium Advertising - 2 Weeks', 'premium', 15, 2, 'week', '2 Weeks', 1100, 'XCD', false, false, 'active', 115, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-1M', '15-Second Premium Advertising - 1 Month', 'premium', 15, 1, 'month', '1 Month', 2100, 'XCD', false, false, 'active', 120, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-3M', '15-Second Premium Advertising - 3 Months', 'premium', 15, 3, 'month', '3 Months', 5700, 'XCD', false, false, 'active', 130, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-6M', '15-Second Premium Advertising - 6 Months', 'premium', 15, 6, 'month', '6 Months', 10800, 'XCD', false, false, 'active', 140, 'Current Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-12M', '15-Second Premium Advertising - 12 Months', 'premium', 15, 12, 'month', '12 Months', 19800, 'XCD', false, false, 'active', 150, 'Current Digital Billboard Rate Card', null)
on conflict (package_code)
do update set
  name = excluded.name,
  package_type = excluded.package_type,
  slot_duration_seconds = excluded.slot_duration_seconds,
  duration_value = excluded.duration_value,
  duration_unit = excluded.duration_unit,
  duration_label = excluded.duration_label,
  price = excluded.price,
  currency_code = excluded.currency_code,
  includes_ad_creation = excluded.includes_ad_creation,
  creative_service_only = excluded.creative_service_only,
  status = excluded.status,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  billboard_id = excluded.billboard_id,
  updated_at = now();

-- Each active Standard or Premium booking consumes one physical slot. The
-- half-open date range preserves the 9:00 AM changeover rule: a campaign may
-- begin on the exact date the previous campaign changes over.
create extension if not exists btree_gist;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_digital_slot_schedule_excl'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_digital_slot_schedule_excl
      exclude using gist (
        digital_slot_id with =,
        daterange(start_date, end_date, '[)') with &&
      )
      where (
        digital_slot_id is not null
        and status <> 'cancelled'
      );
  end if;
end
$$;

comment on constraint bookings_digital_slot_schedule_excl on public.bookings is
  'Prevents overlapping non-cancelled bookings for one digital slot; end dates are 9:00 AM changeovers and are exclusive.';

-- Full weekly sell-through at the configured 8 Standard and 4 Premium slots:
-- EC$5,600 per week, EC$24,266.67 average per month, EC$291,200 per year.
-- Operational reports continue to use campaign, quotation and invoice
-- snapshots rather than these theoretical capacity figures.

notify pgrst, 'reload schema';

commit;
