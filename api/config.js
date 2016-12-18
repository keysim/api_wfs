var config = {
    secret: 'api_wfs',
    port : 4242,
    url : "http://lewogona.com:" + 4242,
    db : {url:'mongodb://lewogona.com:27017/wfs', port:27017, name:'wfs'}, // launch "mongod" then take port and host printed in the command line.
    model:{
        user:{
            login: {type: String, required: true},
            password: {type: String, required: true},
            type: {type: String, default:"client"}
        },
        product:{
            seller: String,
            thumbnail: String,
            name: {type:String, required:true},
            size: String,
            stock: Number,
            gpi: String,
            description: {type:String, required:true},
            type: {type:String, required:true}, // planet or animal
            price: {type:String, required:true},
            img: Array,
            date: {type:Date, default: Date.now}
        }
    }
};

module.exports = config;