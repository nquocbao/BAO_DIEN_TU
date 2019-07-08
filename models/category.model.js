var db = require('../utils/db');

module.exports = {
    all: () =>
    {
        return db.load('select * from categories');
    },

    allWithDetails: () =>
    {
        return db.load(`select c.*, count(p.ProID) as number_of_products from categories c left join products p
         on c.CatID = p.CatID and p.status = 2 group by c.CatID`);
        //  select c.*, count(p.ProID) as number_of_products
        //  from categories c left join products p on c.CatID = p.CatID
        //   group by c.CatID, c.CatName
    },

    bytime: () =>
    {
        return db.load(`select *, day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p join categories c on c.CatID = p.CatID
        where p.status = 2 order by p.DateSummitted DESC limit 10`);
    },

    byView: () =>
    {
        return db.load(`select *, day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p join categories c on c.CatID = p.CatID
        where p.status = 2 order by p.View DESC limit 10`);
    },

    byTimeView: () =>
    {
        return db.load(`select *,day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year
        from products p join categories c on c.CatID = p.CatID where p.status = 2 order by  p.View, p.DateSummitted DESC limit 1`);
    },

    byViewBiggest: () =>
    {
        return db.load(`select *, day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p
        join categories c on c.CatID = p.CatID where p.status = 2 order by  p.View DESC limit 3`);
    },

    byMaxView: () =>
    {
        return db.load(`select p.*, c.*, MAX(p.View) as temp from products p join categories c on c.CatID = p.CatID
        where p.status = 2 group by c.CatID limit 10`);
    },

    single: id =>
    {
        return db.load('select * from categories where CatID =' + id);
    },

    /**
     * @param {*} entity {CatName: ...}
     */
    add: entity =>
    {
        return db.add('categories', entity);
    },

    /**
     * @param {*} entity {CatID, CatName}
     */
    update: entity =>
    {
        var id = entity.CatID
        delete entity.CatID;
        return db.update('categories','CatID', entity, id);
    },

    updatePC: (entity, id) =>
    {
        return db.update('categories','CatID', entity, id);
    },

    delete: id =>
    {
        return db.delete('categories','CatID', id);
    },

    phancong: () =>
    {
        return db.load(`select * from users where f_Permission = 3`);
    },

    showCate: () =>
    {
        return db.load(`select * from categories c left  join users u on c.EditerID = u.f_ID`);
    },

    showCateid: id =>
    {
        return db.load(`select * from categories c left  join users u on c.EditerID = u.f_ID
        where c.CatID = ${id}`);
    }
};

