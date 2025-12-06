/*
    Creates table email_verification_request_logs.
*/
CREATE TABLE email_verification_request_logs
(
    id UUID PRIMARY KEY,
   	email VARCHAR(225),
    req_date_time TIMESTAMPTZ NOT NULL,
    req_ip_address INET,
    otp VARCHAR(256) NOT NULL,
    is_otp_usable BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
