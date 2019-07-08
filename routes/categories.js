var express = require('express');
var categoryModel = require('../models/category.model');
var productModel = require('../models/products.model'); 
var config = require('../config/default.json');
var tagcategoryModel = require('../models/tags.model');

var rounter = express.Router();

rounter.get('/', (req, res, next) =>
{
   categoryModel.showCate()
   .then(rows =>
    {
       res.render('VwCategories/index', { categories: rows });
    })
    .catch(next)
    //(error =>
    // {
    //     res.render('error', {layout: false});
    // });
});

rounter.get('/add', (req, res) =>
{
    res.render('vwCategories/add')
})

rounter.post('/add', (req, res) =>
{ 
    categoryModel.add(req.body).then(id =>
        {
            res.redirect('/categories');
            // console.log(id);
            // res.render('categories/add')
        });
})

rounter.get('/edit/:id', (req, res, next) =>
{
    var id = req.params.id;
    if(isNaN(id))
    {
        res.render('vwCategories/edit', { error:true });
        return;
    }
    var category
    categoryModel.single(id).then( rows =>
    {
        if(rows.length > 0)
        {
            category = rows[0];
          //  res.render('vwCategories/edit', {error:false, category: rows[0]});
        }
       // else
           // res.render('vwCategories/edit', { error:true });
    });
    var manager;
    categoryModel.showCateid(id).then( rows => 
    {
        manager = rows[0];
    })
   
    categoryModel.phancong().then( rows => 
        {
            res.render('vwCategories/edit', 
            {error: false, empty: rows.length === 0, AssignCate:rows,category, manager});
    }).catch(next)
     
})

rounter.post('/update', (req, res, next) =>
{ 
    var entity = res.body;
    categoryModel.update(req.body).then( n =>
    {
        res.redirect('/categories');
    });
})

rounter.post('/delete', (req, res) =>
{ 
    categoryModel.delete(+req.body.CatID).then( n =>
    {
        res.redirect('/categories');
    });
})

// rounter.get('/:id/products', (req, res, next) =>
// {
//     var id = req.params.id;
//     if(isNaN(id))
//     {
//         res.render('vwProducts/byCat', {error:true});
//         return;
//     }
//     productModel.allByCat(id).then( rows => 
//         {
//             for(var c of res.locals.lcCategories)
//             {
//                 if(c.CatID == +id)
//                 {
//                     c.active = true;
//                 }
//             }
//             res.render('vwProducts/byCat', {
//                 error: false,
//                 empty: rows.length === 0,
//                 products:rows,
//                 //categories: rows
                
//             });
//         }).catch(next)
// })

rounter.get('/:id/products', (req, res, next) =>
{
    var id = req.params.id;
    if(isNaN(id))
    {
        res.render('vwProducts/byCat', {error:true});
        return;
    }

    var tagcategory;
    tagcategoryModel.all().then( rows =>
    {
        tagcategory = rows;
    }).catch(next);

   var limit= config.paginate.default;
   var page = req.query.page || 1;
   if (page < 1)
       page = 1;
   var start_offset = (page - 1)*limit;

    Promise.all([
        productModel.countByCat(id),
        productModel.pageByCat(id, start_offset)
    ]).then(([nRows, rows])=> 
    {
        for(var c of res.locals.lcCategories)
       {
            if(c.CatID === +id)
                c.active = true;
       }

       var total = nRows[0].total;
       var npages = Math.floor(total/limit);
       if(total % limit)
            npages ++;
        var page_numbers =[];
        for( i = 1; i <= npages; i++)
        {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }

       res.render('vwProducts/byCat', 
       {
         error: false,
         empty: rows.length === 0,
         products:rows,
         tagcategory,
         page_numbers               
        });
    }).catch(next)    
})

// show sp theo tags
rounter.get('/:id/products/tags', (req, res, next) =>
{
    var id = req.params.id;
    if(isNaN(id))
    {
        res.render('vwProducts/by1Cat', {error:true});
        return;
    }

    var tagcategory;
    tagcategoryModel.all().then( rows =>
    {
        tagcategory = rows;
    }).catch(next);

    productModel.By1Cat(id).then( rows => 
        {
            res.render('vwProducts/by1Cat', {
                error: false,
                empty: rows.length === 0,
                productstags:rows,
                tagcategory 
            });
        }).catch(next)
})

// phan cong chuyen muc cho bien tap vien
rounter.get('/assigned', (req, res, next) =>
{ 
    categoryModel.phancong().then( rows => 
        {
            res.render('vwCategories/Assigned', {
                error: false,
                empty: rows.length === 0,
                AssignCate:rows,
            });
        }).catch(next)
})

rounter.post('/assigned', (req, res) =>
{ 
    var entity = req.body;
  var id = entity.CatID
    categoryModel.updatePC(entity, id ).then( n =>
    {
        res.redirect('/categories');
    });
})
module.exports = rounter;

