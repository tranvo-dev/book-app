ALTER TABLE users
ALTER COLUMN id DROP DEFAULT,
ALTER COLUMN id TYPE UUID USING CAST(LPAD(TO_HEX(id), 32, '0') AS UUID), -- convert current id to type uuid by adding 0s to the left
ALTER COLUMN id SET DEFAULT gen_random_uuid();