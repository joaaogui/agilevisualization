// Gets the navbar element above the code and insert a new tab

var repoNav = document.querySelector(".hx_reponav");
agileTab = '<a class="agileTab reponav-item" href="#agile">'
    + '<svg class="far fa-chart-bar" style="color:darkgrey">'
    + '</svg>'
    + '<span> Agile Visualization</span>'
    + '</a>'

repoNav.insertAdjacentHTML('beforeend', agileTab);

// Gets the main area of content

var main = document.querySelector(".repository-content");

// TODO: Code, Issues, Pull Request when clicked, it wont update the bar with the new tab

// Manage the click on the page

$(".agileTab").on("click", function() {
        $('.agileTab').addClass("tabClass")

    // Removes selected class from tab
    $("a.reponav-item").removeClass("selected");

    // Clean the area for the plot
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }

    // Creates the plots divs
    var pairingPlot = document.createElement("div");
    var issuesPlot = document.createElement("div");

    // Set the name of the ids
    $(pairingPlot).attr('id', 'pairingPlot');
    $(issuesPlot).attr('id', 'issuesPlot');

    //Append divs to main container
    main.appendChild(pairingPlot)
    main.appendChild(issuesPlot)

    //Sets the css
    $("#pairingPlot").addClass("size");
    $("#pairingPlot").LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 1)",
        image: "",
        fontawesome: "fa fa-circle-notch fa-spin",
        fontawesomeColor: "#565656"    });

    $("#issuesPlot").addClass("size")
    $("#issuesPlot").LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 1)",
        image: "",
        fontawesome: "fa fa-circle-notch fa-spin",
        fontawesomeColor: "#565656"
    });

    // Set the variables
    var owner = $(".url").text()

    var url = window.location.href

    url = url.replace('https://github.com/','');
    repo = url.replace(owner + '/','');
    repo = repo.split('/')[0]
    getCommits(repo, owner);
    getIssues(repo, owner);


});

