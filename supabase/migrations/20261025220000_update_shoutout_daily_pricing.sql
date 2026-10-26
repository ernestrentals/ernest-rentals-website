begin;

-- Preserve legacy Shoutout catalogue rows for historical relationships while
-- removing them from new sales. Campaigns, quotation items and invoice items
-- retain their agreed price snapshots.
update public.ad_packages
set
  status = 'inactive',
  notes = concat_ws(
    E'\n',
    nullif(notes, ''),
    'Archived 2026-10-25. Retained for historical records; replaced for new sales by the official EC$50-per-day Shoutout catalogue.'
  ),
  updated_at = now()
where package_code in (
  'PACKAGE-SHOUT-1D',
  'PACKAGE-SHOUT-WEEKEND',
  'PACKAGE-SHOUT-1W'
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
  ('PACKAGE-SHOUT-DAILY-1D', 'Premium Shoutout - 1 Day', 'shoutout', 15, 1, 'day', '1 Day', 50, 'XCD', false, false, 'active', 210, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-2D', 'Premium Shoutout - 2 Days', 'shoutout', 15, 2, 'day', '2 Days', 100, 'XCD', false, false, 'active', 211, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-3D', 'Premium Shoutout - 3 Days', 'shoutout', 15, 3, 'day', '3 Days', 150, 'XCD', false, false, 'active', 212, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-4D', 'Premium Shoutout - 4 Days', 'shoutout', 15, 4, 'day', '4 Days', 200, 'XCD', false, false, 'active', 213, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-5D', 'Premium Shoutout - 5 Days', 'shoutout', 15, 5, 'day', '5 Days', 250, 'XCD', false, false, 'active', 214, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-6D', 'Premium Shoutout - 6 Days', 'shoutout', 15, 6, 'day', '6 Days', 300, 'XCD', false, false, 'active', 215, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null),
  ('PACKAGE-SHOUT-DAILY-7D', 'Premium Shoutout - 7 Days', 'shoutout', 15, 7, 'day', '7 Days', 350, 'XCD', false, false, 'active', 216, 'Official Shoutout rate: EC$50 per day. Artwork design is not included.', null)
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
