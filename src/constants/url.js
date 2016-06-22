/*

let appContext = '';
if (window.appContext && window.appContext !== '/') {
  appContext = window.appContext;
}

if (!window.location.origin) {
  const port = window.location.port ? `:${window.location.port}` : '';
  window.location.origin = `${window.location.protocol}//${window.location.hostname}${port}`;
}

 const origin = window.location.origin + appContext;
 */

const origin = 'http://localhost:3000';
const urls = {
  dbUrl: `${origin}/d/pages/`
};


module.exports = urls;
