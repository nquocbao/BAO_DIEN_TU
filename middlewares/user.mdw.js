var userModel = require('../models/user.model');

module.exports = (req, res, next) => {
    userModel.checktk().then(rows => 
    {
        res.locals.lcUser = rows;
        next();
    });
}