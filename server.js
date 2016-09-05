
import 'babel-polyfill';
import mongoose from 'mongoose';
import alt from './core/alt';
import Iso from 'iso';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';

import { match, RouterContext } from 'react-router';
import routes from './routes/routes';
import ContextHolder from './core/ContextHolder';

import Html from './views/Html';
import assets from './assets';
import config  from './constants/config';
import url  from './constants/url';

import cookieParser from 'cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import passport from 'passport';
import passportFb from 'passport-facebook';

import UserActions from './actions/UserActions';

import bodyParser from 'body-parser';
import BasicStrategy from 'passport-http'
import bcrypt from 'bcryptjs';
import dataFacade from './models/dataFacade';
import master  from './constants/master';

// init server
const server = global.server = express();
const dbHost = config.dbHost;
const port = config.port;
const dbUrlCategories = url.dbUrlCategoriesShort;

const passportBasicStrategy = BasicStrategy.BasicStrategy;

const cookieParams = {
  httpOnly: false,
  signed: true,
  maxAge: 300000,
};

// auth-cookie
server.use(cookieParser(config.crypto));
server.use(cookieEncrypter(config.crypto));
server.use(passport.initialize());
server.use(passport.session());
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//
// info from request user
//
const getInfoFromUser = function setupUserInfo(user) {
  /* eslint-disable prefer-const */
  let info = {
    id: user.id,
    username: user.username,
    token: user.token,
    permission: user.permission
  };
  return info;
};


const testEmail = function testEmail(value){
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

//
// Passport session setup.
//
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // TODO strict by user_id in real apps
  // WARNING check obj
  done(null, obj);
});

//
// FB within Passport
//
passport.use(new passportFb.Strategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: `${config.host}/auth/fb/callback`,
  enableProof: false
}, (accessToken, refreshToken, profile, done) => {
  const result = Object.assign(profile, { token: accessToken });
  return done(null, getInfoFromUser(result));
}));

// GET /auth/fb
server.get('/auth/fb',
  passport.authenticate('facebook'));

// GET /auth/fb/callback
server.get('/auth/fb/callback',
  passport.authenticate('facebook'),
  function(req, res) {
    res.redirect('/');
  }
);

// Basic local authentication
server.post('/auth/login', function(req,res) {
    const username = req.body.username;
    const password = req.body.password;
    if(testEmail(username)){
      dataFacade.getUser({'username' : username}, function(user) {
        if (user) {
          if (bcrypt.compareSync(password, user.password) || password === user.password) {
            req.login({'id': user._id, 'username': user.username, 'permission': user.permission}, function(err) {
              if (err) {
                return res.status(400).send(err);
              } else {
                res.cookie('user', user, cookieParams);
                return res.status(200).send(user);
              }
            });
          } else {
            return res.status(401).send('notAllowed');
          }
        } else {
          return res.status(400).send('notFound');
        }
      });
    } else {
      return res.status(401).send('notAllowed');
    }
  }
);

server.post('/auth/register', function(req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    dataFacade.addUser({
      username: req.body.username,
      password: hash,
      permission: 'user'
    });
    return res.status(200).send();
  }
);

// Get functionality

server.get('/users', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    dataFacade.getUsers(function(users) {
      const allUsers = users;
      if(allUsers !== undefined && allUsers !== null){
        return res.status(200).send(allUsers);
      } else {
        return res.status(400).send('notFound');
      }
    });
  }
});

server.post('/updateUser', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const userID = req.body._id;
    dataFacade.getUser({_id : userID}, function(user) {

      const updatedUser = {
        _id : userID,
        username: user.username,
        password: user.password,
        permission: req.body.permission
      };

      dataFacade.updateUser({_id : userID}, updatedUser);
      return res.status(200).send(user);

    });
  } else {
    return res.status(401).send('notAllowed');
  }
});

//
// Clear session
//
server.get('/logout', (req, res) => {
  res.cookie('user', null, cookieParams);
  res.clearCookie('user', {path:'/'});
  return res.status(200).send();
});

//
// static files
//
server.use(express.static(path.join(__dirname, 'public')));

server.get(dbUrlCategories, async (req, res, next) => {
  dataFacade.getCategories((data) => {
    return res.status(200).send(data);
  });
});

//
// Register server-side rendering middleware
//
server.get('*', async (req, res, next) => {
  try {
    // auth first
    if (req.signedCookies.user) {
      UserActions.login({
        id: req.signedCookies.user._id,
        token: null,
        username: req.signedCookies.user.username,
        password: req.signedCookies.user.password,
        isAdmin: req.signedCookies.user.permission
      });
    }

    // match routes
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (redirectLocation !== null) {
        return res.redirect(redirectLocation.pathname);
      }

      let statusCode = 200;
      const data = {
        title: '',
        description: '',
        css: '',
        body: '',
        entry: assets.main.js
      };
      const css = [];
      const context = {
        insertCss: styles => css.push(styles._getCss()),
        onSetTitle: value => data.title = value,
        onSetMeta: (key, value) => data[key] = value,
        onPageNotFound: () => statusCode = 404
      };

      const iso = new Iso();
      iso.add(
        ReactDOM.renderToString(
          <ContextHolder context={context}>
            <RouterContext {...renderProps} />
          </ContextHolder>
        ),
        alt.flush()
      );

      data.body = iso.render();
      data.css = css.join('');

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(statusCode).send(`<!doctype html>\n${html}`);
    });
  } catch (err) {
    next(err);
  }
});

mongoose.connect(dbHost);

// Launch server
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
