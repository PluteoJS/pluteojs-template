/*
    Inserts a new User record.
*/
INSERT INTO users(id, first_name, last_name, email, phone_number, password, created_at)
VALUES(${id}, ${firstName}, ${lastName}, ${email}, ${phoneNumber}, ${password}, CURRENT_TIMESTAMP)
RETURNING *
