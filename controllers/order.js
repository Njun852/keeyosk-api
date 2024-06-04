const db = require("../db");

async function getOrder(req, res) {
  try {
    const [[result]] = await db.query(
      `SELECT * FROM product_order WHERE order_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function getAllOrders(req, res) {
  try {
    //remove order if it has no product is empty
    const [partial] = await db.query(
      `SELECT * FROM product_order WHERE status = 'pending'`
    );
    partial.forEach(async (order) => {
      const [items] = await db.query(
        "SELECT * FROM order_item WHERE order_id = ?",
        [order.order_id]
      );
      if (items.length <= 0) {
        console.log("gone");
        await db.query("DELETE FROM product_order WHERE order_id = ?", [
          order.order_id,
        ]);
      }
    });

    const [orders] = await db.query(
      `SELECT * FROM product_order WHERE status = 'pending'`
    );

    const result = await Promise.all(
      orders.map(async (order) => {
        const [carts] = await db.query(
          `SELECT * FROM order_item WHERE order_id = ?`,
          [order.order_id]
        );
        const res = await Promise.all(
          carts.map(async (cart) => {
            const [[result]] = await db.query(
              `SELECT * FROM cart WHERE cart_id = ?`,
              [cart.cart_id]
            );
            const [selectedOptions] = await db.query(
              `SELECT * FROM selected_option_item WHERE cart_id = ?`,
              [cart.cart_id]
            );
            return {
              ...result,
              selected_options: await Promise.all(
                selectedOptions.map(async (selected) => {
                  const [[result]] = await db.query(
                    "SELECT * FROM product_option_item WHERE item_id = ?",
                    [selected.item_id]
                  );
                  return result;
                })
              ),
            };
          })
        );
        return {
          order_id: order.order_id,
          table_number: order.table_number,
          user_id: order.user_id,
          order_mode: order.order_mode,
          order_timestamp: order.order_timestamp,
          status: order.status,
          carts: res,
        };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function deleteOrder(req, res) {
  try {
    const [orderItems] = await db.query(
      `SELECT * FROM order_item WHERE order_id = ?`,
      [req.params.id]
    );
    await orderItems.forEach(async (orderItem) => {
      await db.query(`DELETE FROM cart WHERE cart_id = ?`, [orderItem.cart_id]);
    });
    await db.query(`DELETE FROM product_order WHERE order_id = ?`, [
      req.params.id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function updateOrder(req, res) {
  try {
    await db.query(`UPDATE product_order SET status = ? WHERE order_id = ?`, [
      req.body.status,
      req.params.id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function addOrder(req, res) {
  const data = req.body;
  console.log(data);
  try {
    await db.query(
      `INSERT INTO product_order(order_id, table_number, user_id, status, order_mode, order_timestamp) 
      VALUES(?, ?, ?, ?, ?, ?)`,
      [
        data.order_id,
        data.table_number,
        data.user_id,
        data.status,
        data.order_mode,
        data.order_timestamp,
      ]
    );
    data.carts.forEach(async (cart) => {
      await db.query(`INSERT INTO order_item(order_id, cart_id) VALUES(?, ?)`, [
        data.order_id,
        cart.cart_id,
      ]);
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

module.exports = { addOrder, updateOrder, deleteOrder, getAllOrders, getOrder };
