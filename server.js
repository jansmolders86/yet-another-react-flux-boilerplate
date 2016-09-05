
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

// IMPORT TEST DB, ONLY FOR LOCAL TESTING!!!
// import testDb  from './constants/testdb';

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
          if (bcrypt.compareSync(password, user.password) || password === user.password) {
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

server.get('/likes', function(req, res) {
  dataFacade.getLikes(function(likes) {
    return res.status(200).send(likes);
  });
});

// Add functionality

server.post('/addLike', function(req, res) {
  if (req.signedCookies.user) {
    dataFacade.addLike({userId: req.body.userId, itemId: req.body.itemId});
    return res.status(200).send();
  } else {
    return res.status(401).send('notAllowed');
  }
});

server.post('/addCategory', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const category = {
      title: req.body.title,
      language: req.body.language,
      urlkey: req.body.urlkey,
      description: req.body.description
    };

    dataFacade.addCategories(category);
    return res.status(200).send();
  } else {
    return res.status(401).send('notAllowed');
  }
});

server.post('/addTopic', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const topic = {
      title: req.body.title,
      hot: req.body.hot,
      id: req.body.id
    };
    const categoryTitle = req.body.category;
    dataFacade.getCategory({urlkey: categoryTitle}, function(category) {
      category.topics.push(topic);
      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send(topic);
    });
  } else {
    return res.status(401).send('notAllowed');
  }
});

server.post('/addItem', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const categoryTitle = req.body.category;
    const topicTitle = req.body.topic;
    dataFacade.getCategory({urlkey: categoryTitle}, function(category) {
      for (let i = 0; i < category.topics.length; i++) {
        if (category.topics[i].title == topicTitle) {
          const item = {
            title: req.body.item,
            description: req.body.description,
            order: req.body.order,
            itemImage: req.body.itemImage,
            purchaseLink: req.body.purchaseLink
          };
          category.topics[i].items.push(item);
        }
      }

      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send();
    });
  } else {
    return res.status(401).send('notAllowed');
  }
});

server.post('/addSubItem', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const categoryTitle = req.body.category;
    const topicTitle = req.body.topic;
    const ItemTitle = req.body.item;
    dataFacade.getCategory({urlkey: categoryTitle}, function(category) {
      for (let i = 0; i < category.topics.length; i++) {
        if (category.topics[i].title === topicTitle) {
          for (let j = 0; j < category.topics[i].items.length; j++) {
            if (category.topics[i].items[j].title === ItemTitle) {
              const subItem = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                itemImage: req.body.itemImage,
                purchaseLink: req.body.purchaseLink,
                media: [{
                  mediaType: req.body.mediaType,
                  url: req.body.mediaUrl
                }]
              };
              category.topics[i].items[j].subItems.push(subItem);
            }
          }

        }
      }
      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send();
    });
  } else {
    return res.status(401).send('notAllowed');
  }
});

// Update functionality

server.post('/updateCategory', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const oldCategoryUrl = req.body.oldTitle;
    dataFacade.getCategory({urlkey: oldCategoryUrl}, function(category) {
      category.title = req.body.title;
      category.language = req.body.language;
      category.urlkey = req.body.urlkey;
      category.description = req.body.description;
      category.image = req.body.image;

      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send();
    });
  } else {
    return res.status(401).send();
  }
});

server.post('/updateTopic', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const categoryTitle = req.body.category;
    const oldTopicTitle = req.body.oldTitle;
    dataFacade.getCategory({title: categoryTitle}, function(category) {
      for (let i = 0; i < category.topics.length; i++) {
        if (category.topics[i].title === oldTopicTitle) {
          category.topics[i].title = req.body.title;
          category.topics[i].hot = req.body.hot;
          category.topics[i].id = req.body.id;
          dataFacade.updateCategory({_id: category._id}, category);
          return res.status(200).send();
        } else {
          return res.status(400).send();
        }
      }
    });
  } else {
    return res.status(401).send('notAllowed');
  }
});


server.post('/updateItem', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const categoryTitle = req.body.category;
    const topicTitle = req.body.topic;
    const oldItemTitle = req.body.oldTitle;
    dataFacade.getCategory({urlkey: categoryTitle}, function(category) {
      for (let i = 0; i < category.topics.length; i++) {
        if (category.topics[i].title === topicTitle) {
          for (let j = 0; j < category.topics[i].items.length; j++) {
            if (category.topics[i].items[j].title === oldItemTitle) {
              category.topics[i].items[j].title = req.body.item;
              category.topics[i].items[j].description = req.body.description;
              category.topics[i].items[j].order = req.body.order;
              category.topics[i].items[j].itemImage = req.body.itemImage;
            }
          }
        }
      }
      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send();
    });
  } else {
    return res.status(401).send('notAllowed');
  }
});

server.post('/updateSubItem', function(req, res) {
  if (req.signedCookies.user && req.signedCookies.user.permission == 'admin') {
    const categoryTitle = req.body.category;
    const topicTitle = req.body.topic;
    const itemTitle = req.body.item;
    const oldSubItemTitle = req.body.oldTitle;
    dataFacade.getCategory({urlkey: categoryTitle}, function(category) {
      for (let i = 0; i < category.topics.length; i++) {
        if (category.topics[i].title == topicTitle) {
          for (let j = 0; j < category.topics[i].items.length; j++) {
            if (category.topics[i].items[j].title == itemTitle) {
              for (let k = 0; k < category.topics[i].items[j].subItems.length; k++) {
                if (category.topics[i].items[j].subItems[k].title == oldSubItemTitle) {
                  category.topics[i].items[j].subItems[k].title = req.body.title;
                  category.topics[i].items[j].subItems[k].description = req.body.description;
                  category.topics[i].items[j].subItems[k].order = req.body.order;
                  category.topics[i].items[j].subItems[k].itemImage = req.body.itemImage;
                  const subItemMedia = category.topics[i].items[j].subItems[k].media[0];
                  subItemMedia.mediaType = req.body.mediaType;
                  subItemMedia.url = req.body.mediaUrl;
                }
              }
            }
          }
        }
      }

      dataFacade.updateCategory({_id: category._id}, category);
      return res.status(200).send();
    });
  } else {
    return res.status(401).send();
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
