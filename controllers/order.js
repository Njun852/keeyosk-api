const db = require("../db");

async function getOrder(req, res) {
  console.log("why here?");

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
    const [results] = await db.query(
      `SELECT * FROM product_order WHERE status = 'pending'`
    );
    const result = await Promise.all(
      results.map(async (result) => {
        const [carts] = await db.query(
          `SELECT * FROM order_item WHERE order_id = ?`,
          [result.order_id]
        );
        const res = await Promise.all(
          carts.map(async (cart) => {
            const [[result]] = await db.query(
              `SELECT * FROM cart WHERE cart_id = ?`,
              [cart.cart_id]
            );
            selected_options = await Promise.all(
              results.map(async (option) => {
                `SELECT * FROM product_option_item WHERE item_id = ?`,
                  [option.item_id];
                return result;
              })
            );
          })
        );
        console.log("aaaaaaaaaaaaa", res);
        return {
          order_id: result.order_id,
          table_number: result.table_number,
          order_date: result.order_date,
          user_id: result.user_id,
          order_mode: result.order_mode,
          order_hour: result.order_hour,
          status: result.status,
          carts: res,
        };
      })
    );
    res.json({ success: true, data: result });
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
    orderItems.forEach(async (orderItem) => {
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
  try {
    await db.query(
      `INSERT INTO product_order(order_id, table_number, user_id, status, order_mode, order_date, order_hour) 
      VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        data.order_id,
        data.table_number,
        data.user_id,
        data.status,
        data.order_mode,
        data.order_date,
        data.order_hour,
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
