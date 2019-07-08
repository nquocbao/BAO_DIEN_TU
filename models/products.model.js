var db = require('../utils/db');
var config = require('../config/default.json')

module.exports = {
    allcate: () =>
    {
        return db.load('select * from categories');
    },
    allproduct: () =>
    {
        return db.load('select * from categories c join products p on c.CatID = p.CatID');
    },
    all: () =>
    {
        return db.load('select * from products');
    },

    allByCat: catId =>
    {
        return db.load('select * from products p join categories c on c.CatID = p.CatID  where p.CatID =' + catId);
    },

    By1Cat: id =>
    {
        return db.load(`select *,  day(p.DateSummitted) as day, month(p.DateSummitted) as month, year(p.DateSummitted) as year from products p join categories c on c.CatID = p.CatID  join tagproducts t on t.ProductID = p.ProID  where t.TagID = ${id}`);
    },

    countByCat: catId =>
    {
        return db.load(`select count(*) as total from products p join categories c on c.CatID = p.CatID  
        where p.status = 2 and p.CatID = ${catId}`);
    },

    pageByCat: (catId, start_offset) =>
    {
        var lim = config.paginate.default;
        return db.load(`select *, day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p join categories c on c.CatID = p.CatID
          where p.status = 2 and p.CatID = ${catId} limit ${lim} offset ${start_offset}`);
    },

    single: id =>
    {
        return db.load(`select *, day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p, categories c where c.CatID = p.CatID  and p.ProID = ${id}`);
    },

    /**
     * @param {*} entity {CatName: ...}
     */
    add: entity => 
    {
        return db.add('products', entity);
    },

    /**
     * @param {*} entity {CatID, CatName}
     */
    update: (entity, id) => 
    {
        return db.update('products','ProID', entity, id);
    },

    delete: id => 
    {
        return db.delete('products','ProID', id);
    },

    search: search =>
    {
        return db.load(`SELECT * ,day(DateSummitted) as day, month(DateSummitted) as month, year(DateSummitted) as year from products p , categories c WHERE c.CatID= p.CatID and p.status = 2 and MATCH(TitleName,MainContent,FullContent) AGAINST('${search}')`);
    },

    Fiveproduct: (id, proid) =>
    {
        return db.load(`select * from products p , categories c where  c.CatID = p.CatID and p.status = 2
        and c.CatID = ${id} and p.ProID != ${proid} order by p.DateSummitted DESC limit 5`);
    },

    alltagproducts: id => {
        return db.load(`select *  from tags t, tagproducts pc, products p
                       where t.TagID= pc.TagID and p.ProID = pc.ProductID
                       and p.ProID = ${id}`);
      },

      personal: id =>
      {
          return db.load(`select * from categories c, products p where c.CatID = p.CatID and p.UserID = ${id} `);
      },

      editwriter: id =>
      {
          return db.load(`select * from categories c, products p where c.CatID = p.CatID and p.UserID = ${id} and (p.status = 0 OR p.status = -1)`);
      },

      premium: () =>
    {
        return db.load(`select *, day(p.DateSummitted) as day, month(p.DateSummitted) as month, year(p.DateSummitted) as year
                      from categories c join products p on c.CatID = p.CatID where TypePro = 1`);
    },
    
};

