create type public.app_role as enum ('administrador', 'caja', 'consultas');

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Cada usuario lee sus propios roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'administrador');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'consultas');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.taxes (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    rate numeric(6,3) not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

grant select on public.taxes to authenticated;
grant insert, update, delete on public.taxes to authenticated;
grant all on public.taxes to service_role;

alter table public.taxes enable row level security;

create policy "Autenticados leen impuestos"
on public.taxes for select to authenticated using (true);

create policy "Administradores gestionan impuestos"
on public.taxes for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.parties (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    name text not null,
    cuit text,
    role text not null default 'CLIENTE' check (role in ('CLIENTE', 'PROVEEDOR', 'AMBOS')),
    email text,
    phone text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

grant select on public.parties to authenticated;
grant insert, update, delete on public.parties to authenticated;
grant all on public.parties to service_role;

alter table public.parties enable row level security;

create policy "Autenticados leen terceros"
on public.parties for select to authenticated using (true);

create policy "Administradores gestionan terceros"
on public.parties for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.price_lists (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    name text not null,
    discount numeric(6,2) not null default 0,
    description text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

grant select on public.price_lists to authenticated;
grant insert, update, delete on public.price_lists to authenticated;
grant all on public.price_lists to service_role;

alter table public.price_lists enable row level security;

create policy "Autenticados leen listas de precios"
on public.price_lists for select to authenticated using (true);

create policy "Administradores gestionan listas de precios"
on public.price_lists for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.products (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    name text not null,
    type text not null default 'Bien' check (type in ('Bien', 'Servicio', 'Consumible')),
    description text,
    cost numeric(16,2) not null default 0,
    base_price numeric(16,2) not null default 0,
    stock integer not null default 0,
    reorder_point integer not null default 0,
    tax_id uuid references public.taxes(id) on delete set null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

grant select on public.products to authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

create policy "Autenticados leen productos"
on public.products for select to authenticated using (true);

create policy "Administradores gestionan productos"
on public.products for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.price_list_lines (
    id uuid primary key default gen_random_uuid(),
    price_list_id uuid not null references public.price_lists(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete cascade,
    unit_price numeric(16,2) not null default 0,
    unique (price_list_id, product_id)
);

grant select on public.price_list_lines to authenticated;
grant insert, update, delete on public.price_list_lines to authenticated;
grant all on public.price_list_lines to service_role;

alter table public.price_list_lines enable row level security;

create policy "Autenticados leen lineas de listas"
on public.price_list_lines for select to authenticated using (true);

create policy "Administradores gestionan lineas de listas"
on public.price_list_lines for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.sales (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    party_id uuid not null references public.parties(id),
    price_list_id uuid references public.price_lists(id) on delete set null,
    date date not null default current_date,
    subtotal numeric(16,2) not null default 0,
    total numeric(16,2) not null default 0,
    state text not null default 'draft' check (state in ('draft', 'confirmed', 'processing', 'cancelled')),
    created_by uuid,
    created_at timestamptz not null default now()
);

grant select on public.sales to authenticated;
grant insert, update, delete on public.sales to authenticated;
grant all on public.sales to service_role;

alter table public.sales enable row level security;

create policy "Administradores y caja leen ventas"
on public.sales for select to authenticated
using (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'));

create policy "Administradores y caja gestionan ventas"
on public.sales for all to authenticated
using (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'))
with check (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'));

create table public.sale_lines (
    id uuid primary key default gen_random_uuid(),
    sale_id uuid not null references public.sales(id) on delete cascade,
    product_id uuid not null references public.products(id),
    quantity numeric(12,2) not null default 1,
    unit_price numeric(16,2) not null default 0,
    line_total numeric(16,2) not null default 0
);

grant select on public.sale_lines to authenticated;
grant insert, update, delete on public.sale_lines to authenticated;
grant all on public.sale_lines to service_role;

alter table public.sale_lines enable row level security;

create policy "Administradores y caja leen lineas de venta"
on public.sale_lines for select to authenticated
using (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'));

create policy "Administradores y caja gestionan lineas de venta"
on public.sale_lines for all to authenticated
using (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'))
with check (public.has_role(auth.uid(), 'administrador') or public.has_role(auth.uid(), 'caja'));

create table public.purchases (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    party_id uuid not null references public.parties(id),
    date date not null default current_date,
    subtotal numeric(16,2) not null default 0,
    total numeric(16,2) not null default 0,
    state text not null default 'draft' check (state in ('draft', 'confirmed', 'processing', 'cancelled')),
    created_by uuid,
    created_at timestamptz not null default now()
);

grant select on public.purchases to authenticated;
grant insert, update, delete on public.purchases to authenticated;
grant all on public.purchases to service_role;

alter table public.purchases enable row level security;

create policy "Administradores leen compras"
on public.purchases for select to authenticated
using (public.has_role(auth.uid(), 'administrador'));

create policy "Administradores gestionan compras"
on public.purchases for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create table public.purchase_lines (
    id uuid primary key default gen_random_uuid(),
    purchase_id uuid not null references public.purchases(id) on delete cascade,
    product_id uuid not null references public.products(id),
    quantity numeric(12,2) not null default 1,
    unit_cost numeric(16,2) not null default 0,
    line_total numeric(16,2) not null default 0
);

grant select on public.purchase_lines to authenticated;
grant insert, update, delete on public.purchase_lines to authenticated;
grant all on public.purchase_lines to service_role;

alter table public.purchase_lines enable row level security;

create policy "Administradores leen lineas de compra"
on public.purchase_lines for select to authenticated
using (public.has_role(auth.uid(), 'administrador'));

create policy "Administradores gestionan lineas de compra"
on public.purchase_lines for all to authenticated
using (public.has_role(auth.uid(), 'administrador'))
with check (public.has_role(auth.uid(), 'administrador'));

create or replace function public.apply_stock_movement(p_product_id uuid, p_delta integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
  set stock = greatest(0, stock + p_delta)
  where id = p_product_id;
end;
$$;

grant execute on function public.apply_stock_movement(uuid, integer) to authenticated;