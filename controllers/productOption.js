const db = require('../db')
async function addProductOption(req, res)  {
    const options = req.body
    try {
        const args = []
        let val = ''
        for(let i = 0; i < options.length; i++) {
            val += '(?, ?, ?, ?, ?)'
            if(i != options.length-1) {
                val += ','
            }
            args.push(options[i].option_id, options[i].product_id, 
                options[i].option_name, options[i].is_required, options[i].is_multiselect)
        }
        
        await db.query(`
        INSERT INTO product_option(
            option_id, product_id, option_name, is_required, is_multiselect) 
            VALUES${val};`, args)

    
        options.array.forEach(async option =>  {
        await db.query(`
        INSERT INTO product_option(
            option_id, product_id, option_name, is_required, is_multiselect) 
            VALUES(?, ?, ?, ?, ?);`,
            [option.option_id, option.product_id, option.option_name, option.is_required, option.is_multiselect]
        )
        });
        res.json({success: true, message: "Added option"})
    } catch (error) {
        console.log(error)
        res.send(400)
    }
}
async function deleteProductOption(req, res) {
    const id = req.params.id
    try {
        await db.query('DELETE FROM product_option WHERE option_id = ?', [id])
        res.json({success: true, message: "Deleted product option"})
    } catch (error) {
        console.log(error)
        res.send(400)
    }
}
async function editProductOption(req, res) {
    const id = req.params.id
    const newData = req.body
    try {
        await db.query(`UPDATE product_option SET option_name = ?, 
        option_is_required = ?, option_is_multiselect = ?`, 
        [newData.option_name, newData.is_required, newData.is_multiselect])
        res.json({success: true, message: "Updated product option"})
    } catch (error) {
        console.log(error)
        res.send(400)
    }
}
//do i need to read the product option here?

module.exports = {addProductOption, deleteProductOption, editProductOption}