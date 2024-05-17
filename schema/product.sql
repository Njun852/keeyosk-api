CREATE TABLE product (
    product_id VARCHAR(255) PRIMARY KEY,
    category_id VARCHAR(255),
    product_name VARCHAR(45) NOT NULL,
    price DOUBLE NOT NULL,
    discount DOUBLE,
    description LONGTEXT,
    FOREIGN KEY(category_id) REFERENCES category(category_id) ON DELETE SET NULL
);