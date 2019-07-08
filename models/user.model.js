var db = require('../utils/db');

module.exports = {
checktk: () =>
{
  return db.load('select *, day(DayDeadline) as day, month(DayDeadline) as month, year(DayDeadline) as year from users');
},

  all: () => {
    return db.load('select *, day(f_DOB) as day, month(f_DOB) as month, year(f_DOB) as year from users');
  },

confirmEmail: email =>
{
  return db.load(`select * from users where f_Email = '${email}'`);
},

  single: id => {
    return db.load(`select *, day(f_DOB) as day, month(f_DOB) as month, year(f_DOB)as year from users where f_ID = ${id}`);
  },

  singleByUserName: userName => {
    return db.load(`select *, day(f_DOB) as day, month(f_DOB) as month, year(f_DOB)as year  from users where f_Username = '${userName}'`);
  },

  add: entity => {
    return db.add('users', entity);
  },

  update: (entity, id) => {
    //var id = entity.f_ID;
    //delete entity.f_ID;
    return db.update('users', 'f_ID', entity, id);
  },

  delete: id => {
    return db.delete('users', 'f_ID', id);
  }
};
