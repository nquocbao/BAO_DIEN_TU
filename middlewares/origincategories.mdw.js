var OriginModel = require('../models/origincategories.model');

module.exports = (req, res, next) => {
    OriginModel.allOrigin().then(rows => 
    {
        res.locals.lcOrigin = rows;
        next();
    });
}