INSERT INTO public.user_roles (user_id, role)
VALUES ('2724e1f0-2422-48ed-ad6e-895f7bc4c3d9', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;