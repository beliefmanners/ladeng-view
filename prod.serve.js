const express = require('express');
const config = require('./cfg/defaults');
const app = express();
let port = config.port;
const router = express.Router();
router.get('/',function (req, res, next) {
  res.url  =  '/dist/index.html';
  next();
});
app.use(router);
app.use(express.static('./dist'));

module.exports =  app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listen at http://localhost:${port}\n`);
});
