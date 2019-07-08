var productModel = require('../models/products.model');

module.exports = (req, res, next) => {
    productModel.premium().then(rows => 
    {
        res.locals.lcPremium = rows;
        next();
    });

}
