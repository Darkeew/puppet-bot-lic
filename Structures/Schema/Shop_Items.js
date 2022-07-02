const { mongoose } = require('mongoose')

const Shop_Items = new mongoose.Schema({
            name: `String`,
            description: `String`,
            price: `Number`,
            role: `String`,
            page: `Number`,
            stock: `Number`,
})

const ShopItems = mongoose.model('Shop_Items', Shop_Items)

module.exports = ShopItems