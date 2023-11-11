/*
    Inserts a new email_verification_request_logs record.
*/
INSERT INTO email_verification_request_logs(
  id,
  email,
  req_date_time,
  req_ip_address,
  otp,
  is_otp_usable,
  created_at,
  updated_at
  )
VALUES(
  ${id},
  ${email},
  CURRENT_TIMESTAMP,
  ${reqIpAddress},
  ${otp},
  ${isOtpUsable},
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
RETURNING *