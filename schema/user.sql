CREATE TABLE user (
    user_id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    middle_name VARCHAR(25),
    phone_number VARCHAR(25) NOT NULL,
    role VARCHAR(25),
    image_profile LONGBLOB
);
