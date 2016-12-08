var config = {
    secret: 'api_wfs',
    port : 4242,
    url : "http://vps340264.ovh.net:" + 4242,
    db : {url:'mongodb://vps340264.ovh.net:27017/wfs', port:27017, name:'wfs'}, // launch "mongod" then take port and host printed in the command line.
    model:{
        user:{
            login: {type: String, required: true},
            password: {type: String, required: true},
            description: String
        },
        product:{
            seller: String,
            thumbnail: String,
            name: {type:String, required:true},
            description: {type:String, required:true},
            type: {type:String, required:true}, // planet or animal
            price: {type:String, required:true},
            img: Array,
            date: {type:Date, default: Date.now}
        }
    }
};

module.exports = config;