-- IslandFix Seed Data
-- Run this after applying the schema migration
-- All test accounts use password: TestPass123!

-- ============================================================
-- 1. AUTH USERS (5 homeowners + 8 tradespeople)
-- ============================================================

-- NOTE: GoTrue requires all varchar columns to be empty strings, not NULL.
-- raw_app_meta_data must include provider info for password auth to work.
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, role, aud, confirmation_token, recovery_token, email_change, email_change_token_new, created_at, updated_at)
VALUES
  -- Homeowners
  ('a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'marcia.campbell@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Marcia Campbell"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '90 days', now()),
  ('a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'devon.brown@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Devon Brown"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '75 days', now()),
  ('a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'keisha.martinez@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Keisha Martinez"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '60 days', now()),
  ('a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'andre.williams@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Andre Williams"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '45 days', now()),
  ('a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'patricia.lewis@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Patricia Lewis"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '30 days', now()),
  -- Tradespeople
  ('b0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'marcus.johnson@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Marcus Johnson"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '120 days', now()),
  ('b0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'trevor.clarke@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Trevor Clarke"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '100 days', now()),
  ('b0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'simone.reid@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Simone Reid"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '95 days', now()),
  ('b0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'carlos.baptiste@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Carlos Baptiste"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '80 days', now()),
  ('b0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'natalie.grant@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Natalie Grant"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '70 days', now()),
  ('b0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'winston.thomas@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Winston Thomas"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '65 days', now()),
  ('b0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'roshelle.dubois@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Roshelle Dubois"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '55 days', now()),
  ('b0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'darnell.mcpherson@email.com', crypt('TestPass123!', gen_salt('bf')), now(), '{"full_name": "Darnell McPherson"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb, 'authenticated', 'authenticated', '', '', '', '', now() - interval '40 days', now())
ON CONFLICT (id) DO NOTHING;

-- Auth identities (required for login to work)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, id, json_build_object('sub', id, 'email', email)::jsonb, 'email', now(), now(), now()
FROM auth.users
WHERE id IN (
  'a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004',
  'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001',
  'b0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003',
  'b0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000005',
  'b0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000007',
  'b0000001-0000-0000-0000-000000000008'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. PROFILES (auto-created by trigger, update with full data)
-- ============================================================

-- Homeowners
UPDATE public.profiles SET role = 'homeowner', phone = '+1-876-555-0101', location = 'Kingston, Jamaica', bio = 'Homeowner in Kingston looking for reliable tradespeople for my family home.' WHERE id = 'a0000001-0000-0000-0000-000000000001';
UPDATE public.profiles SET role = 'homeowner', phone = '+1-246-555-0202', location = 'Bridgetown, Barbados', bio = 'Recently moved to Barbados, renovating a colonial-era property.' WHERE id = 'a0000001-0000-0000-0000-000000000002';
UPDATE public.profiles SET role = 'homeowner', phone = '+1-868-555-0303', location = 'Port of Spain, Trinidad', bio = 'Managing two rental properties in Port of Spain, always need maintenance work.' WHERE id = 'a0000001-0000-0000-0000-000000000003';
UPDATE public.profiles SET role = 'homeowner', phone = '+1-242-555-0404', location = 'Nassau, Bahamas', bio = 'Beachfront villa owner, need regular upkeep and storm-damage repairs.' WHERE id = 'a0000001-0000-0000-0000-000000000004';
UPDATE public.profiles SET role = 'homeowner', phone = '+1-876-555-0505', location = 'Montego Bay, Jamaica', bio = 'Running a small guesthouse, looking for tradespeople I can trust.' WHERE id = 'a0000001-0000-0000-0000-000000000005';

-- Tradespeople
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-876-555-1001', location = 'Kingston, Jamaica', bio = 'Master plumber with 15 years experience across Jamaica. Specializing in residential and commercial plumbing.' WHERE id = 'b0000001-0000-0000-0000-000000000001';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-876-555-1002', location = 'Spanish Town, Jamaica', bio = 'Licensed electrician. Wiring, panel upgrades, solar installations. Safety first, always.' WHERE id = 'b0000001-0000-0000-0000-000000000002';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-246-555-1003', location = 'Bridgetown, Barbados', bio = 'Interior and exterior painter. I bring colour and life to Caribbean homes. Clean work guaranteed.' WHERE id = 'b0000001-0000-0000-0000-000000000003';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-868-555-1004', location = 'Port of Spain, Trinidad', bio = 'Carpenter and woodworker. Custom furniture, kitchen cabinets, and structural repairs.' WHERE id = 'b0000001-0000-0000-0000-000000000004';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-242-555-1005', location = 'Nassau, Bahamas', bio = 'Roofing specialist experienced with hurricane-resistant installations. Serving all of New Providence.' WHERE id = 'b0000001-0000-0000-0000-000000000005';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-876-555-1006', location = 'Ocho Rios, Jamaica', bio = 'Landscaping and garden design. Tropical plants, irrigation systems, and outdoor living spaces.' WHERE id = 'b0000001-0000-0000-0000-000000000006';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-868-555-1007', location = 'San Fernando, Trinidad', bio = 'HVAC technician certified in all major brands. AC installation, repair, and maintenance.' WHERE id = 'b0000001-0000-0000-0000-000000000007';
UPDATE public.profiles SET role = 'tradesperson', phone = '+1-876-555-1008', location = 'Montego Bay, Jamaica', bio = 'General handyman - tiling, minor plumbing, painting, furniture assembly. No job too small.' WHERE id = 'b0000001-0000-0000-0000-000000000008';

-- ============================================================
-- 3. TRADES PROFILES
-- ============================================================

INSERT INTO public.trades_profiles (id, trade_category, experience_years, hourly_rate, is_verified, rating, total_reviews, availability_status, service_radius_miles, skills)
VALUES
  ('b0000001-0000-0000-0000-000000000001', 'plumbing', 15, 65.00, true, 4.80, 24, 'available', 30, ARRAY['Pipe fitting', 'Drain cleaning', 'Water heater repair', 'Leak detection', 'Bathroom installation']),
  ('b0000001-0000-0000-0000-000000000002', 'electrical', 10, 75.00, true, 4.60, 18, 'available', 25, ARRAY['Wiring', 'Panel upgrades', 'Solar installation', 'Generator hookup', 'Lighting design']),
  ('b0000001-0000-0000-0000-000000000003', 'painting', 8, 45.00, true, 4.90, 31, 'available', 20, ARRAY['Interior painting', 'Exterior painting', 'Wallpaper', 'Faux finishes', 'Deck staining']),
  ('b0000001-0000-0000-0000-000000000004', 'carpentry', 12, 55.00, true, 4.50, 15, 'busy', 35, ARRAY['Custom furniture', 'Kitchen cabinets', 'Door installation', 'Framing', 'Wood restoration']),
  ('b0000001-0000-0000-0000-000000000005', 'roofing', 20, 85.00, true, 4.70, 22, 'available', 40, ARRAY['Shingle roofing', 'Metal roofing', 'Hurricane straps', 'Roof inspection', 'Gutter installation']),
  ('b0000001-0000-0000-0000-000000000006', 'landscaping', 6, 40.00, false, 4.30, 9, 'available', 15, ARRAY['Garden design', 'Lawn care', 'Irrigation systems', 'Tree trimming', 'Hardscaping']),
  ('b0000001-0000-0000-0000-000000000007', 'hvac', 9, 70.00, true, 4.40, 12, 'offline', 30, ARRAY['AC installation', 'AC repair', 'Duct cleaning', 'Refrigeration', 'Ventilation']),
  ('b0000001-0000-0000-0000-000000000008', 'general', 5, 35.00, false, 4.20, 7, 'available', 20, ARRAY['Tiling', 'Minor plumbing', 'Painting', 'Furniture assembly', 'Drywall repair'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. BOOKINGS (12 total across all statuses)
-- ============================================================

INSERT INTO public.bookings (id, homeowner_id, tradesperson_id, title, description, status, proposed_date, proposed_time, budget, location, created_at)
VALUES
  -- COMPLETED (4)
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001',
   'Fix leaking kitchen pipe', 'The pipe under the kitchen sink has been dripping for a week. Need urgent repair before it causes water damage.',
   'completed', '2026-01-15', '09:00', 150.00, '12 Hope Road, Kingston, Jamaica', now() - interval '60 days'),
  ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003',
   'Repaint living room and hallway', 'Want to freshen up the living room and hallway. Currently cream, want to go with ocean blue and white trim.',
   'completed', '2026-01-20', '08:00', 400.00, '5 Bay Street, Bridgetown, Barbados', now() - interval '50 days'),
  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002',
   'Install ceiling fans in 3 bedrooms', 'Need 3 ceiling fans installed with proper wiring. Fans already purchased.',
   'completed', '2026-02-01', '10:00', 300.00, '22 Ariapita Ave, Port of Spain, Trinidad', now() - interval '40 days'),
  ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000005',
   'Hurricane roof inspection and repair', 'Post-hurricane season inspection. A few shingles came loose during last storm.',
   'completed', '2026-01-10', '07:00', 600.00, '8 Cable Beach Blvd, Nassau, Bahamas', now() - interval '55 days'),

  -- IN PROGRESS (2)
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000004',
   'Custom kitchen cabinets', 'Need new kitchen cabinets built and installed. Want mahogany wood with modern handles.',
   'in_progress', '2026-03-01', '08:00', 2500.00, '12 Hope Road, Kingston, Jamaica', now() - interval '14 days'),
  ('c0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000008',
   'Tile bathroom floor and walls', 'Complete re-tiling of master bathroom. Approximately 120 sq ft floor and 200 sq ft walls.',
   'in_progress', '2026-03-03', '09:00', 800.00, '15 Gloucester Ave, Montego Bay, Jamaica', now() - interval '7 days'),

  -- ACCEPTED (2)
  ('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000007',
   'AC unit not cooling properly', 'Living room AC unit is running but not cooling. Makes a clicking sound on startup. Unit is 3 years old.',
   'accepted', '2026-03-10', '14:00', 200.00, '22 Ariapita Ave, Port of Spain, Trinidad', now() - interval '5 days'),
  ('c0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001',
   'Install new bathroom fixtures', 'Replacing all bathroom fixtures - toilet, sink, and shower head. Fixtures already purchased from local supplier.',
   'accepted', '2026-03-12', '10:00', 350.00, '5 Bay Street, Bridgetown, Barbados', now() - interval '3 days'),

  -- PENDING (3)
  ('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000006',
   'Redesign front garden', 'Want to add tropical plants, a small water feature, and pathway stones to the front garden area.',
   'pending', '2026-03-20', '08:00', 500.00, '8 Cable Beach Blvd, Nassau, Bahamas', now() - interval '2 days'),
  ('c0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000002',
   'Upgrade electrical panel', 'Old fuse box needs replacing with modern circuit breaker panel. House is 25 years old.',
   'pending', '2026-03-18', '09:00', 450.00, '15 Gloucester Ave, Montego Bay, Jamaica', now() - interval '1 day'),
  ('c0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003',
   'Paint exterior of house', 'Two-story house needs full exterior paint job. Currently white, want Caribbean coral with white trim.',
   'pending', '2026-04-01', '07:00', 1200.00, '12 Hope Road, Kingston, Jamaica', now() - interval '1 day'),

  -- CANCELLED (1)
  ('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000004',
   'Build bookshelf unit', 'Wanted a built-in bookshelf for the study but decided to go with a pre-made unit instead.',
   'cancelled', '2026-02-15', '11:00', 350.00, '22 Ariapita Ave, Port of Spain, Trinidad', now() - interval '25 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. REVIEWS (for completed bookings)
-- ============================================================

INSERT INTO public.reviews (booking_id, reviewer_id, tradesperson_id, rating, comment, created_at)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001',
   5, 'Marcus was fantastic! He arrived on time, diagnosed the problem quickly, and fixed the leak in under an hour. Very professional and clean work. Highly recommend!',
   now() - interval '58 days'),
  ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003',
   5, 'Simone did an incredible job with the ocean blue. The living room looks absolutely stunning. She was meticulous with the trim work and left everything spotless. Will definitely hire again!',
   now() - interval '47 days'),
  ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002',
   4, 'Trevor installed all three ceiling fans perfectly. Took a bit longer than expected but the quality of work was excellent. Very knowledgeable about electrical safety.',
   now() - interval '37 days'),
  ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000005',
   5, 'Natalie and her team were amazing. They found issues I didn''t even know about and fixed everything. The roof is now fully hurricane-ready. Peace of mind is priceless!',
   now() - interval '52 days');

-- ============================================================
-- 6. MESSAGES (realistic conversations)
-- ============================================================

INSERT INTO public.messages (booking_id, sender_id, content, created_at) VALUES
  -- Completed plumbing job conversation
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Hi Marcus, the kitchen pipe has been leaking for about a week now. Can you come take a look?', now() - interval '62 days'),
  ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Hi Marcia! I can come by this Thursday morning. Can you send me a photo of the leak so I know what tools to bring?', now() - interval '62 days' + interval '2 hours'),
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Thursday works! It seems to be coming from the joint under the sink. I''ll have the area cleared for you.', now() - interval '62 days' + interval '3 hours'),
  ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Perfect. I''ll be there around 9am. Sounds like a fitting issue - should be a straightforward fix.', now() - interval '62 days' + interval '4 hours'),
  ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'All done! Replaced the corroded fitting and tested for leaks. Everything is dry now. Let me know if you have any issues.', now() - interval '60 days'),
  ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Thank you so much Marcus! No more dripping. You''re a lifesaver!', now() - interval '59 days'),

  -- In-progress kitchen cabinets conversation
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'Hi Carlos, I''d love to get custom mahogany cabinets for my kitchen. Do you work with mahogany?', now() - interval '15 days'),
  ('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000004', 'Hi Marcia! Yes, mahogany is one of my favourite woods to work with. I can come measure the kitchen this week if you like.', now() - interval '15 days' + interval '1 hour'),
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'That would be great! I have some design ideas from Pinterest I can show you.', now() - interval '15 days' + interval '2 hours'),
  ('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000004', 'Measurements done. I''ll have the design sketches and final quote ready by Monday. The mahogany supplier in Kingston has good stock right now.', now() - interval '12 days'),
  ('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000004', 'Started work on the cabinets today! The wood grain is beautiful. I''ll send photos as I progress.', now() - interval '7 days'),
  ('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'They look amazing already! Can''t wait to see them installed.', now() - interval '6 days'),

  -- Accepted AC repair conversation
  ('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'Hi Roshelle, my AC is running but not cooling the room. There''s also a clicking sound when it starts up.', now() - interval '5 days'),
  ('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000007', 'That clicking sound could be a relay or compressor issue. What brand and model is the unit? I''ll make sure I have the right parts.', now() - interval '5 days' + interval '30 minutes'),
  ('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'It''s a Carrier 12000 BTU split unit, about 3 years old.', now() - interval '5 days' + interval '1 hour'),
  ('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000007', 'Good news - I work with Carrier units regularly. I''ll see you on the 10th at 2pm. We''ll get your AC blowing cold again!', now() - interval '5 days' + interval '2 hours'),

  -- Pending garden redesign conversation
  ('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000004', 'Hi Winston, I saw your profile and love your work with tropical gardens. Would you be able to redesign my front garden?', now() - interval '2 days'),
  ('c0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000006', 'Thanks Andre! I''d love to take a look. A water feature and tropical plants would work beautifully in Nassau. Let me check my schedule and get back to you.', now() - interval '2 days' + interval '3 hours');
