var cache = require("./cache.js");
var create_user = require("./generator.js").create_user;

//@TODO Important check token integrity to prevent sql injection
function token_is_valide(token) {
    return true;
}

exports.auth_frame = function(req, res) {
    const { headers, method, url } = req;
    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());
        if (!body || !body.token) {
            global.logger.error("Receive invalide request : " + Buffer.concat(body).toString());
            return ;
        }
        if (!token_is_valide(body.token)) {
            global.logger.error("Invalide token received !"); //@TODO print client infos
            return ;
        }
        cache.get_creds(body.token, (creds) => {
            res.setHeader('Content-Type', 'application/json'); 
            if (!creds) {
                global.logger.info("Token dosent exist !");
                creds = create_user(body.token, (result, creds) => {
                    if (!result) {
                        console.error("Can't create user " + body.token);
                        return ;
                    }
                    cache.set_creds(creds);
                    res.write(JSON.stringify(creds));
                    res.end();
                });
            }
            else {
                res.write(JSON.stringify(creds));
                res.end();
                global.logger.info("Autentification done !");
            }
        });
    });
}