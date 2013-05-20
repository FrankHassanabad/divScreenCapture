//Configure to output debugging information
//and that the web site will be viewed in 1024x768
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    viewportSize: { width: 1024, height: 768 }
});
//file system support
var fs = require('fs');


//read the configuration file
var confFile = "conf.json";
var confContentsString = fs.read(confFile);
var conf = JSON.parse(confContentsString);

//Stat Casper
casper.start();

//Login into a site if the user specifies that they should through the json
//structure of
//
//{
//    "defaultWait": 5000,
//    "start": {
//        "name": "optionalLogin",
//        "url": "some login",
//        "userNameSelector": "#Email",
//        "passwordSelector": "#Passwd",
//        "clickSelector": "#signIn",
//        "userName": "someUserName",
//        "password": "somePassword"
//},
//    "links": [
//        {
//            "name": "mainScreen",
//            "url": "some URL"
//        }
//    ]
//}
if (typeof conf.start != 'undefined' && typeof conf.start.url != 'undefined') {
    casper.thenOpen(conf.start.url);
    if (typeof conf.start.userNameSelector != 'undefined' && conf.start.passwordSelector != 'undfined'
        && conf.start.clickSelector != 'undefined') {
        //Login if we have login information
        casper.thenEvaluate(function (conf) {
            document.querySelector(conf.start.userNameSelector).value = conf.start.userName;
            document.querySelector(conf.start.passwordSelector).value = "Zaqwsx123";
            document.querySelector(conf.start.clickSelector).click();
        }, conf);
    }
}

//If the default wait isn't set, then let's set it
if(typeof conf.defaultWait == 'undefined') {
    conf.defaultWait = 1;
}

//Get all of the links
var links = conf.links;
for(var i = 0; i < links.length; i++) {
    var link = links[i];
    createImages(link.url, link.name);
}

/**
 * Creates the images based off of the link name
 * @param url The url to create the images from
 * @param name The name to create the folder with
 */
function createImages(url, name) {
    //Open the URL and create teh folder
    casper.thenOpen(url);
    casper.then(function() {
        fs.makeTree("images/" + name);
    });

    //Wait for the data using the default wait period
    casper.then(function() {
        this.echo("Waiting " + conf.defaultWait + " seconds for the data to load.");
        this.wait(conf.defaultWait, function() {
            this.echo("Done waiting for the data to load");
        });
    });

    //Get the rectangular coordinates for each div
    casper.then(function () {
        //get the rectangular coordinates for each of the divs
        var rectangularCoords = this.evaluate(function () {
            var divs = document.getElementsByTagName("div");
            var rectangularCoords = new Array();
            for (var i = 0; i < divs.length; i++) {
                var element = divs[i];
                if (element != null) {
                    var boundingRect = element.getBoundingClientRect();
                    var attributeId = element.getAttribute("id");
                    rectangularCoords.push({
                        top: boundingRect.top,
                        left: boundingRect.left,
                        width: boundingRect.width,
                        height: boundingRect.height,
                        id: attributeId == null ? "unknown_" + i : attributeId
                    });
                }
            }
            return rectangularCoords;
        });

        //iterate over the rectangular coordinates and write out the images
        for(var j = 0; j < rectangularCoords.length; ++j) {
            if (rectangularCoords[j].top == 0 &&
                rectangularCoords[j].left == 0 &&
                rectangularCoords[j].width == 0 &&
                rectangularCoords[j].height == 0) {
                this.echo("[top = 0, left = 0, width = 0, height = 0, NOT writing this image out]");
            } else {
                this.echo("[top = 0" + rectangularCoords[j].top +
                    ", left = " + rectangularCoords[j].left +
                    ", width = " + rectangularCoords[j].width +
                    ", height = " + rectangularCoords[j].height +
                    " being written to file name" + j + "]")
                this.capture('images/' + name + "/" + rectangularCoords[j].id + '.png', {
                    top: rectangularCoords[j].top,
                    left: rectangularCoords[j].left,
                    width: rectangularCoords[j].width,
                    height: rectangularCoords[j].height
                });
            }
        }
    });
}

//start the casper process altogether
casper.run(function() {
    this.exit();
});
