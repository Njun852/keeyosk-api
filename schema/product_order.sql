CREATE TABLE product_order (
    order_id VARCHAR(255) PRIMARY KEY,
    table_number VARCHAR(50) NOT NULL,
    order_date DATETIME NOT NULL,
    voucher_id VARCHAR(255),
    status VARCHAR(15) NOT NULL,
    FOREIGN KEY (voucher_id) REFERENCES voucher(voucher_id)
    ON DELETE SET NULL
);