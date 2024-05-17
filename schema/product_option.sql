CREATE TABLE product_option (
    option_id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    option_name VARCHAR(45) NOT NULL,
    is_required INT NOT NULL,
    is_multiselect INT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES product(product_id)
    ON DELETE CASCADE
);