/*
    Creates table reset Passwotd logs
    IP address datatype @https://www.ibm.com/cloud/blog/storing-network-addresses-using-postgresql#:~:text=Classless%20Internet%20Domain%20Routing%20(CIDR,store%20IP%20addresses%20in%20PostgreSQL.

*/
CREATE TABLE reset_password_logs
(
    id UUID PRIMARY KEY,
	user_id UUID NOT NULL,
	email VARCHAR(225),
    datetime TIMESTAMPTZ NOT NULL,
    req_ip_address INET,
    otp VARCHAR(256) NOT NULL,
    is_otp_usable BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ 
)