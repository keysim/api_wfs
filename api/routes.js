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
    }
});
var type = multer({ "storage": storage }).array('files[]');

var routes = express.Router();

routes.post("/register", user.register);
routes.post("/authenticate", user.authenticate);

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

routes.post('/product', type,   product.postProduct);           // Post a new product
routes.get("/product/:id",      product.updateProduct);         // Post a new product
//routes.post("/upload",          upload.upload);                 // Upload thumbnail

module.exports = routes;