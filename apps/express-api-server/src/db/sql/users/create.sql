/*
    Creates table Users.
*/
CREATE TABLE users
(
    id UUID PRIMARY KEY,
    first_name VARCHAR(225) NOT NULL,
    last_name VARCHAR(225) NOT NULL,
    email VARCHAR(225) NOT NULL,
    phone_number VARCHAR(32),
    password VARCHAR(256),
    created_at TIMESTAMPTZ
)
