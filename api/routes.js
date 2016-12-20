var express 	= require('express');
var user        = require('./models/user');
var product     = require('./models/product');
var multer      = require('multer');
var path        = require('path');
var config      = require("./config");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/images');
    },
    filename: function (req, file, cb) {
        var fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
        if(!req.body.img) {
            req.body.img = [];
            req.body.thumbnail = fileName;
        }
        req.body.img.push(config.url + "/static/images/" + fileName);
        console.log("HEY");
    }
});
var type = multer({ "storage": storage }).array('files[]');

var routes = express.Router();

var ip_raspberry = "not yet";

routes.post("/ip", function (req, res) {
    if(!req.body || !req.body.ip)
        return res.status(500).json({success: false});
    var d = new Date();
    var date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + "h" + d.getMinutes();
    ip_raspberry = "IP = " + req.body.ip + " at " + date;
    res.json({success: true});
});
routes.get("/ip", function (req, res) {
    res.render('ip', {
        ip: ip_raspberry,
        title: "IP - Raspberry PI"
    });
});

routes.post("/register",        user.register);
routes.post("/authenticate",    user.authenticate);

routes.get("/products",         product.getProducts);           // Get all products
routes.get("/products/:id",     product.getProductsBySeller);   // Get all products of a user with his id
routes.get("/product/:id",      product.getProductById);        // Get a product by id
routes.get("/users",            user.getUsers);                 // Get all the users
routes.get("/user/:id",         user.getUserById);              // Get user by them id

// =================================================================
// authenticated routes ============================================
// =================================================================
routes.use(user.tokenMiddleware);
routes.get("/", function(req, res) { res.json({message: 'Hi ' + req.user.login}); }); // Say hi to the authenticate user

routes.post("/user",            user.updateUser);
routes.get("/user",             user.getUser);                  // Get the current authentified user data

routes.post('/product', type,   product.postProductThumbnail);  // Post a new product Thumbnail
routes.post('/product',         product.postProduct);           // Post a new product
routes.get("/product/:id",      product.updateProduct);         // Post a new product
//routes.post("/upload",          upload.upload);                 // Upload thumbnail

module.exports = routes;