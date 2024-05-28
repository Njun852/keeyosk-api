const db = require("../db");
const { options } = require("../routes/productOption");

async function addOptionWithItems(req) {
  req.body.options.forEach(async (option) => {
    await db.query(
      `
        INSERT INTO product_option(
            option_id, product_id, option_name, is_required, is_multiselect) 
            VALUES(?, ?, ?, ?, ?);`,
      [
        option.option_id,
        req.body.product_id,
        option.option_name,
        option.is_required,
        option.is_multiselect,
      ]
    );
    console.log(option.option_id);
    option.option_items.forEach(async (item) => {
      await db.query(
        `INSERT INTO product_option_item(item_id, option_id, 
                item_name, additional_price) VALUES(?, ?, ?, ?)`,
        [item.item_id, option.option_id, item.item_name, item.additional_price]
      );
    });
  });

  req.body.images.forEach(async (image) => {
    const imgBuffer = Buffer.from(image.file);

    await db.query(
      "INSERT INTO product_image(image_id, product_id, image) VALUES(?, ?, ?)",
      [image.image_id, req.body.product_id, imgBuffer]
    );
  });
}
async function addProduct(req, res) {
  console.log('what????');
  try {
    await db.query(
      `INSERT INTO product(product_id, category_id, 
            product_name, price, discount, description, is_available) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.product_id,
        req.body.category_id,
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
  console.log('heyyyy')
    try {
    await db.query(
      `UPDATE product SET category_id = ?, product_name = ?,
        price = ?, discount = ?, description = ?, is_available = ? WHERE product_id = ?`,
      [
        req.body.category_id,
        req.body.product_name,
        req.body.price,
        req.body.discount,
        req.body.description,
        req.body.is_available,
        req.params.id,
      ]
    );
    await db.query("DELETE product_option WHERE product_id = ?", [
      req.params.id,
    ]);
    await addOptionWithItems(req);

    res.send(200);
  } catch (error) {
    res.send(400);
  }
}
async function deleteProduct(req, res) {
  try {
    await db.query("DELETE FROM product WHERE product_id = ?", [req.params.id]);
    res.send(200);
  } catch (error) {
    console.log(error)
    res.send(400);
  }
}
async function getProduct(req, res) {
  try {
    const [[product]] = await db.query(
      "SELECT * FROM product WHERE product_id = ?",
      [req.params.id]
    );
    const [options] = await db.query(
      "SELECT * FROM product_option WHERE product_id = ?",
      [req.params.id]
    );

    const optionItems = await Promise.all(
      options.map(async (option) => {
        const [results] = await db.query(
          "SELECT * FROM product_option_item WHERE option_id = ?",
          [option.option_id]
        );
        return results;
      })
    );

    const [images] = await db.query(
      "SELECT * FROM product_image WHERE product_id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        product_id: req.params.id,
        price: product.price,
        discount: product.discount,
        is_available: product.is_available,
        description: product.description,
        product_name: product.product_name,
        category_id: product.category_id,
        images: images,
        options: options.map((option, index) => ({
          option_id: option.option_id,
          option_name: option.option_name,
          is_required: option.is_required,
          is_multiselect: option.is_multiselect,
          option_items: optionItems[index],
        })),
      },
    });
  } catch (error) {
    console.log(error);
    res.send(400);
  }
}
async function getAllProduct(req, res) {
  try {
    const [products] = await db.query("SELECT * FROM product", [req.params.id]);

    const result = await Promise.all(
      products.map(async (product) => {
        const [options] = await db.query(
          "SELECT * FROM product_option WHERE product_id = ?",
          [product.product_id]
        );

        const optionItems = await Promise.all(
          options.map(async (option) => {
            const [results] = await db.query(
              "SELECT * FROM product_option_item WHERE option_id = ?",
              [option.option_id]
            );
            return results;
          })
        );

        const [images] = await db.query(
          "SELECT * FROM product_image WHERE product_id = ?",
          [product.product_id]
        );

        return {
          product_id: product.product_id,
          price: product.price,
          discount: product.discount,
          is_available: product.is_available,
          description: product.description,
          product_name: product.product_name,
          category_id: product.category_id,
          images: images,
          options: options.map((option, index) => ({
            option_id: option.option_id,
            option_name: option.option_name,
            is_required: option.is_required,
            is_multiselect: option.is_multiselect,
            option_items: optionItems[index],
          })),
        };
      })
    );
    res.json({
      success: true,
      data: result,
    });
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
