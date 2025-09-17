import products from '../../models/Product.model.js'

async function addProduct(req, res) {
    try {
        let { tags = [], price, description, type, name } = req.body;

        await products.create({
            name, tags, price, description, type
        });

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).send(error?.message||'')
        console.log(error)
    }
}

export { addProduct }