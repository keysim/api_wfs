var express 	= require('express');
var user        = require('./models/user');
var product     = require('./models/product');
//var upload      = require('./models/upload');
var multer      = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/images');
        console.log("test");
        //modify upload dest
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        //modify file name
    }
});
var upload = multer({ "storage": storage });
var type = upload.array('files[]');

var routes = express.Router();

routes.post('/upload',type,function(req,res){

    res.sendStatus(200);
});

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

routes.post("/product",         product.postProduct);           // Post a new product
routes.get("/product/:id",      product.updateProduct);         // Post a new product
//routes.post("/upload",          upload.upload);                 // Upload thumbnail

module.exports = routes;