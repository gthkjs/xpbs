CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR UNIQUE,
	hash VARCHAR,
	country VARCHAR
);