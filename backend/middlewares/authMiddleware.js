const jwt = require('jsonwebtoken');
//const User = require('../models/User');
require('dotenv').config();
const DEBUG = +process.env.DEBUG;

const requireAuth = (req, res, next) => {
  const token = req.headers.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if(DEBUG) console.log(err.message);
        res.redirect('/userauth/signin');
      } else {
        if(DEBUG) console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/userauth/signin');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };