// Process a user from a file in the repo to an entry in the db.

var sqlite = require("sqlite3");
var marked = require("marked");
var call = require('./call.js');
var config = require('./config.json');

exports.process_user = function(user) {
    call.api_call(config.repo + '/contents/' + user + '.json', function(json) {
        if (!json || json.type == undefined) {
            // remove the user from the db
            insert_to_db({'username': user});
            return;
        }
        if (json.type == 'file' && json.content) {
            var buf = new Buffer(json.content, 'base64');
            try {
                var user_info = JSON.parse(buf.toString('ascii'));
                user_info['username'] = user;
                insert_to_db(user_info);
                console.log("inserted into db");
            } catch (err) {
                console.log("error parsing user: " + user + ": " + err);
            }
        } else {
            console.log("unexpected contents for " + user + ": " + json.type);
        }
    });
}

// Fields to read from the json file and insert into the db
// Does not include irc_channels nor the blob.
var fields = [
    ["username", true],
    ["name", true],
    ["irc", true],
    ["show_avatar", false],
    ["email", true],
    ["discourse", true],
    ["reddit", true],
    ["twitter", true],
    ["blog", true],
    ["website", true],
    ["notes", true]
];

function insert_to_db(user_info) {
    // compute the blob and an input string for each field
    var strings = 'INSERT INTO people (';
    var values_str = ') VALUES (';
    var values = []
    var blob = '';
    var first = true;
    var field_count = 0;

    fields.forEach(function(f) {
        var field = f[0];

        if (!(field in user_info)) {
            return;
        }

        var value = user_info[field];
        field_count += 1;

        if (field == 'twitter' && value && value[0] != '@') {
            value = '@' + value;
        }
        if (field == 'notes') {
            // Convert notes from markdown to html.
            value = marked(value);
        } else if (f[1] && value.length > 0) {
            blob += value + "\n"
        }

        if (first) {
            first = false;
        } else {
            strings += ', ';
            values_str += ', ';
        }
        strings += field;
        values_str += "?";
        values.push(value);
    });

    strings += ', blob';
    values_str += ", ?";
    values.push(blob);
    strings += values_str + ');';

    // Write everything to the DB
    var db = new sqlite.Database("rustaceans.db");
    db.serialize(function() {
        db.run('DELETE FROM people WHERE username=?;', user_info['username'], err_handler);
        db.run('DELETE FROM people_channels WHERE person=?;', user_info['username'], err_handler);

        if (field_count <= 1) {
            return;
        }

        db.run(strings, values, err_handler);
    
        // irc channels go into a separate table
        var irc_string = 'INSERT INTO people_channels (person, channel) VALUES (?, ?);'
        var channels = user_info['irc_channels'];
        channels.forEach(function(ch) {
            db.run(irc_string, user_info['username'], ch, err_handler);
        });
    });
    db.close();
}

function err_handler(x) {
    if (x == null) {
        return;
    }

    console.log("an error occured: " + x);
}
