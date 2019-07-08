var express = require('express');
var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var app = express();
var morgan = require('morgan');
var Handlebars = require('handlebars')

var createError = require('http-errors');
//capcha
var BodyParser = require("body-parser");
//var Request = require("request");
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
//
app.use(morgan('dev'));
app.engine('hbs',exphbs({
    layoutsDir:'views/layouts',
    defaultLayout:'main.hbs',
    helpers: {
        section: hbs_sections()
      }
}));

app.set('view engine','hbs');

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'));

require('./middlewares/session')(app);
require('./middlewares/passport')(app);
require('./middlewares/upload')(app);


app.use(require('./middlewares/categories.mdw'));
app.use(require('./middlewares/auth.mdw'));
app.use(require('./middlewares/products.mdw'));
app.use(require('./middlewares/productsPremium.mdw'));
app.use(require('./middlewares/origincategories.mdw'));
app.use(require('./middlewares/categoriesTime.mdw'));
app.use(require('./middlewares/categoriesView.mdw'));
app.use(require('./middlewares/categoryTimeView.mdw'));
app.use(require('./middlewares/CategoriesViewBiggest.mdw'));
app.use(require('./middlewares/categoriesMaxView.mdw'));
app.use(require('./middlewares/user.mdw'));

app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));

 app.use('/account', require('./routes/account'));
 app.use('/tags', require('./routes/tags'));

app.get('/', (req, res, next)  =>
{
    res.render('home');
})

app.get('/error', (req, res)  =>
{ 
    return res.render('error', { layout:false 
    });
})

app.use((req, res, next)=>
{
    next(createError(404));
});

app.use((err, req, res, next) =>
{
    var status = err.status || 500;
    var vwErr = 'error';
    if(status === 404)
    {
        vwErr = '404';
    }
    // var message = err.message;
    // var error = err;
    process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
    var isProd = process.env.NODE_ENV === 'prod';
    var message = isProd ? 'An error has occured. Please contact administartor for more support.' : err.message;
    var error = isProd ? {} : err;
  
    var message = isProd ? 'An error has occured. Please contact administartor for more support.' : err.message;
    var error = isProd ? {} : err;
    res.status(status).render(vwErr, {layout: false, message, error });
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

var port = 3000;
app.listen(port, () => { 
    console.log(`server is running at port ${port}`);
});


