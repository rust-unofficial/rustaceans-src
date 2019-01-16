// A simple web server providing a RESTful API for Rustaceans data. Allows
// getting a single user or searching for users.

var sqlite = require('sqlite3');
var async = require('async');

var config = require('./config.json');

var daemon = require('./daemon.js');

const express = require('express');
const app = express();

app.get('/user', function (req, res) {
    get_user(req.query.username, res);
});

app.get('/search', function (req, res) {
    search(req.query.for , res);
});

app.post('/pr', function (req, res) {
    // Get payload and parse it
    var body = '';
    req.on('data',function(chunk){
        body+=chunk;
    });
    req.on('end',function(){
        res.status(200);
        res.set("Access-Control-Allow-Origin", "*");
        try {
            var json = JSON.parse(body);
            daemon.process_pr(json);
            res.send("Success?");
        } catch(e) {
            res.send("Error: " + e);
        }
    });
});

app.get('/random', function (req, res) {
    // Return a random rustacean.
    make_random_user(function (username) { get_user(username, res) } );
});

app.get('*', function (req, res) {
    res.status(404);
    res.set("Content-Type", "text/plain");
    res.send("404 Not Found\n");
});

app.listen(2345);

function get_channels(username, res, db, callback) {
    db.all('SELECT * FROM people_channels WHERE person=?;', username, function(err, rows) {
        if (err) {
            console.log("an error occured searching for irc channels for " + username + ": " + err);
            make_response(res, [], db);
            return;
        }

        callback(rows);
    });
}

function make_random_user(mkusr) {
    var db = new sqlite.Database("rustaceans.db");
    db.all('SELECT username FROM people;', function(err, rows) {
        if (err) {
            console.log("an error occured while looking up usernames: " + err);
            make_response(res, [], db);
            return;
        }

        if (!rows) {
            console.log("no resuls while looking up usernames: " + err);
            make_response(res, [], db);
            return;
        }

        var username = rows[Math.floor(Math.random() * rows.length)].username;
        mkusr(username);
    });
}

// Search for users, returns a possibly empty array of user json objects.
function search(search_str, res) {
    var db = new sqlite.Database("rustaceans.db");
    db.all("SELECT * FROM people WHERE blob LIKE ?", "%" + search_str + "%", function(err, rows) {
        if (err) {
            console.log("an error occured while searching for '" + search_str + "': " + err);
            make_response(res, [], db);
            return;
        }

        // This nasty bit of callback hell is for finding each users irc channels.
        // For each user we look up the channels from the DB, then create the user object.
        // Once we have all the user objects in an array, then we put them in the repsonse.
        async.parallel(rows.map(function(row) {
            return function(callback) {
                get_channels(row.username, res, db, function(rows) {
                    callback(null, make_user(row, rows));
                })
            };
        }),
        function(err, result) {
            make_response(res, result, db);
        });
    });
}

// Make a response of info for a single user. Returns either a single user JSON object or
// an empty JSON object if there is no such user.
function get_user(username, res) {
    // Check the db for the user.
    var db = new sqlite.Database("rustaceans.db");
    db.get('SELECT * FROM people WHERE username=? COLLATE NOCASE;', username, function(err, row) {
        if (err || !row) {
            if (err) {
                console.log("an error occured searching for user " + username + ": " + err);
            }
            make_response(res, [], db);
            return;
        }

        get_channels(username, res, db, function(rows) {
            make_response(res, [make_user(row, rows)], db);
        });
    });
}

// Turn data into JSON and add it to the response
function make_response(res, data, db) {
    res.status(200);
    res.set("Access-Control-Allow-Origin", "*");
    res.json(data);
    db.close();
}

// Does not include username.
// Fields that can be directly copied to the user object from the DB.
var fields = [
    "username",
    "name",
    "irc",
    "email",
    "discourse",
    "reddit",
    "twitter",
    "blog",
    "website",
    "notes"
];


// Take rows from the db and make a JS object representing the user.
function make_user(user_row, channel_rows) {
    var user = {};

    fields.forEach(function(f) {
        user[f] = user_row[f];
    });

    if (user_row.show_avatar) {
        user['avatar'] = 'https://avatars.githubusercontent.com/' + user_row['username'];
    }

    if (channel_rows) {
        user['irc_channels'] = channel_rows.map(function(cr) { return cr.channel; });
    } else {
        user['irc_channels'] = [];
    }
    return user;
}
