# nativescript-videorecord
which can be used in nativescript 3.0 normally!

# How to use it
example:
var camera = require("nativescript-camera");
let options = {
    saveToGallery:true, //default false | optional
     duration:30, //(seconds) default no limit | optional
     size:10, //(MB) default none | optional #android
    hd:true, //default  false low res | optional
    explanation:"Why do i need this permission" //optional on api 23 #android
};
camera.takePicture(options).
    then((imageAsset) => {
        console.log("Result is an image asset instance");
        // var image = new Image();
        // image.src = imageAsset;
    }).catch((err) => {
        console.log("Error -> " + err.message);
    });

#based on nativescript-camera &  nativescript-videorecorder
