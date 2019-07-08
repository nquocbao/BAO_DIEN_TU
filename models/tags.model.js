var db = require('../utils/db');

module.exports = {
  all: () => {
    return db.load(`select *  from tags t, tagcategories tc, categories c
                   where t.TagID= tc.TagID and c.CatID = tc.CategoryID`);
  },

  alltagproducts: () => {
    return db.load(`select *  from tags t, tagproducts pc, products p
                   where t.TagID= pc.TagID and p.ProID = pc.ProductID`);
  },

  sigdle: id => {
    return db.load(`select * from tags t, tagcategories tc where t.TagID = tc.TagID 
                    and tc.id = ${id}`);
  },

  sigdlep: id => {
    return db.load(`select * from tags t, tagproducts tc, products p where t.TagID = tc.TagID 
                  and p.ProID = tc.ProductID  and tc.id = ${id} `);
  },

  allTags: () => 
  {
    return db.load('select * from tags');
  },
  
  singleTags: id => 
  {
    return db.load(`select * from tags where TagID = ${id}`);
  },

  add: entity => {
    return db.add('tags', entity);
  },

  addcate: entity => {
    return db.add('tagcategories', entity);
  },

  addpro: entity => {
    return db.add('tagproducts', entity);
  },

  update: (entity, id) => {
    return db.update('tags', 'TagID', entity, id);
  },

  updateCate: (entity, id) => {
    return db.update('tagcategories', 'id', entity, id);
  },

  updatePro: (entity, id) => {
    return db.update('tagproducts', 'id', entity, id);
  },

  delete: id => 
  {
        return db.delete('tags','TagID', id);
  },

  counttag: id =>
  {
    return db.load(`select *, count(tp.TagID) from tags t, tagproducts tp where t.TagID = tp.TagID and t.TagID = ${id} group by t.TagID`)
  },

  counttagcate: id =>
  {
    return db.load(`select *, count(tp.TagID) from tags t, tagcategories tp where t.TagID = tp.TagID and t.TagID = ${id} group by t.TagID`)
  }

};
