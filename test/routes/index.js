var express = require('express');
var router = express.Router();
var fs = require("fs");
var mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234'
});

/* GET home page. */
router.get('/', function(req, res, next) {
 // res.render('index', { title: 'Express' });
 	res.render('index');
});

router.get('/simple', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    if (err)
      console.error(err);
    conn.query('use photo');
    conn.query('select * from vine', function(err, result, field) {
      if (err)
        console.error(err);
      conn.release();
      res.render('simple', {list: result});
    });
  });
});

module.exports = router;
