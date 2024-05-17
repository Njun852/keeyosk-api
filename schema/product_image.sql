CREATE TABLE product_image (
    image_id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    image LONGBLOB NOT NULL,
    FOREIGN KEY(product_id) REFERENCES product(product_id) 
    ON DELETE CASCADE
);