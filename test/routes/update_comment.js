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
		conn.query("select content, date_format(date, '%m-%d %H:%i') as date from comment where berry_num=? order by number desc", [no], function(err, result, field) {
			if (err)
				console.error(err);
			var list = result;
			conn.query("select count(*) as comment_count, (select `like` from vine where vine.number=?) as like_count from comment where berry_num=?", [no, no], function(err, result, field) {
				if (err)
					console.error(err);
				conn.release();
				res.send({list: list, comment_count: result[0].comment_count, like_count: result[0].like_count});
			})
		})
	})
});

module.exports = router;
