module.exports = (req, res, next) => {
  if (req.user && req.session.passport.user.f_Permission == 0)
     {
      res.locals.isAuthenticatedSub = true;
      res.locals.authSub= req.user;
    }
    if (req.user && req.session.passport.user.f_Permission == 1)
     {
      res.locals.isAuthenticatedAdmin = true;
      res.locals.authAdmin = req.user;
    }
    if (req.user && req.session.passport.user.f_Permission == 2)
     {
      res.locals.isAuthenticatedWriter = true;
      res.locals.authWriter = req.user;
    }
    if (req.user && req.session.passport.user.f_Permission == 3)
     {
      res.locals.isAuthenticatedEditor = true;
      res.locals.authEditor = req.user;
    }
    if (req.user)
     {
      res.locals.isAuthenticated = true;
      res.locals.authUser = req.user;
    }
  
    next();
  }