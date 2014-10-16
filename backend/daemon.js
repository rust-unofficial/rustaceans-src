// Code that runs on a regular basis to check for new PRs, check they have come
// from the correct user, merge them. Then update the DB with the contents of
// the PR.

var call = require('./call.js');
var user_mod = require("./user.js");
var config = require('./config.json');

// TODO make this run every hour

/*function get_prs() {
    call.api_call(config.repo + '/pulls', function(json) {
        json.forEach(process_pr);
    });
}*/

exports.process_pr = function(pr) {
    if (pr.action != "opened") {
        return;
    }
    pr = pr.pull_request;
    var user = pr.user.login;
    var number = pr.number;

    get_files_changed(number, function(file) {
        if (file.filename == user + ".json") {
            console.log("Found legit PR for user " + user);
            //merge_pr(number, user);
            user_mod.process_user(user);
        } else {
            console.log("PR for user " + user + " changes file " + file.filename);
            console.log("    ignored")
        }
    });
};

function merge_pr(number, user) {
    call.api_call(config.repo + '/pulls/' + number + '/merge', function(json) {
        if (!json.merged) {
            console.log("merging PR " + number + " for " + user + " failed: " + json.message);
        }
    },
    { 'commit_message': "Merging PR " + number + " from user " + user },
    'PUT');
}

function get_files_changed(pr_number, do_file) {
    call.api_call(config.repo + '/pulls/' + pr_number + '/files', function(json) {
        var files = [];
        json.forEach(function(f){
            files.push(f);
        });
        if (files.length == 1) {
            do_file(files[0]);
        } else {
            console.log(files.length + " changed files");
        }
    });
}
