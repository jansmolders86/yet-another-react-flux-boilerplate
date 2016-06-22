
import 'babel-polyfill';
import mongoose from 'mongoose';

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

import alt from './core/alt';
import Iso from 'iso';

import expressSession from 'express-session';

// init server
const server = global.server = express();
const dbHost = config.dbHost;
const port = config.port;


mongoose.connect(dbHost);

//
// static files
//
server.use(express.static(path.join(__dirname, 'public')));

//
// Register server-side rendering middleware
//
server.get('*', async (req, res, next) => {
  try {
    // auth first
    if (req.user) {
      //UserActions.login(req.user);
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

// Launch server
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
