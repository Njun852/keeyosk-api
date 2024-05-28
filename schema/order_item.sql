CREATE TABLE order_item (
    order_id VARCHAR(255) NOT NULL,
    cart_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES product_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE
)