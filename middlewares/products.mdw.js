var productModel = require('../models/products.model');

module.exports = (req, res, next) => {
    productModel.all().then(rows => 
    {
        res.locals.lcProducts = rows;
        next();
    });

}
