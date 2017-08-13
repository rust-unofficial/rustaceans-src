// Initialise the DB - create the tables and do a first update from the repo.

// To setup environment:
//   sudo apt-get install node
//   npm install sqlite3
//   npm install async
//   npm install marked


var sqlite = require("sqlite3");
var call = require('./call.js');
var user_mod = require("./user.js");
var config = require('./config.json');


var db = user_mod.openDb();
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

function process_repo() {
    var queryGetDataList = 'query {\
          repository(owner:"nrc", name:"rustaceans.org") {\
            object(expression: "master:data") {\
              ... on Tree {\
                entries {\
                  name,\
                  oid\
                }\
              }\
            }\
          }\
        }';
    var queryGetUser = 'query GetUser($id: GitObjectID) {\
          repository(owner:"nrc", name:"rustaceans.org") {\
            object(oid: $id) {\
              ... on Blob {\
                text\
              }\
            }\
          }\
        }';
    call.graphql_call(queryGetDataList, function(json) {
        let entries = json.data.repository.object.entries;
        let ref_count = entries.length;
        for (let i in entries) {
            let entry = entries[i];
            if (str_endswith(entry.name, '.json') && entry.name != 'template.json') {
                call.graphql_call(queryGetUser, function(userJson) {
                    let text = userJson.data.repository.object.text;
                    if (!text) {
                        console.log("no text: " + entry.name);
                        ref_count -= 1;
                        return;
                    }
                    try {
                        let user = JSON.parse(text);
                        let username = entry.name.substring(0, entry.name.length-5);
                        user_mod.add_user(user, username, null, db, function() {
                            ref_count -= 1;
                            if (ref_count == 0) {
                                db.close();
                            }
                        });
                    } catch(err) {
                        console.log("error: " + err);
                        console.log("in " + entry.name);
                        console.log(text);
                        ref_count -= 1;
                    }
                }, { "id": entry.oid });
            } else {
                ref_count -= 1;
            }
        }
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
