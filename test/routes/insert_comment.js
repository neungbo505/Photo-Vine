var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234'
});

router.post('/', function(req, res, next) {
	var no = req.body.no;
	var content = req.body.content;
	pool.getConnection(function(err, conn) {
		if (err)
			console.error(err);
		conn.query('use photo');
		conn.query('insert into comment(berry_num, content, date) values(?, ?, now())', [no, content], function(err, result, field) {
			if (err) {
				console.error(err);
				conn.release();
				res.send({reg_success: false});
			} else {
				conn.release();
				res.send({reg_success: true});
			}
		})
	})
});

module.exports = router;
