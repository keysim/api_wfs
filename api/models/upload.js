var config  = require('../config');
var utils   = require('../utils');
var jwt     = require('jsonwebtoken');
var fs      = require('fs');
var multer  = require('multer');
var upload  = multer({ dest: './static/images' }).single('img');
var easyimg = require('easyimage');

module.exports = {
    upload : function(req, res) { // UPLOAD THE AVATAR !!!
        upload(req, res, function (err) {
            if (err || !req.file)
                return res.json({success:false, message:"Upload error."});
        	var tmp_path = req.file.path;
        	var target_path = tmp_path + "-" + req.file.originalname;
            console.log("Taget : ", target_path);
        	fs.rename(tmp_path, target_path, function(err) {
        		if(err)
        			return res.json({success:false, message:"Move error."});
        		console.log("upload done to : " + target_path);
        		/*var thumbnail = '/static/thumbnails/' + req.file.filename + "-" + req.file.originalname;
        		var options = {
                    src: target_path, dst: thumbnail, //"." + thumbnail
                    width:100, height:100
                };
        		easyimg.thumbnail(options).then(
                  function(file) {
                    console.log("Succeed thumbnail !");
                  }, function (err) {
                    console.log(err);
                  }
                );*/
                res.json({success:true, message:"Upload done.", path:config.url + "/static/images/" + req.file.filename + "-" + req.file.originalname});//thumbnail:thumbnail
        	})
          })
    }
};