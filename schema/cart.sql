CREATE TABLE cart (
    cart_id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    is_hidden INT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES product(product_id)
    ON DELETE CASCADE
);