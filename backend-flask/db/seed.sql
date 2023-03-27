-- this file was manually created
-- INSERT INTO public.users (display_name, email, handle, cognito_user_id)
-- VALUES
--   ('Andrew Brown', 'andrew@exampro.co', 'andrewbrown' ,'MOCK'),
--   ('Andrew Bayko', 'bayko@exampro.co', 'bayko' ,'MOCK');

INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Timothy Manuel', 'timothys.manuel@gmail.com', 'timmy-cde' ,'MOCK'),
  ('Tim Suarez', 'suareztim3@gmail.com', 'tim-suarez' ,'MOCK'),
  ('Londo Mollari', 'lmollari@centari.com', 'londo' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'timmy-cde' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )