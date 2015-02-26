// Code that runs on a regular basis to check for new PRs, check they have come
// from the correct user, merge them. Then update the DB with the contents of
// the PR.

var call = require('./call.js');
var user_mod = require("./user.js");
var config = require('./config.json');

/*function get_prs() {
    call.api_call(config.repo + '/pulls', function(json) {
        json.forEach(process_pr);
    });
}*/

exports.process_pr = function(pr) {
    if (pr.action != "opened" && pr.action != "synchronize") {
        console.log("pr.action: " + pr.action + ", aborting");
        return;
    }
    pr = pr.pull_request;
    var user = pr.user.login;
    var number = pr.number;

    get_files_changed(number, user, function(file) {
        if (file.filename == "data/" + user + ".json") {
            console.log("Found legit PR for user " + user);
            merge_pr(number, user, user_mod.process_user);
        } else {
            console.log("PR for user " + user + " changes file " + file.filename);
            console.log("    ignored");
            call.comment(number, 'Error trying to merge. This PR modifies more than just your details. Please only add, modify, or remove the file `data/' + user + '.json`.');
        }
    });
};

function merge_pr(number, user, callback) {
    call.api_call(config.repo + '/pulls/' + number + '/merge', function(json) {
        if (!json.merged) {
            console.log("merging PR " + number + " for " + user + " failed: " + json.message);
            call.comment(number, 'Merging this PR failed\n\nping @nrc\n\nreason: '+ json.message);
        } else {
            console.log("merged PR " + number + " for " + user);
            callback(user, number);
        }
    },
    { 'commit_message': "Merging PR " + number + " from user " + user },
    'PUT');
}

function get_files_changed(pr_number, user, do_file) {
    call.api_call(config.repo + '/pulls/' + pr_number + '/files', function(json) {
        var files = [];
        json.forEach(function(f){
            files.push(f);
        });
        if (files.length == 1) {
            do_file(files[0]);
        } else {
            console.log(files.length + " changed files");
            call.comment(pr_number, 'Error trying to merge. This PR modifies multiple files. Please only add, modify, or remove the file `' + user + '.json`.');
        }
    });
}
