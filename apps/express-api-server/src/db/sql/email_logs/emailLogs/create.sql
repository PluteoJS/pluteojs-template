/*
    Creates table email_logs.
*/
CREATE TABLE email_logs
(
    id UUID PRIMARY KEY,
	user_id UUID,
	message_id VARCHAR(225) NOT NULL,
	sender_address VARCHAR(225) NOT NULL,
    target_address VARCHAR(225) NOT NULL,
	subject VARCHAR(225),
	body_type VARCHAR(225) NOT NULL,
    body VARCHAR(256),
    created_at TIMESTAMPTZ
)
