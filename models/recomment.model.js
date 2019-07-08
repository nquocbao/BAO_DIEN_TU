var db = require('../utils/db');
var config = require('../config/default.json')

module.exports = {
    all: () =>
    {
        return db.load('select * from recomments');
    },

    /**
     * @param {*} entity {CatName: ...}
     */
    add: entity => 
    {
        return db.add('recomments', entity);
    },

    /**
     * @param {*} entity {CatID, CatName}
     */
    update: (entity, id) => 
    {
        return db.update('recomments','RecomID', entity, id);
    },

    delete: id => 
    {
        return db.delete('recomments','RecomID', id);
    },
};

