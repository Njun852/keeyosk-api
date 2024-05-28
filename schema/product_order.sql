CREATE TABLE product_order (
    order_id VARCHAR(255) PRIMARY KEY,
    table_number VARCHAR(50) NOT NULL,
    order_date VARCHAR(25) NOT NULL,
    order_hour VARCHAR(25) NOT NULL,
    voucher_id VARCHAR(255),
    user_id VARCHAR(255) NOT NULL, 
    status VARCHAR(15) NOT NULL,
    order_mode VARCHAR(25) NOT NULL,
    FOREIGN KEY (voucher_id) REFERENCES voucher(voucher_id)
    ON DELETE SET NULL,
    FOREIGN KEY user_id REFERENCES user(user_id) ON DELETE CASCADE
);