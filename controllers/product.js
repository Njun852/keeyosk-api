const db = require("../db");
const { options } = require("../routes/productOption");

async function addOptionWithItems(req) {
  await req.body.options.forEach(async (option) => {
    await db.query(
      `
        INSERT INTO product_option(
            option_id, product_id, option_name, is_required, is_multiselect, created_at) 
            VALUES(?, ?, ?, ?, ?, ?);`,
      [
        option.option_id,
        req.body.product_id,
        option.option_name,
        option.is_required,
        option.is_multiselect,
        option.created_at,
      ]
    );
    await option.items.forEach(async (item) => {
      await db.query(
        `INSERT INTO product_option_item(item_id, option_id, 
                item_name, additional_price, created_at) VALUES(?, ?, ?, ?, ?)`,
        [
          item.item_id,
          option.option_id,
          item.item_name,
          item.additional_price,
          item.created_at,
        ]
      );
    });
  });
  const [selected] = await db.query(`SELECT * FROM selected_option_item`);
  await selected.forEach(async (item) => {
    const [match] = await db.query(
      `SELECT * FROM product_option_item WHERE
    item_id = ?`,
      [item.item_id]
    );
    if (match.length <= 0) {
      console.log("is gone");
      await db.query(`DELETE FROM selected_option_item WHERE item_id = ?`, [
        item.item_id,
      ]);
    }
  });
  await db.query("DELETE FROM product_image WHERE product_id = ?", [
    req.body.product_id,
  ]);
  await req.body.images.forEach(async (image) => {
    const imgBuffer = Buffer.from(image.file);
    await db.query(
      "INSERT INTO product_image(image_id, product_id, image) VALUES(?, ?, ?)",
      [image.image_id, req.body.product_id, imgBuffer]
    );
  });
}
async function addProduct(req, res) {
  try {
    await db.query(
      `INSERT INTO product(product_id, category_id, 
            product_name, price, discount, description, is_available) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.product_id,
        req.body.category.category_id,
        req.body.product_name,
        req.body.price,
        req.body.discount,
        req.body.description,
        req.body.is_available,
      ]
    );
    await addOptionWithItems(req);

    res.send(200);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}
async function updateProduct(req, res) {
  try {
    await db.query(
      `UPDATE product SET category_id = ?, product_name = ?,
        price = ?, discount = ?, description = ?, is_available = ? WHERE product_id = ?`,
      [
        req.body.category.category_id,
        req.body.product_name,
        req.body.price,
        req.body.discount,
        req.body.description,
        req.body.is_available,
        req.params.id,
      ]
    );
    await db.query("DELETE FROM product_option WHERE product_id = ?", [
      req.params.id,
    ]);
    await addOptionWithItems(req);

    res.send(200);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}
async function deleteProduct(req, res) {
  try {
    await db.query("DELETE FROM product WHERE product_id = ?", [req.params.id]);
    res.send(200);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}
async function getProduct(req, res) {
  try {
    const query = `SELECT product_id, product.category_id, 
    product_name, price, discount, is_available,
    description, category_label, is_available
    FROM product INNER JOIN category 
    ON category.category_id = product.category_id AND product.product_id = ?;`;
    const [[product]] = await db.query(query, [req.params.id]);

    const [images] = await db.query(
      "SELECT * FROM product_image WHERE product_id = ?",
      [product.product_id]
    );
    const [options] = await db.query(
      "SELECT * FROM product_option WHERE product_id = ?",
      [product.product_id]
    );
    const optionsWithItems = await Promise.all(
      options.map(async (option) => {
        const [optionItems] = await db.query(
          `SELECT item_id, item_name, additional_price 
          FROM product_option_item WHERE option_id = ?`,
          [option.option_id]
        );
        return {
          ...option,
          items: optionItems,
        };
      })
    );
    const data = {
      product_id: product.product_id,
      product_name: product.product_name,
      is_available: product.is_available,
      price: product.price,
      discount: product.discount,
      description: product.description,
      category: {
        category_id: product.category_id,
        category_label: product.category_label,
      },
      options: optionsWithItems,
      images: images.map((image) => ({
        image_id: image.image_id,
        product_id: image.product_id,
        file: JSON.parse(JSON.stringify(image.image)).data,
      })),
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}
async function getAllProduct(req, res) {
  try {
    const query = `SELECT product_id, product.category_id, 
    product_name, price, discount, is_available,
    description, category_label, is_available
    FROM product INNER JOIN category 
    ON category.category_id = product.category_id;`;

    const [products] = await db.query(query, [req.params.id]);
    const data = await Promise.all(
      products.map(async (product) => {
        const [images] = await db.query(
          "SELECT * FROM product_image WHERE product_id = ?",
          [product.product_id]
        );
        const [options] = await db.query(
          "SELECT * FROM product_option WHERE product_id = ? ORDER BY created_at",
          [product.product_id]
        );
        const optionsWithItems = await Promise.all(
          options.map(async (option) => {
            const [optionItems] = await db.query(
              `SELECT *
          FROM product_option_item WHERE option_id = ? ORDER BY created_at`,
              [option.option_id]
            );
            return {
              ...option,
              items: optionItems,
            };
          })
        );

        return {
          product_id: product.product_id,
          product_name: product.product_name,
          is_available: product.is_available,
          price: product.price,
          discount: product.discount,
          description: product.description,
          category: {
            category_id: product.category_id,
            category_label: product.category_label,
          },
          options: optionsWithItems,
          images: images.map((image) => ({
            image_id: image.image_id,
            product_id: image.product_id,
            file: JSON.parse(JSON.stringify(image.image)).data,
          })),
        };
      })
    );

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProduct,
};
