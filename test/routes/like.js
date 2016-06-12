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
	pool.getConnection(function(err, conn) {
		if (err)
			console.error(err);
		conn.query('use photo');
		conn.query('update vine set `like`=`like`+1 where number='+no, function(err, result, field) {
			if (err) {
				console.error(err);
				conn.release();
				res.send({like_success: false});
			} else {
				conn.query('select `like` from vine where number='+no, function(err, result, field) {
					if (err)
						console.error(err);
					conn.release();
					res.send({like_success: true, like: result[0].like});
				});
			}
		})
	})
});

module.exports = router;
