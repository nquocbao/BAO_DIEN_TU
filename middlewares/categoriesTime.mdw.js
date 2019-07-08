var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.bytime().then(rows => 
    {
        res.locals.lcCateTime = rows;
        next();
    });
}