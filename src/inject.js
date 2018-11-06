// Gets the navbar element above the code and insert a new tab

var repoNav = document.querySelector(".reponav");

agileTab = '<a class="agileTab reponav-item" href="#agilevisualization">'
    + "Agile Visualization"
    + '</a>'

repoNav.insertAdjacentHTML('beforeend', agileTab);

// Gets the main area of content 

var main = document.querySelector(".repository-content");

// Manage the click on the page

$(".agileTab").on("click", function() {
    console.log("entrou")
    $('.agileTab').addClass("tabClass")
    // TODO: Remove selected class from tab
    // $(".repoNav>span>a.selected").removeClass("selected");
    // $(".repoNav>a.selected").removeClass("selected");
    // $(".repoNav>div>a.selected").removeClass("selected");

    // $(".new-discussion-timeline").addClass("red")
    // Clean the area for the plot

    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
    // Creates the plots divs

    var pairingPlot = document.createElement("div");
    $(pairingPlot).attr('id', 'pairingPlot');

    $('#pairingPlot').css({
        'width': "100%",
        'height': "60%"
    });

    main.appendChild(pairingPlot)
    drawLinePlot()


});

