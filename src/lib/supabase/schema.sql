-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null check (role in ('homeowner', 'tradesperson')) default 'homeowner',
  avatar_url text,
  phone text,
  location text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trades profiles (extra fields for tradespeople)
create table public.trades_profiles (
  id uuid references public.profiles on delete cascade primary key,
  trade_category text not null default 'general',
  experience_years int default 0,
  hourly_rate decimal(10,2),
  is_verified boolean default false,
  rating decimal(3,2) default 0,
  total_reviews int default 0,
  availability_status text default 'available' check (availability_status in ('available', 'busy', 'offline')),
  service_radius_miles int default 25,
  skills text[] default '{}',
  portfolio_images text[] default '{}'
);

-- Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  homeowner_id uuid references public.profiles not null,
  tradesperson_id uuid references public.profiles not null,
  title text not null,
  description text not null default '',
  status text default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  proposed_date date,
  proposed_time time,
  budget decimal(10,2),
  location text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings on delete cascade not null,
  reviewer_id uuid references public.profiles not null,
  tradesperson_id uuid references public.profiles not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz default now()
);

-- Messages
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings on delete cascade not null,
  sender_id uuid references public.profiles not null,
  content text not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_trades_profiles_category on public.trades_profiles(trade_category);
create index idx_trades_profiles_rating on public.trades_profiles(rating desc);
create index idx_trades_profiles_available on public.trades_profiles(availability_status);
create index idx_bookings_homeowner on public.bookings(homeowner_id);
create index idx_bookings_tradesperson on public.bookings(tradesperson_id);
create index idx_bookings_status on public.bookings(status);
create index idx_messages_booking on public.messages(booking_id);
create index idx_reviews_tradesperson on public.reviews(tradesperson_id);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.trades_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

-- Profiles: anyone can read, users can update own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Trades profiles: anyone can read, owner can update
create policy "Trades profiles are viewable by everyone" on public.trades_profiles for select using (true);
create policy "Tradespeople can update own trades profile" on public.trades_profiles for update using (auth.uid() = id);
create policy "Tradespeople can insert own trades profile" on public.trades_profiles for insert with check (auth.uid() = id);

-- Bookings: participants can read, homeowners can create
create policy "Participants can view bookings" on public.bookings for select using (auth.uid() = homeowner_id or auth.uid() = tradesperson_id);
create policy "Homeowners can create bookings" on public.bookings for insert with check (auth.uid() = homeowner_id);
create policy "Participants can update bookings" on public.bookings for update using (auth.uid() = homeowner_id or auth.uid() = tradesperson_id);

-- Reviews: anyone can read, reviewer can create
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Reviewers can create reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- Messages: booking participants can read and create
create policy "Participants can view messages" on public.messages for select using (
  exists (select 1 from public.bookings where id = booking_id and (homeowner_id = auth.uid() or tradesperson_id = auth.uid()))
);
create policy "Participants can send messages" on public.messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from public.bookings where id = booking_id and (homeowner_id = auth.uid() or tradesperson_id = auth.uid()))
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute procedure public.update_updated_at();
