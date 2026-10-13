-- This migration is intentionally mirrored in the CRM repository.
-- The shared Supabase project applies it once by migration version.

create table if not exists public.payroll_employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  job_title text,
  email text,
  phone text,
  linked_staff_user_id uuid unique references public.staff_profiles(user_id) on delete set null,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  updated_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  archived_by uuid references auth.users(id) on delete set null,
  constraint payroll_employees_name_check check (length(trim(full_name)) > 0),
  constraint payroll_employees_email_check check (email is null or position('@' in email) > 1)
);

create index if not exists payroll_employees_active_name_idx
on public.payroll_employees (active, full_name)
where archived_at is null;

drop trigger if exists payroll_employees_touch_updated_at on public.payroll_employees;
create trigger payroll_employees_touch_updated_at
before update on public.payroll_employees
for each row execute function public.touch_expense_updated_at();

alter table public.payroll_employees enable row level security;

drop policy if exists payroll_employees_select on public.payroll_employees;
create policy payroll_employees_select on public.payroll_employees
for select to authenticated using (public.current_user_can_view_payroll());

drop policy if exists payroll_employees_insert on public.payroll_employees;
create policy payroll_employees_insert on public.payroll_employees
for insert to authenticated with check (public.current_user_can_manage_payroll());

drop policy if exists payroll_employees_update on public.payroll_employees;
create policy payroll_employees_update on public.payroll_employees
for update to authenticated
using (public.current_user_can_manage_payroll())
with check (public.current_user_can_manage_payroll());

insert into public.payroll_employees (
  id, full_name, job_title, email, linked_staff_user_id, active
)
select
  staff.user_id,
  coalesce(nullif(trim(staff.full_name), ''), staff.email),
  initcap(replace(staff.role::text, '_', ' ')),
  nullif(trim(staff.email), ''),
  staff.user_id,
  staff.active
from public.staff_profiles staff
on conflict (id) do nothing;

alter table public.payroll_records
  drop constraint if exists payroll_records_staff_member_id_fkey;
alter table public.recurring_payroll_setups
  drop constraint if exists recurring_payroll_setups_staff_member_id_fkey;

alter table public.payroll_records
  add constraint payroll_records_staff_member_id_fkey
  foreign key (staff_member_id) references public.payroll_employees(id) on delete restrict;
alter table public.recurring_payroll_setups
  add constraint recurring_payroll_setups_staff_member_id_fkey
  foreign key (staff_member_id) references public.payroll_employees(id) on delete restrict;

create or replace function public.create_payroll_expense(
  p_staff_member_id uuid,
  p_pay_period_start date,
  p_pay_period_end date,
  p_base_pay numeric,
  p_allowances numeric default 0,
  p_deductions numeric default 0,
  p_expense_date date default current_date,
  p_due_date date default null,
  p_currency_code text default 'XCD',
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  category_id uuid;
  employee_name text;
  gross_amount numeric(14, 2);
  net_amount numeric(14, 2);
  expense_id uuid;
begin
  if not public.current_user_can_manage_payroll() then
    raise exception 'You do not have permission to create payroll records.';
  end if;
  if p_pay_period_start is null or p_pay_period_end is null or p_pay_period_end < p_pay_period_start then
    raise exception 'A valid pay period is required.';
  end if;
  if coalesce(p_base_pay, -1) < 0 or coalesce(p_allowances, -1) < 0 or coalesce(p_deductions, -1) < 0 then
    raise exception 'Payroll amounts cannot be negative.';
  end if;

  gross_amount := p_base_pay + p_allowances;
  net_amount := gross_amount - p_deductions;
  if net_amount < 0 then
    raise exception 'Deductions cannot exceed gross pay.';
  end if;

  select id into category_id
  from public.expense_categories
  where code = 'payroll' and archived_at is null
  limit 1;
  if category_id is null then
    raise exception 'Payroll expense category is not configured.';
  end if;

  select full_name into employee_name
  from public.payroll_employees
  where id = p_staff_member_id and active = true and archived_at is null;
  if employee_name is null then
    raise exception 'Active payroll employee not found.';
  end if;

  insert into public.expenses (
    expense_date, due_date, payee, description, category_id, amount,
    currency_code, status, notes, source_type, entered_by, updated_by
  ) values (
    p_expense_date, coalesce(p_due_date, p_expense_date), employee_name,
    'Payroll: ' || to_char(p_pay_period_start, 'Mon DD, YYYY') || ' - ' || to_char(p_pay_period_end, 'Mon DD, YYYY'),
    category_id, gross_amount, upper(p_currency_code),
    case when coalesce(p_due_date, p_expense_date) <= current_date then 'due' else 'planned' end,
    nullif(trim(coalesce(p_notes, '')), ''), 'payroll', auth.uid(), auth.uid()
  ) returning id into expense_id;

  insert into public.payroll_records (
    expense_id, staff_member_id, pay_period_start, pay_period_end,
    base_pay, allowances, deductions, gross_amount, net_amount, notes,
    created_by, updated_by
  ) values (
    expense_id, p_staff_member_id, p_pay_period_start, p_pay_period_end,
    p_base_pay, p_allowances, p_deductions, gross_amount, net_amount,
    nullif(trim(coalesce(p_notes, '')), ''), auth.uid(), auth.uid()
  );
  return expense_id;
end;
$$;

revoke all on function public.create_payroll_expense(uuid, date, date, numeric, numeric, numeric, date, date, text, text) from public;
grant execute on function public.create_payroll_expense(uuid, date, date, numeric, numeric, numeric, date, date, text, text) to authenticated;
grant select, insert, update on table public.payroll_employees to authenticated;

comment on table public.payroll_employees is
  'Protected payroll directory. Employees may be paid without receiving CRM login access.';
comment on column public.payroll_employees.linked_staff_user_id is
  'Optional CRM login relationship. A payroll employee does not require a staff account.';
