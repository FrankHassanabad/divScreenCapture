divScreenCapture
================

This utility will capture screen shots of all the divs from different websites, given a set of URL links.  You edit the
conf.json file and add all the websites that you want to capture the images of their divs from.

First install http://casperjs.org

Second, open up conf.json which is in the same directory as divScreenGrabber.js and edit it.  It should look something
like this

```
{
    "links": [
        {
            "name": "cnnMainPage",
            "url": "http://www.cnn.com"
        },
        {
            "name": "theOnion",
            "url": "http:/http://www.theonion.com/"
        }
    ]
}
```

For each link entry you can add a name which will be the folder to put all the images into and a URL which will be the
website to retrieve all the div images from.  In the above example, you will get two folders of

```
images/cnnMainPage
images/theOnion
```

after running the program.  Speaking of which, to execute this script run

```
casperjs divScreenGrabber.js
```

Optionally, to wait for loading of a site you can add a defaultWait in milliseconds like so

```
{
    "defaultWait": 5000
    "links": [
        {
            "name": "cnnMainPage",
            "url": "http://www.cnn.com"
        },
        {
            "name": "theOnion",
            "url": "http:/http://www.theonion.com/"
        }
    ]
}
```

Also, if you want to login to a website for authentication _first_ before downloading images you can do the following

```
{
    "defaultWait": 5000,
    "start": {
        "name": "optionalLogin",
        "url": "someLoginURL",
        "userNameSelector": "#Email",
        "passwordSelector": "#Passwd",
        "clickSelector": "#signIn",
        "userName": "someuserId",
        "password": "somePassword"
    },
    "links": [
        {
            "name": "someName",
            "url": "someURL"
        }
    ]
}
```



