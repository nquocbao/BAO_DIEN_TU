var db = require('../utils/db');

module.exports = {

allOrigin: () =>
{
    return db.load('select * from origincategories');
}

};
