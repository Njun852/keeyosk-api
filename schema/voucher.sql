CREATE TABLE voucher (
    voucher_id VARCHAR(255) PRIMARY KEY,
    voucher_name VARCHAR(35) NOT NULL,
    description LONGTEXT,
    minimum_spend DOUBLE NOT NULL,
    discount DOUBLE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL
);