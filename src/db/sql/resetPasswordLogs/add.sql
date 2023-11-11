/*
    Inserts a new reset Password record.
*/
INSERT INTO reset_password_logs(id, user_id, email, datetime, req_ip_address, otp, is_otp_usable, created_at)
VALUES(${id}, ${userId}, ${email}, CURRENT_TIMESTAMP, ${requestIPAddress}, ${otp}, ${isOtpUsable}, CURRENT_TIMESTAMP)
RETURNING *
