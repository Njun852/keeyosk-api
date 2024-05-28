CREATE TABLE selected_option_item (
    cart_id VARCHAR(255) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    FOREIGN KEY(cart_id) REFERENCES cart(cart_id)
    ON DELETE CASCADE,
    FOREIGN KEY(item_id) REFERENCES product_option_item(item_id)
    ON DELETE CASCADE
);