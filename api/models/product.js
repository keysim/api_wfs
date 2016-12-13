var Product   = require('./model').product;
var utils   = require('../utils');
var config = require('../config');
var easyimg = require('easyimage');

module.exports = {
    
    getProducts : function(req, res) {
    	Product.find({}, function(err, products) {
    		if(err) throw err;
    		res.json(products);
    	});
    },
    
    getProductById : function(req, res) {
    	console.log(req.params.id);
    	Product.findOne({
    		_id: req.params.id
    	}, function(err, product) {
    		if (err || !product) {
    			res.status(404).json({success: false, message: 'Product not found.'});
    			return console.error(err);
    		}
    		res.json(product);
    	});
    },

	postProductThumbnail : function(req, res) { // MIDDLEWARE THUMBNAIL
		/*var options = {
			src: "./static/images/" + req.body.thumbnail, dst: "./static/thumbnails/" + req.body.thumbnail,
			width:230, height:230
		};
		easyimg.thumbnail(options).then(
			function(file) {
				req.body.thumbnail = config.url + "/static/thumbnails/" + req.body.thumbnail;
				return next();
			}, function (err) {
				res.json({success: false, message:"Thumbnail error :" + err});
			}
		);*/
		console.log("test PAS DERREUR");
    },

	postProduct : function(req, res) {
		var data = utils.mask_obj(req.body, config.model.product);
		data.seller = req.user._id;
		console.log(data);
		/*var product = new Product(data);
		 product.save(function(err) {
		 if (err) {
		 res.json({success: false, message:err});
		 return console.error(err);
		 }
		 console.log('Product send successfully');
		 res.json({success: true, message:"Product send successfully"});
		 });*/
	},

	updateProduct : function(req, res) {
		var data = utils.mask_obj(req.body, config.model.product);
		Product.update({_id: req.params.id}, {$set : data}
			//, {upsert: true, setDefaultsOnInsert: true}
			, function(err, result){
				if (err) {
					res.json({success: false, message:err});
					return console.error(err);
				}
				res.json({success:true, message:"Product " + req.params.id + " has been update."});
			});
	},
    
    getProductsBySeller : function(req, res) {
        Product.find({
			seller: req.params.id
    	}, function(err, products) {
    		if (err || !products) {
    			res.status(404).json({success: false, message: 'Products not found.'});
    			return console.error(err);
    		}
    		res.json(products);
    	});
    },

	deleteProduct : function(req, res) {
		Product.find({
			seller: req.params.id
		}, function(err, products) {
			if (err || !products) {
				res.status(404).json({success: false, message: 'Products not found.'});
				return console.error(err);
			}
			res.json(products);
		});
	}
};