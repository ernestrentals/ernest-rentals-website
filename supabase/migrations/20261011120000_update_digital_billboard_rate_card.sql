begin;

-- Keep the shared package catalogue used by both the CRM and public website
-- aligned with the Ernest Rentals Digital Billboard Rate Card.
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
  ('PACKAGE-STD-1W', '10-Second Standard Advertising - 1 Week', 'standard', 10, 1, 'week', '1 Week', 650, 'XCD', false, false, 'active', 10, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-STD-2W', '10-Second Standard Advertising - 2 Weeks', 'standard', 10, 2, 'week', '2 Weeks', 1250, 'XCD', false, false, 'active', 15, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-STD-4W', '10-Second Standard Advertising - 4 Weeks', 'standard', 10, 4, 'week', '4 Weeks (1 Month)', 2200, 'XCD', false, false, 'active', 20, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-STD-3M', '10-Second Standard Advertising - 3 Months', 'standard', 10, 3, 'month', '3 Months', 6270, 'XCD', false, false, 'active', 30, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-STD-6M', '10-Second Standard Advertising - 6 Months', 'standard', 10, 6, 'month', '6 Months', 11880, 'XCD', false, false, 'active', 40, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-STD-12M', '10-Second Standard Advertising - 12 Months', 'standard', 10, 12, 'month', '12 Months', 22440, 'XCD', false, false, 'active', 50, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-1W', '15-Second Premium Advertising - 1 Week', 'premium', 15, 1, 'week', '1 Week', 950, 'XCD', false, false, 'active', 110, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-2W', '15-Second Premium Advertising - 2 Weeks', 'premium', 15, 2, 'week', '2 Weeks', 1850, 'XCD', false, false, 'active', 115, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-4W', '15-Second Premium Advertising - 4 Weeks', 'premium', 15, 4, 'week', '4 Weeks (1 Month)', 3300, 'XCD', false, false, 'active', 120, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-3M', '15-Second Premium Advertising - 3 Months', 'premium', 15, 3, 'month', '3 Months', 9405, 'XCD', false, false, 'active', 130, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-6M', '15-Second Premium Advertising - 6 Months', 'premium', 15, 6, 'month', '6 Months', 17820, 'XCD', false, false, 'active', 140, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-PREM-12M', '15-Second Premium Advertising - 12 Months', 'premium', 15, 12, 'month', '12 Months', 33660, 'XCD', false, false, 'active', 150, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-SHOUT-1D', '15-Second Shoutout Advertising - 1 Day', 'shoutout', 15, 1, 'day', '1 Day', 150, 'XCD', false, false, 'active', 210, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-SHOUT-WEEKEND', '15-Second Shoutout Advertising - Weekend', 'shoutout', 15, 3, 'day', '3 Days', 400, 'XCD', false, false, 'active', 220, '2026 Digital Billboard Rate Card', null),
  ('PACKAGE-SHOUT-1W', '15-Second Shoutout Advertising - 1 Week', 'shoutout', 15, 7, 'day', '7 Days', 750, 'XCD', false, false, 'active', 230, '2026 Digital Billboard Rate Card', null)
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

notify pgrst, 'reload schema';

commit;
