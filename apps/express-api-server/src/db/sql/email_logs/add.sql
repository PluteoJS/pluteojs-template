/*
    Inserts a new Email record.
*/
INSERT INTO email_logs(id, user_id, message_id, sender_address, target_address, subject, body_type, body, created_at)
VALUES(${id}, ${userId}, ${messageId}, ${senderAddress}, ${targetAddress}, ${subject}, ${bodyType}, ${body}, CURRENT_TIMESTAMP)
RETURNING *
