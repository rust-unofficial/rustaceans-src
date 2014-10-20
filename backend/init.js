// Initialise the DB - create the tables and do a first update from the repo.

// To setup environment:
//   sudo apt-get install node
//   sudo npm install sqlite3
//   sudo npm install async
//   sudo npm install marked


var sqlite = require("sqlite3");
var call = require('./call.js');
var user_mod = require("./user.js");
var config = require('./config.json');


var db = new sqlite.Database("rustaceans.db");
console.log("constructing tables");
db.serialize(function() {
    // First empty the DB in case it previously existed.
    db.run("DROP TABLE people", err_handler);
    db.run("DROP TABLE people_channels", err_handler);

    // Create tables.
    db.run("CREATE TABLE people(username STRING PRIMARY KEY,\
                                name STRING,\
                                irc STRING,\
                                show_avatar BOOL,\
                                email STRING,\
                                discourse STRING,\
                                reddit STRING,\
                                twitter STRING,\
                                blog STRING,\
                                website STRING,\
                                notes STRING,\
                                blob STRING)", err_handler);
    db.run("CREATE TABLE people_channels(person STRING, channel STRING)", err_handler);

    // Fill the tables from the repo.
    var files = process_repo();
});
db.close();

function process_repo() {
    call.api_call(config.repo + '/contents/data', function(json) {
        if (!json) {
            return;
        }
        json.forEach(function(file) {
            if (str_endswith(file.name, '.json') && file.name != 'template.json') {
                user_mod.process_user(file.name.substring(0, file.name.length-5));
            }
        });
    });
}

function str_endswith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function err_handler(x) {
    if (x == null) {
        return;
    }

    console.log("an error occured: " + x);
}
