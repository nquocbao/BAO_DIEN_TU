var mysql = require('mysql');
var config = require('../config/default.json')

var createConnection = () => mysql.createConnection(config['mysql']);

module.exports = 
{
    load: sql => 
    {
        return new Promise( (resolve, reject ) => 
        {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error,result, fields) =>
            {
                if(error)
                {
                    reject(error);
                }
                else
                {
                    resolve(result);
                }
                connection.end();
            });
        });
    },
   
    add: (tableName, entity) =>
    {
        return new Promise( (resolve, reject ) =>
        {
            var connection = createConnection();
            var sql = `insert  ${tableName} set ?`;
            connection.connect();
            connection.query(sql, entity, (error,results) =>
            {
                if(error)
                {
                    reject(error);
                }
                else
                {
                    resolve(results.insertId);
                }
                connection.end();
            });
        });
    },

    update: (tableName, idField, entity, id) =>
    {
        return new Promise( (resolve, reject ) =>
        {
            var connection = createConnection();
            var sql = `update ${tableName} set ? where ${idField} = ?`;
            connection.connect();
            connection.query(sql, [entity, id], (error,result, fields) =>
            {
                if(error)
                {
                    reject(error);
                }
                else
                {
                    resolve(result.changedRows);
                }
                connection.end();
            });
        });
    },

    delete: (tableName, idField, id) =>
    {
        return new Promise( (resolve, reject ) =>
        {
            var connection = createConnection();
            var sql = `delete from ${tableName} where ${idField} = ?`;
            connection.connect();
            connection.query(sql, id, (error,result, fields) =>
            {
                if(error)
                {
                    reject(error);
                }
                else
                {
                    resolve(result.affectedRows);
                }
                connection.end();
            });
        });
    }
}
