alter table public.billboard_reviews
  add column if not exists image_path text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'review-images',
  'review-images',
  false,
  3145728,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.get_public_billboard_review_images(
  p_billboard_id uuid
)
returns table (
  review_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  select reviews.id
  from public.billboard_reviews as reviews
  where reviews.billboard_id = p_billboard_id
    and reviews.status = 'approved'
    and reviews.image_path is not null
  order by reviews.created_at desc;
$$;

revoke all on function public.get_public_billboard_review_images(uuid)
from public;

grant execute on function public.get_public_billboard_review_images(uuid)
to anon, authenticated, service_role;
