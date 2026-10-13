-- This migration is intentionally mirrored in the CRM repository.
-- The shared Supabase project applies it once by migration version.

alter table public.ad_packages
  add column if not exists service_description text,
  add column if not exists service_category text,
  add column if not exists included_revisions integer,
  add column if not exists subject_to_availability boolean not null default false;

do $$
begin
  if not exists (
    select 1 from public.ad_packages
    where id = '3c9c0f7e-92fa-4988-b06b-20aae2da7022'::uuid
      and package_code = 'PACKAGE-SHOUT-1D'
      and price = 150
      and coalesce(includes_ad_creation, false) = false
  ) then
    raise exception 'Safety check failed: the normal EC$150 one-day Shoutout was not found.';
  end if;

  if not exists (
    select 1 from public.ad_packages
    where id = '36e5921e-8572-4e9b-b51c-20c7626a768f'::uuid
      and package_code = 'PACKAGE-SHOUT-1D-CREATIVE'
      and price = 200
      and coalesce(includes_ad_creation, false) = true
  ) then
    raise exception 'Safety check failed: the old EC$200 artwork-included Shoutout was not found.';
  end if;
end
$$;

update public.ad_packages
set status = 'inactive', notes = concat_ws(E'\n', nullif(notes, ''), 'Archived 2026-10-12. Retained for historical records; not available for new sales.'), updated_at = now()
where id = '36e5921e-8572-4e9b-b51c-20c7626a768f'::uuid
  and package_code = 'PACKAGE-SHOUT-1D-CREATIVE';

update public.ad_packages
set status = 'active', updated_at = now()
where id = '3c9c0f7e-92fa-4988-b06b-20aae2da7022'::uuid
  and package_code = 'PACKAGE-SHOUT-1D';

update public.ad_packages
set status = 'inactive', notes = concat_ws(E'\n', nullif(notes, ''), 'Archived 2026-10-12. Replaced for new sales by the approved Artwork Design service catalogue.'), updated_at = now()
where package_code in ('CREATIVE-10SEC', 'CREATIVE-15SEC');

insert into public.ad_packages (
  package_code, name, package_type, slot_duration_seconds, duration_value,
  duration_unit, duration_label, price, currency_code, includes_ad_creation,
  creative_service_only, status, sort_order, notes, billboard_id,
  service_description, service_category, included_revisions,
  subject_to_availability
)
values
  ('artwork_digital_basic', 'Basic Digital Artwork Design', 'creative_service', null, null, null, null, 150, 'XCD', false, true, 'active', 310, 'One digital billboard creative, one concept and up to two revisions. Client supplies logo, text, images and core campaign information.', null, 'One digital billboard creative, one concept and up to two revisions. Client supplies logo, text, images and core campaign information.', 'Creative Services', 2, false),
  ('artwork_professional', 'Professional Artwork Design', 'creative_service', null, null, null, null, 300, 'XCD', false, true, 'active', 320, 'Static billboard or detailed digital creative, up to two concepts, up to three revisions and enhanced layout support.', null, 'Static billboard or detailed digital creative, up to two concepts, up to three revisions and enhanced layout support.', 'Creative Services', 3, false),
  ('artwork_campaign_bundle', 'Static + Digital Campaign Design Bundle', 'creative_service', null, null, null, null, 400, 'XCD', false, true, 'active', 330, 'One static billboard design, one matching digital version, up to three revisions and visual consistency across both formats.', null, 'One static billboard design, one matching digital version, up to three revisions and visual consistency across both formats.', 'Creative Services', 3, false),
  ('artwork_extra_revision', 'Additional Revision', 'creative_service', null, null, null, null, 50, 'XCD', false, true, 'active', 340, 'One additional revision after the included revision allowance has been used. Added only with staff confirmation.', null, 'One additional revision after the included revision allowance has been used. Added only with staff confirmation.', 'Creative Services', 0, false),
  ('artwork_rush', 'Rush Design', 'creative_service', null, null, null, null, 100, 'XCD', false, true, 'active', 350, 'Optional rush-design surcharge. Subject to availability.', null, 'Optional rush-design surcharge. Subject to availability.', 'Creative Services', 0, true)
on conflict (package_code) do update
set
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
  service_description = excluded.service_description,
  service_category = excluded.service_category,
  included_revisions = excluded.included_revisions,
  subject_to_availability = excluded.subject_to_availability,
  updated_at = now();

alter table public.campaigns
  add column if not exists artwork_service_id uuid references public.ad_packages(id) on delete set null,
  add column if not exists artwork_assigned_to uuid references public.staff_profiles(user_id) on delete set null,
  add column if not exists client_assets_received boolean not null default false,
  add column if not exists revisions_included integer not null default 0,
  add column if not exists revisions_used integer not null default 0,
  add column if not exists artwork_final_approved_at timestamptz;

create index if not exists campaigns_artwork_service_id_idx on public.campaigns (artwork_service_id);
create index if not exists campaigns_artwork_assigned_to_idx on public.campaigns (artwork_assigned_to);

create or replace function public.get_public_creative_services()
returns table (
  service_id uuid,
  service_code text,
  service_name text,
  service_description text,
  service_category text,
  price numeric,
  currency_code text,
  included_revisions integer,
  subject_to_availability boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select ap.id, ap.package_code, ap.name,
    coalesce(ap.service_description, ap.notes),
    coalesce(ap.service_category, 'Creative Services'), ap.price,
    ap.currency_code, coalesce(ap.included_revisions, 0),
    coalesce(ap.subject_to_availability, false)
  from public.ad_packages ap
  where ap.status = 'active'
    and coalesce(ap.creative_service_only, false) = true
    and lower(trim(ap.package_type)) = 'creative_service'
  order by ap.sort_order, ap.name;
$$;

revoke all on function public.get_public_creative_services() from public;
grant execute on function public.get_public_creative_services() to anon, authenticated;

comment on function public.get_public_creative_services() is
  'Safe public read model for active Ernest Rentals creative-service prices.';
