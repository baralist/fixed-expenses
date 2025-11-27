-- Create expenses table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  service_name text not null,
  amount integer not null,
  payment_day integer not null check (payment_day >= 1 and payment_day <= 31),
  category text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.expenses enable row level security;

-- Create policies
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
