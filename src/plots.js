const octokit = new Octokit();

octokit.authenticate({
    type: 'oauth',
    token: '9324fedffc85017817ff2533e9237fc81fc611a9'
});


function getCommits(repoName, owner) {
    async function paginateCommits(method) {
        let response = await method({
            repo: repoName,
            owner: owner
        });
        let {
            data
        } = response;
        var count = 0;
        while (octokit.hasNextPage(response)) {
            count++;
            response = await octokit.getNextPage(response);
            data = data.concat(response.data)
        }
        return data
    }

    paginateCommits(octokit.repos.getCommits).then(data => {
        calculatePair(data, repoName)
        $("#pairingPlot").LoadingOverlay("hide", true);

    })
}

function getIssues(repoName, owner) {

    async function paginateIssues(method) {
        let response = await method({
            repo: repoName,
            owner: owner,
            state: "all"
        });
        let {
            data
        } = response;
        var count = 0;
        while (octokit.hasNextPage(response)) {
            count++;
            response = await octokit.getNextPage(response);
            data = data.concat(response.data)
        }
        return data
    }

    paginateIssues(octokit.issues.getForRepo).then(data => {
        calculateIssueTime(data, repoName)
        $("#issuesPlot").LoadingOverlay("hide", true);
    })

}

function calculateIssueTime(issues, repoName) {
    all_issues = [];
    days_open = {};
    issues.forEach(function (issue) {
        if (issue.pull_request == undefined) {
            var created_date = new Date(issue.created_at);
            created_date.setHours(created_date.getHours() - 3);

            if (issue.state == "closed") {
                var closed_date = new Date(issue.closed_at);
                closed_date.setHours(closed_date.getHours() - 3)
            } else {
                closed_date = new Date()
            }


            var difference = Date.daysBetween(created_date, closed_date);

            if (!days_open[difference]) {

                days_open[difference] = 0
            }

            all_issues.push(issue);
            days_open[difference] += 1
        }
    })
        drawBarPlot(days_open, repoName)
}

function drawBarPlot(days_open, repoName) {
    ISSUES = document.getElementById('issuesPlot');

    Plotly.purge(ISSUES);

    var data = [{
        x: Object.keys(days_open),
        y: Object.values(days_open),
        type: 'bar'

    }];

    title1 = "Active time of issues in project - " + repoName;

    var layout = {
        title: title1,
        xaxis: {
            title: 'Days the issue was active'
        },
        yaxis: {
            title: 'Amount of issues'
        }
    };

    Plotly.plot(ISSUES, data, layout)

}

Date.daysBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
};

function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;

}

function clear_variables(commit_count, all_commit_count, signed_commit_count) {
    commit_count = [];
    all_commit_count = {};
    signed_commit_count = {}
}

function calculatePair(commits, repoName) {
    let all_commit_count = {};
    let signed_commit_count = {};

    commits.forEach(function (commit) {
        date = new Date(commit.commit.author.date);
        date.setHours(date.getHours() - 3);
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var year = date.getUTCFullYear();

        newdate = day + "/" + month + "/" + year;

        if (!all_commit_count[newdate])
            all_commit_count[newdate] = [];
        if (!signed_commit_count[newdate])
            signed_commit_count[newdate] = 0;
        all_commit_count[newdate].push(commit.commit);

        if (
            (occurrences(commit.commit.message, ("Co-authored-by:")) > 1) ||
            ((occurrences(commit.commit.message, ("Co-authored-by:")) == 1) && (commit.commit.message.indexOf(commit.commit.author.email))) ||
            (occurrences(commit.commit.message, ("Signed-off-by:")) > 1) ||
            ((occurrences(commit.commit.message, ("Signed-off-by:")) == 1) && (commit.commit.message.indexOf(commit.commit.author.email))) ||
            ((commit.commit.author.email != commit.commit.committer.email) && ("noreply@github.com" != commit.commit.committer.email))
        ) {

            signed_commit_count[newdate] += 1
        }
    });
    //
    let commit_count = [];
    for (var key in all_commit_count) {
        commit_count.push(all_commit_count[key].length)
    }

    drawLinePlot(commit_count, all_commit_count, signed_commit_count, repoName);
    clear_variables(commit_count, all_commit_count, signed_commit_count)
}

function drawLinePlot(commit_count, all_commit_count, signed_commit_count, repoName) {
    TESTER = document.getElementById('pairingPlot');
    Plotly.purge(TESTER);


    var trace0 = {
        x: Object.keys(all_commit_count).reverse(),
        y: commit_count.reverse(),
        name: 'All Commits'
    };
    var trace1 = {
        x: Object.keys(signed_commit_count).reverse(),
        y: Object.values(signed_commit_count).reverse(),
        name: "Signed-Off-By Commits"
    };
    var data = [trace0, trace1];
    title1 = "Pair programming evolution during project - " + repoName;

    var layout = {
        title: title1,
        xaxis: {
            title: 'Date of commit'
        },
        yaxis: {
            title: 'Amount of commits'
        }
    };


    Plotly.plot(TESTER, data, layout);
    clear_variables(commit_count, all_commit_count, signed_commit_count)
}