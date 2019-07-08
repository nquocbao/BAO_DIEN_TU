var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.byView().then(rows => 
    {
        res.locals.lcCateView = rows;
        next();
    });
}