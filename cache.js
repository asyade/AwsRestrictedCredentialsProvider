var sqlite3 =    require('sqlite3').verbose();

//Set database acces global and create tokens table
exports.init = function(path, cb) {
    global.database = new sqlite3.Database(path, () => {
        global.database.run("CREATE TABLE IF NOT EXISTS tokens (id TEXT, user_key TEXT, access_key TEXT, access_secret TEXT, bucket TEXT)", cb);
    });
}

//Return credentials for a given token, NULL if the token dosent exist
//Normaly client check for token integrity and token can't perform sql injection
exports.get_creds = function(token, cb) {
    var found = false;
    global.database.all("SELECT * FROM tokens WHERE id='"+token+"'", (err, rows) => {
        rows.forEach((row) => {
            cb(row);
            found = true;
        });
    });
    if (!found)
        cb(null);
}

//Register new credentials into db
exports.set_creds = function(creds) {
    var stmt = global.database.prepare("INSERT INTO tokens VALUES (?, ?, ?, ?, ?)");
    stmt.run(creds.id, creds.user_key, creds.access_key, creds.access_secret, creds.bucket);
    stmt.finalize();
}

//Update existing credentials into db
exports.update_creds = function(token, creds) {

}

//Remove credentials from database
exports.remove_creds = function(token) {

}