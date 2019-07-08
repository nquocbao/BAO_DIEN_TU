// var LRU = require("lru-cache");
// var categoryModel = require('../models/category.model');

// var cache_options =
//  { 
//     max: 500,
//     maxAge: 1000 * 60
//  }

// var cache = new LRU(cache_options);
// module.exports = (req, res, next) => {
//     var data = cache.get('globalCategories');
//     if(!data)
//     {
//         console.log('-- fetch `globalCategories`');
//         categoryModel.allWithDetails().then(rows => 
//         {
//             cache.set('globalCategories', rows);
//             res.locals.lcCategories = rows;
//             next();
//         });
//     }
//     else
//     {
//         console.log('-- cache hit for `globalCategories`');
//         for(c of data)
//         {
//             delete c.active;
//         }
//         res.locals.lcCategories = data;
//         next();
//     }
// }

var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.allWithDetails().then(rows => 
    {
        res.locals.lcCategories = rows;
        next();
    });

}
