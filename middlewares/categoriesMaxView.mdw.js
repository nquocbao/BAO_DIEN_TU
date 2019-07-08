var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.byMaxView().then(rows => 
    {
        res.locals.lcCateMaxView = rows;
        next();
    });
}