var express = require('express');
var tagcategoryModel = require('../models/tags.model');
var restricted = require('../middlewares/restricted');

var rounter = express.Router();
// trang index quan li tags
rounter.get('/index',restricted, (req, res, next) =>
{
    var tag;
    tagcategoryModel.allTags().then( rows => 
    {
        tag = rows      
    }).catch(next);

    var tagpro;
    tagcategoryModel.alltagproducts().then( rows => 
        {
            tagpro = rows      
        }).catch(next);

    tagcategoryModel.all().then( rows => 
    {
          tagcateg = rows; 
          res.render('vwTags/index',
       {
        empty: rows.length === 0,
           error:false,
           tagcateg,
           tag, 
           tagpro
        });        
    }).catch(next);
});
// them tags
rounter.get('/add',restricted, (req, res, next) =>
{
    tagcategoryModel.allTags().then( rows => 
    {
      res.render('vwTags/add',
       {
           error:false,
           tagcategories: rows
        });
    }).catch(next);
});

rounter.post('/add', restricted, (req, res, next) =>
{ 
  var entity = req.body;
 tagcategoryModel.add(entity).then(id =>
 {
   res.redirect('/tags/index');
  });
});
// them tag chuyen muc
rounter.get('/addTagsCategories',restricted, (req, res, next) =>
{
    tagcategoryModel.allTags().then( rows => 
    {
        res.render('vwTags/addtagcate',{error:false, tagcategory:rows});     
    }).catch(next);
     
});

rounter.post('/addTagsCategories', restricted, (req, res, next) =>
{ 
  var entity = req.body;
 tagcategoryModel.addcate(entity).then(id =>
 {
   res.redirect('/tags/index');
  });
});
// them tag bai viet

rounter.get('/addTagsProducts',restricted, (req, res, next) =>
{
    tagcategoryModel.allTags().then( rows => 
    {
        tagproduct = rows
        res.render('vwTags/addtagpro',{error:false, tagproduct});     
    }).catch(next);
     
});

rounter.post('/addTagsProducts', restricted, (req, res, next) =>
{ 
 var entity = req.body;
 tagcategoryModel.addpro(entity).then(id =>
 {
   res.redirect('/tags/index');
  });
});

// them tag bai viet phong vien
rounter.get('/addTagsProducts/writer',restricted, (req, res, next) =>
{
    tagcategoryModel.allTags().then( rows => 
    {
        tagproduct = rows
        res.render('vwTags/addtagpro',{error:false, tagproduct});     
    }).catch(next);
     
});

rounter.post('/addTagsProducts/writer', restricted, (req, res, next) =>
{ 
 var entity = req.body;
 tagcategoryModel.addpro(entity).then(id =>
 {
   res.redirect('/');
  });
});
// sua tag
rounter.get('/edit/:id',restricted, (req, res, next) =>
{
    var id = req.params.id;
    tagcategoryModel.singleTags(id).then( rows => 
        {
            edittagproduct = rows
            res.render('vwTags/edit',{error:false, edittagproduct});
        }).catch(next);      
});

rounter.post('/edit/:id',restricted, (req, res, next) =>
{
    var id = req.params.id;
    var entity = req.body;
 tagcategoryModel.update(entity, id).then(id =>
 {
   res.redirect('/tags/index');
  });
      
});

// xoa tags
rounter.post('/delete/:TagID', (req, res) =>
{
    var TagID = req.params.TagID;
     var entity = req.body;
     entity.TagID = TagID

    tagcategoryModel.counttag(TagID).then( rows =>
    {            
            if(rows.length > 0)
            {
                res.end('Tags can not Delete because in database have foreign key from origin tags');
                return ;
            }      
    });

    
    tagcategoryModel.counttagcate(TagID).then( rows =>
        {            
                if(rows.length > 0)
                {
                    res.end('Tags can not Delete because in database have foreign key from origin tags');
                    return ;
                }      
        });

    tagcategoryModel.delete(+entity.TagID).then( n =>
    {
        res.redirect('/tags/index');
    });
      
});

// edit tag  categories

rounter.get('/edit/:id/tagcategories',restricted, (req, res, next) =>
{
    var id = req.params.id;  
    tagcategoryModel.sigdle(id).then( rows => 
        {
            editca = rows
            res.render('vwTags/edittagcate',{error:false, editca});
        }).catch(next); 
});

rounter.post('/edit/:id/tagcategories',restricted, (req, res, next) =>
{
    var id = req.params.id; 

    var entity = req.body;
   
    tagcategoryModel.updateCate(entity, id).then( rows => 
    {
        res.redirect('/tags/index');  
    })
    //console.log(temp);
});

// edit tag  products

rounter.get('/edit/:id/tagproducts',restricted, (req, res, next) =>
{
    var id = req.params.id;  
    var  tagproduct;
    tagcategoryModel.allTags().then( rows => 
        {
            tagproduct = rows   
        }).catch(next);
    tagcategoryModel.sigdlep(id).then( rows => 
        {
            editpr = rows
            res.render('vwTags/edittagpro',{error:false, editpr, tagproduct});
        }).catch(next); 
});

rounter.post('/edit/:id/tagproducts',restricted, (req, res, next) =>
{
    var id = req.params.id; 

    var entity = req.body;
   
    tagcategoryModel.updatePro(entity, id).then( rows => 
    {
        res.redirect('/tags/index');  
    })
});



module.exports = rounter;
