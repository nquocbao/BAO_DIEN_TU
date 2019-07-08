var db = require('../utils/db');
var config = require('../config/default.json')

module.exports = {
    all: () =>
    {
        return db.load('select * from comments c join Users u on c.UserID = u.f_ID');
    },

    single: id =>
    {
        return db.load(`select *, day(c.DateSubmit) as day, month(c.DateSubmit) as month,
                         year(c.DateSubmit) as year, hour(c.DateSubmit) as hour, minute(c.DateSubmit) as minute
                         from comments c, products p, users u
                         where c.ProID = p.ProID and c.UserID = u.f_ID and c.ProID = ${id} order by c.DateSubmit DESC limit 5`);
        // return db.load(`select * from recomments r RIGHT join comments c on r.ComID = c.ComID
        //                 join products p on p.ProID = c.ProID 
        //                 join users u on c.UserID = u.f_ID where p.ProID = ${id}`);
    },

    /**
     * @param {*} entity {CatName: ...}
     */
    add: entity => 
    {
        return db.add('comments', entity);
    },

    /**
     * @param {*} entity {CatID, CatName}
     */
    update: (entity, id) => 
    {
        return db.update('comments','ComID', entity, id);
    },

    delete: id => 
    {
        return db.delete('comments','ComID', id);
    },
};

