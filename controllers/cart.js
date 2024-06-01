const db = require("../db");

async function getCart(req, res) {

  try {
    const [[result]] = await db.query(`SELECT * FROM cart WHERE cart_id = ?`, [
      req.params.id,
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function addCart(req, res) {
  const data = req.body;
  try {
    await db.query(
      `INSERT INTO cart(cart_id, product_id, quantity, user_id, is_hidden) VALUES (?, ?, ?, ?, 0)`,
      [data.cart_id, data.product_id, data.quantity, data.user_id]
    );
    console.log('why?', data.selected_options)
    data.selected_options.forEach(async (option) => {
      await db.query(
        `INSERT INTO selected_option_item( cart_id, item_id)
            VALUES( ?, ?)`,
        [data.cart_id, option.item_id]
      );
    });
    console.log('added cart')
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function removeCart(req, res) {
  try {
    await db.query("DELETE FROM cart WHERE cart_id = ?", [req.params.id]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function editCart(req, res) {
  console.log('this should run')
  try {
    await db.query(
      "UPDATE cart SET quantity = ?, is_hidden = ? WHERE cart_id = ?",
      [req.body.quantity, req.body.is_hidden, req.params.id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function getAllCart(req, res) {
  try {
    const [results] = await db.query("SELECT * FROM cart WHERE user_id = ?", [
      req.params.id,
    ]);
    //this is very ugly
    const data = await Promise.all(
      results.map(async (result) => {
        const [results] = await db.query(
          `SELECT * FROM selected_option_item WHERE cart_id = ?`,
          [result.cart_id]
        );
        return {
          ...result,
          selected_options: await Promise.all(
            results.map(async (option) => {
              const [[res]] = await db.query(
                `SELECT * FROM product_option_item WHERE item_id = ?`,
                [option.item_id]
              );
              return res;
            })
          ),
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

module.exports = { getCart, getAllCart, editCart, removeCart, addCart };
