// Code that runs on a regular basis to check for new PRs, check they have come
// from the correct user, merge them. Then update the DB with the contents of
// the PR.

var call = require('./call.js');
var user_mod = require("./user.js");
var config = require('./config.json');

exports.process_pr = function(pr) {
    if (pr.action != "opened" && pr.action != "synchronize") {
        console.log("pr.action: " + pr.action + ", aborting");
        return;
    }
    pr = pr.pull_request;
    var user = pr.user.login;
    var pr_number = pr.number;
    call.getIssueId(pr_number, function(pr_id) {
        get_files_changed(pr_id, pr_number, user, function(file) {
            if (file.filename == "data/" + user + ".json") {
                console.log("Found legit PR for user " + user);
                // We pull the file from the PR to make sure it is valid JSON.
                call.url_call(file.contents_url, function(json) {
                    try {
                        var buf = new Buffer(json.content, 'base64');
                        // We don't use the result, but we want to check the file parses as JSON.
                        JSON.parse(buf.toString('utf8'));
                        merge_pr(pr_id, user), pr_number;
                    } catch (err) {
                        console.log("error parsing PR: " + pr_number);
                        call.comment(pr_id, 'There was an error parsing JSON (`' + err + '`), please double check your json file.');
                    }
                });
            } else {
                console.log("PR for user " + user + " changes file " + file.filename);
                console.log("    ignored");
                call.comment(pr_id, 'Error trying to merge. This PR modifies more than just your details. Please only add, modify, or remove the file `data/' + user + '.json`.');
            }
        });
    });
};

function merge_pr(pr_id, pr_number, user) {
    call.api_call(config.repo + '/pulls/' + pr_number + '/merge', function(json) {
        if (!json.merged) {
            console.log("merging PR " + pr_number + " for " + user + " failed: " + json.message);
            call.comment(pr_id, 'Merging this PR failed\n\nping @nrc\n\nreason: '+ json.message);
        } else {
            console.log("merged PR " + pr_number + " for " + user);
            user_mod.process_user(user, pr_id);
        }
    },
    { 'commit_message': "Merging PR " + pr_number + " from user " + user },
    'PUT');
}

function get_files_changed(pr_id, pr_number, user, do_file) {
    call.api_call(config.repo + '/pulls/' + pr_number + '/files', function(json) {
        var files = [];
        json.forEach(function(f){
            files.push(f);
        });
        if (files.length == 1) {
            do_file(files[0]);
        } else {
            console.log(files.length + " changed files");
            call.comment(pr_id, 'Error trying to merge. This PR modifies multiple files. Please only add, modify, or remove the file `' + user + '.json`.');
        }
    });
}
