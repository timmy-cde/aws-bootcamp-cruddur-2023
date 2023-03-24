-- this file was manually created
-- INSERT INTO public.users (display_name, email, handle, cognito_user_id)
-- VALUES
--   ('Andrew Brown', 'andrew@exampro.co', 'andrewbrown' ,'MOCK'),
  -- ('Andrew Bayko', 'bayko@exampro.co', 'bayko' ,'MOCK');
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Andrew Brown', 'andrew@exampro.co', 'andrewbrown' ,'13d4e9ca-6607-4a9c-80e6-cc8a8ad54f7f'),
  ('Andrew Bayko', 'bayko@exampro.co', 'bayko' ,'9e605c5a-e8b0-4431-a774-686338918171');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )