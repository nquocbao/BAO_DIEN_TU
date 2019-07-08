var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.byViewBiggest().then(rows => 
    {
        res.locals.lcCateViewBiggest = rows;
        next();
    });
}