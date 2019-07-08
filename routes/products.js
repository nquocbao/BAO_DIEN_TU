var express = require('express');
var productModel = require('../models/products.model'); 
var commentsModel = require('../models/comments.model');
var recommentModel = require('../models/recomment.model');
var tagModel =  require('../models/tags.model');
var restricted = require('../middlewares/restricted');


var rounter = express.Router();

rounter.get('/add', restricted, (req, res, next) =>
{
    var addtag;
    tagModel.allTags().then(rows =>
    {
        addtag = rows
    }).catch(next);

    productModel.allcate().then( rows => 
    {
        addproducts = rows
        res.render('vwProducts/add', {
                    error: false,
                    empty: rows.length === 0,
                    addproducts,
                    addtag
                     });
                    }).catch(next);
});

rounter.post('/add', restricted, (req, res, next) =>
{ 
   var d = new Date();
   var t = d.getMonth() + 1;
   var entity = req.body;
   entity.status = 0;
   entity.View = 0;
   entity.TypePro = 0;
   entity.DateSummitted = d.getFullYear() + '/' + t + '/' +  d.getDate();
   entity.UserID = req.session.passport.user.f_ID;
   delete entity.fuMain;
   productModel.add(entity).then(id =>
  {
    res.redirect('/products');
   });
});

rounter.get('/edit/:id', (req, res, next) =>
{
    var id = req.params.id;
    productModel.single(id).then( rows => 
    {
        res.render('vwProducts/edit', {
                    error: false,
                    empty: rows.length === 0,
                    editproducts:rows });
                    }).catch(next);
});

rounter.post('/edit/:id', (req, res, next) =>
{ 
    var id = req.params.id;
    var entity = req.body;
    if(entity.Avatar == '')
         delete entity.Avatar;
    entity.ProID = id;
    delete entity.fuMain;
    productModel.update(entity, entity.ProID).then(id =>
    {
          return res.redirect(`/products`);
    }) 
}); 
//
rounter.get('/editCate/:id', (req, res, next) =>
{
    var id = req.params.id;
    productModel.single(id).then( rows => 
    {
        res.render('vwProducts/updateCate', {
                    error: false,
                    empty: rows.length === 0,
                    editCateP:rows });
                    }).catch(next);
});

rounter.post('/editCate/:id', (req, res, next) =>
{
    var id = req.params.id;
    var entity = req.body;
    entity.ProID = id;
    delete entity.fuMain;
    productModel.update(entity, entity.ProID).then(id =>
    {
          return res.redirect(`/products`);
    }) 
   
});
rounter.post('/delete/:id', (req, res) =>
{  
    var id = req.params.id;
    var entity = req.body;
    entity.ProID = id;
    productModel.delete(+entity.ProID).then( n =>
    {
        res.redirect('/products');
    });
})
//---------- comment ---------\

rounter.post('/comment/:id/:CatID', (req, res, next) =>
{  
    var id = req.params.id;
    var CatID = req.params.CatID;
    var entity = req.body;
    entity.UserID = req.session.passport.user.f_ID
    entity.ProID = id;
    var d = new Date();
    entity.DateSubmit = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' 
                      + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var t = id;
   console.log(entity);
     commentsModel.add(entity).then(id =>
    {
        return res.redirect(`/products/${t}/${CatID}`);     
    })
});
//---------- Recomment ---------\
rounter.post('/recomment/:id/:CatID', (req, res, next) =>
{  
    var id = req.params.id;
    var CatID = req.params.CatID;
    var entity = req.body;
   // entity.UserID = req.session.passport.user.f_ID
   // entity.ProID = id;
    var d = new Date();
    entity.ComID = id;
    entity.DateSubmitRe = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' 
                      + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var t = id;
   console.log(entity);
     recommentModel.add(entity).then(id =>
    {
        return res.redirect(`/products/${t}/${CatID}`);     
    })
});
// ------------search---------------
rounter.post(`/search`, (req, res, next) =>
{  
    var entity = req.body;
    console.log(entity.search);
//res.end('finish')
    productModel.search(entity.search).then( rows => 
        {
            res.render('vwProducts/search', {
                error: false,
                empty: rows.length === 0,
                searchpro:rows
            });
        }).catch(next)
})

//------------------------------
rounter.get('/:id/:CatID', (req, res, next) =>
{
    var id = req.params.id;
    var CatID = req.params.CatID;
    if(isNaN(id))
    {
        res.render('vwProducts/detail', { error:true });
        return;
    };
var tagp;
    productModel.alltagproducts(id).then( rows =>
        {
            tagp = rows;
        }).catch(next);

   var product;
    productModel.single(id).then( rows =>
    {
        product = rows;
    }).catch(next);
    
    var fiveproduct;
    productModel.Fiveproduct(CatID, id).then( rows =>
    {
        fiveproduct = rows;
    }).catch(next);

    var comment;
    commentsModel.single(id).then(rows=>{
        comment = rows;
        res.render('vwProducts/detail', {
                 error: false,
                   empty: rows.length === 0,
                     error:false, product, fiveproduct, comment, tagp});
    }).catch(next);
})



rounter.get('/full/:id/sp', (req, res, next) =>
{
    var id = req.params.id;
    productModel.single(id).then( rows => 
        {
            res.render('vwProducts/fullDes', {
                error: false,
                empty: rows.length === 0,
                productFullDes:rows
            });
        })
});

rounter.get('/editwriter/:id/sp', restricted, (req, res, next) =>
{
    var id = req.params.id;
    productModel.editwriter(id).then( rows => 
        {
            res.render('vwProducts/editWriter', {
                error: false,
                empty: rows.length === 0,
                productEditWriter:rows
            }).catch(next);
        })
});

rounter.get('/', restricted, (req, res, next) =>
{
    productModel.allproduct().then( rows => 
    {
        res.render('vwProducts/index', {
                    error: false,
                    empty: rows.length === 0,
                    products:rows });
                }).catch(next);
});
// Duyet bai viet admin
rounter.post('/checkpass/:id', (req, res) =>
{  
    var id = req.params.id;
    var entity = req.body;
    entity.ProID = id;
    entity.status = 2;
    entity.Comment = ' ';
    productModel.update(entity, id).then( n =>
    {
        res.redirect('/products');
    });
})
// Duyet bai biet Editor cho xuat ban
rounter.post('/CheckEditor/:id', (req, res) =>
{  
    var id = req.params.id;
    var entity = req.body;
    entity.ProID = id;
    entity.status = 1;
    entity.Comment = ' ';
    productModel.update(entity, id).then( n =>
    {
        res.redirect('/products');
    });
})
// Bao loi bai viet Editor
rounter.post('/ErrorEditor/:id', (req, res) =>
{  
    var id = req.params.id;
    var entity = req.body;
    entity.ProID = id;
    entity.status = -1;
    productModel.update(entity, id).then( n =>
    {
        res.redirect('/products');
    });
})
// xem cac bai viet ca nhan da dang
rounter.get('/personal/:id/sp', restricted, (req, res, next) =>
{
    var id = req.params.id;
    productModel.personal(id).then( rows =>
   {
        res.render('vwProducts/personal',
        {
            error: false,
            personal: rows
        });
    }).catch(next);           
});
// update bai viet len vip
rounter.post('/vip/:id', restricted, (req, res, next) =>
{ 
    var id = req.params.id;
    var entity = req.body;
    entity.TypePro = 1;
   productModel.update(entity, id).then(id =>
  {
    res.redirect('/products');
   });
});

// bo vip
rounter.post('/unvip/:id', restricted, (req, res, next) =>
{ 
    var id = req.params.id;
    var entity = req.body;
    entity.TypePro = 0;
   productModel.update(entity, id).then(id =>
  {
    res.redirect('/products');
   });
});
module.exports = rounter;


