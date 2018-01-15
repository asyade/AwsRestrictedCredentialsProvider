/*
*  Internal modules
*/

global.config =  require('./config.js');
global.logger =  require('./logger.js');
global.gen =     require('./generator.js');
global.cache =   require('./cache.js');
var auth_frame = require('./client.js').auth_frame;

/*
*  External modules
*/

var http =       require('http');

// Init database
cache.init("cache.sqlite3", test);//listen);

function test() {
        global.gen.create_user(process.argv[2], (success, data) => {
        if (success) {
            console.log(data);
            cache.set_creds(data);
        } else {
            console.log("Can't create IAM token");
        }
    });
}

// Listen httpserver and proccess auth
function listen() {

    var httpServer = http.createServer((req, res) => {
        global.logger.info("Request received from " + req.url);
        if (req.url === "/auth") {            
            global.logger.info("Autentification ...");
            auth_frame(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    }).listen(global.config.serverListenPort, () => {
        global.logger.info("Listening for connections on port " + global.config.serverListenPort);
    }); 

}

function originIsAllowed(origin) {
    //@TODO
    return true;
}
