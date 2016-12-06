var User    = require('./model').user;
var config  = require('../config');
var utils   = require('../utils');
var jwt     = require('jsonwebtoken');

module.exports = {
    // =================================================================
    // TOKEN VALIDATIONS ===============================================
    // =================================================================
    register : function(req, res) {
    	User.findOne({
    		email: req.body.email
    	}, function(err, user) {
    		if (err) {
    			res.json({success: false, message:err});
    			return console.error(err);
    		}
    		if (user) {
    			res.json({ success: false, message: 'Registration failed. Email already taken.' });
    		} else if (!user) {
    			if(String(req.body.password).length < 4 || String(req.body.password).length > 20)
    				res.json({ success: false, message: 'Password wrong. It have to be between 6 and 20 characters' });
    			else {
    				user = new User({
						email: req.body.email,
    					password: req.body.password
    				});
    				user.save(function(err) {
    					if (err) {
    						res.json({success: false, message:err});
    						return console.error(err);
    					}
    					console.log('User saved successfully');
    					res.json({ success: true });
    				});
    			}
    		}
    
    	});
    },
    authenticate : function(req, res) {
    	console.log(req.body);
    	User.findOne({
			email: req.body.email
    	}, function(err, user) {
    		if (err) {
    			res.json({success: false, message:err});
    			return console.error(err);
    		}
    		if (!user) {
    			res.json({ success: false, message: 'User not found.' });
    		} else if (user) {
    			if (user.password != req.body.password) {
    				res.json({ success: false, message: 'Wrong password.' });
    			} else {
    				// create a token
    				var token = jwt.sign(user, config.secret, {
    					expiresIn: 86400 // expires in 24 hours
    				});
    
    				res.json({
    					success: true,
    					message: 'Enjoy your token!',
    					token: token,
    					id: user.id
    				});
    			}
    		}
    	});
    },
    // NOT A ROUTE JUSTE A MIDDLEWARE
    tokenMiddleware : function(req, res, next) {
    	var token = (req.body && req.body.token) || req.param('token') || (req.query && req.query.token) || req.headers['x-access-token'];
    	if (!token)
    	    return res.status(403).send({success: false, message: 'No token provided.'});
        try {
            var decoded = jwt.decode(token, config.secret);
            console.log(decoded._doc.email);
            User.findOne({
				email: decoded._doc.email
            }, function(err, user) {
            	if(err || !user)
            		return res.status(403).send({ success: false, message: 'Db error or token invalid.' });
            	req.user = user;
            	return next();
            });
        } catch (err) {
            return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        }
    },
    
    // =================================================================
    // USER ROUTES =====================================================
    // =================================================================
    
    getUsers : function(req, res) {
    	User.find({}, function(err, users) {
    		if(err) throw err;
    		res.json(users);
    	});
    },
    
    getUser : function(req, res) {
    	res.json(req.user);
    },
    
    getUserById : function(req, res) {
    	User.findOne({
    		_id: req.params.id
    	}, function(err, user) {
    		if (err || !user) {
    			res.status(404).json({success: false, message: 'User not found.'});
    			return console.error(err);
    		}
    		user["password"] = ""; // hide password for the others.
    		res.json(user);
    	});
    },
    
    updateUser : function(req, res) {
    	var data = utils.mask_obj(req.body, config.model.user);
    	User.update({email: req.user.email}, {$set : data}
        , {upsert: true, setDefaultsOnInsert: true}
        , function(err, result){
            if (err) {
    			res.json({success: false, message:err});
    			return console.error(err);
    		}
        	console.log("User has been update.");
            res.json({success:true, message:"User has been update."});
        });
    }
};