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

