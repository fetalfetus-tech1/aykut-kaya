-- ADMİN KULLANICI OLUŞTURMA
-- Bu script'i çalıştırmadan önce:
-- 1. Supabase Auth UI'dan bir kullanıcı oluşturun (örneğin: admin@example.com)
-- 2. Bu kullanıcının UUID'sini alın (auth.users tablosundan)
-- 3. Aşağıdaki UUID'yi gerçek UUID ile değiştirin

-- Örnek: Admin kullanıcısının UUID'sini buraya yazın
-- UPDATE profiles SET role = 'admin' WHERE id = 'your-admin-user-uuid-here';

-- Alternatif: Eğer yeni bir admin kullanıcısı oluşturmak istiyorsanız:
-- INSERT INTO profiles (id, username, full_name, role)
-- VALUES ('your-admin-user-uuid-here', 'admin', 'Administrator', 'admin');

-- NOT: UUID'yi auth.users tablosundan almak için şu sorguyu çalıştırın:
-- SELECT id, email FROM auth.users;