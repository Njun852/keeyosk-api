CREATE TABLE product_option_item (
    item_id VARCHAR(255) PRIMARY KEY,
    option_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(45) NOT NULL,
    additional_price DOUBLE NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(option_id) REFERENCES product_option(option_id) 
    ON DELETE CASCADE
);