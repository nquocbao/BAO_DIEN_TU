var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.byTimeView().then(rows => 
    {
        res.locals.lcCateTimeView = rows;
        next();
    });
}