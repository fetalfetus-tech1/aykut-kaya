-- Adminlerin tüm profilleri güncelleyebilmesi, görebilmesi ve silebilmesi için RLS policy'leri

-- Adminler tüm profilleri güncelleyebilir
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Admins can update any profile" on profiles
  for update using (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Adminler tüm profilleri görebilir
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Admins can view any profile" on profiles
  for select using (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ) OR true
  );

-- Adminler tüm profilleri silebilir
create policy "Admins can delete any profile" on profiles
  for delete using (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
