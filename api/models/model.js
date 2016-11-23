var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;


var toJsonClean = { // remove __v and set _id to id ! =D
     transform: function (doc, ret, options) {
         if(ret && ret._id) {
             ret.id = ret._id;

             var d = ret._id.getTimestamp();
             delete ret.date;
             ret.date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + "h" + d.getMinutes();// + ":" + d.getSeconds();
             delete ret._id;
             delete ret.__v;
         }
     }
};

// set up a mongoose models
module.exports = {
    "user"          :   mongoose.model('User', new Schema(config.model.user).set('toJSON', toJsonClean)),
    "product"        :   mongoose.model('Product', new Schema(config.model.product).set('toJSON', toJsonClean))
};