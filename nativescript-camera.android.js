"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applicationModule = require("application");
var imageAssetModule = require("image-asset");
var trace = require("trace");
var platform = require("platform");
var permissions = require("nativescript-permissions");
var app = require("application");
var RESULT_CANCELED = 0;
var RESULT_OK = -1;
var REQUEST_VIDEO_CAPTURE = 999;
var REQUEST_CODE_ASK_PERMISSIONS = 1000;
var ORIENTATION_UNKNOWN = -1;
var PERMISSION_DENIED = -1;
var PERMISSION_GRANTED = 0;
var MARSHMALLOW = 23;
var applicationModule = require("application");
var platform = require("platform");
var currentapiVersion = android.os.Build.VERSION.SDK_INT;
var REQUEST_IMAGE_CAPTURE = 3453;
var REQUEST_REQUIRED_PERMISSIONS = 1234;
exports.takePicture = function (options) {
    return new Promise(function (resolve, reject) {
           options = options || {};
            var data = null;
            var file;
             var utils = require("utils/utils");
            options.size = options.size || 0;
            options.hd = options.hd ? 1 : 0;
            options.saveToGallery = options.saveToGallery || false;
            options.duration = options.duration || 0;
            options.explanation = options.explanation = "";
            var startRecording = function () {
                var intent = new android.content.Intent(android.provider.MediaStore.ACTION_VIDEO_CAPTURE);
                intent.putExtra(android.provider.MediaStore.EXTRA_VIDEO_QUALITY, options.hd);
                if (options.size > 0) {
                    intent.putExtra(android.provider.MediaStore.EXTRA_SIZE_LIMIT, options.size * 1024 * 1024);
                }
                if (!options.saveToGallery) {
                    var fileName = "videoCapture_" +new Date() + ".mp4";
                    var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + fileName;
                    intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, file.toURI());
                }
                else {
                    var fileName = "videoCapture_" +new Date() + ".mp4";
                    var sdkVersionInt = parseInt(platform.device.sdkVersion);
                    if (sdkVersionInt >= 21) {
                        // var path = utils.ad.getApplicationContext().getExternalFilesDir(null).getAbsolutePath() + "/" +fileName;
                         var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_MOVIES).getAbsolutePath() + fileName;
                        file = new java.io.File(path);
                        // var tempPictureUri = android.support.v4.content.FileProvider.getUriForFile(applicationModule.android.currentContext, applicationModule.android.nativeApp.getPackageName() + ".provider", file);
                        intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, file);
                    }
                    else {
                        var path = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + fileName;
                        file = new java.io.File(path);
                        intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, android.net.Uri.fromFile(file));
                    }
                }
                if (options.duration > 0) {
                    intent.putExtra(android.provider.MediaStore.EXTRA_DURATION_LIMIT, options.duration);
                }
                if (intent.resolveActivity(utils.ad.getApplicationContext().getPackageManager()) != null) {
                    app.android.foregroundActivity.startActivityForResult(intent, REQUEST_VIDEO_CAPTURE);
                    app.android.on(app.AndroidApplication.activityResultEvent, function (args) {
                        if (args.requestCode === REQUEST_VIDEO_CAPTURE && args.resultCode === RESULT_OK) {
                            if (options.saveToGallery) {
                                resolve({ file: file.toString() });
                            }
                            else {
                                resolve({ file: file.toString() });
                            }
                        }
                        else if (args.resultCode === RESULT_CANCELED) {
                            reject({ event: 'cancelled' });
                        }
                        else {
                            reject({ event: 'failed' });
                        }
                    });
                }
                else {
                    reject({ event: 'failed' });
                }
            };
            if (currentapiVersion >= MARSHMALLOW) {
                if (options.explanation.length > 0) {
                    if (permissions.hasPermission(android.Manifest.permission.CAMERA)) {
                        startRecording();
                    }
                    else {
                        permissions.requestPermission(android.Manifest.permission.CAMERA, options.explanation)
                            .then(function () {
                            startRecording();
                        })
                            .catch(function () {
                            reject({ event: 'camera permission needed' });
                        });
                    }
                }
                else {
                    if (permissions.hasPermission(android.Manifest.permission.CAMERA)) {
                        startRecording();
                    }
                    else {
                        permissions.requestPermission(android.Manifest.permission.CAMERA)
                            .then(function () {
                            startRecording();
                        })
                            .catch(function () {
                            reject({ event: 'camera permission needed' });
                        });
                    }
                }
            }
            else {
                startRecording();
            }
        // try {
        //     if (android.support.v4.content.ContextCompat.checkSelfPermission(applicationModule.android.currentContext, android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
        //         reject(new Error("Application does not have permissions to use Camera"));
        //         return;
        //     }
        //     var types = require("utils/types");
        //     var utils = require("utils/utils");
        //     var saveToGallery_1;
        //     var reqWidth_1;
        //     var reqHeight_1;
        //     var shouldKeepAspectRatio_1;
        //     var density = utils.layout.getDisplayDensity();
        //     if (options) {
        //         saveToGallery_1 = options.saveToGallery ? true : false;
        //         reqWidth_1 = options.width ? options.width * density : 0;
        //         reqHeight_1 = options.height ? options.height * density : reqWidth_1;
        //         shouldKeepAspectRatio_1 = types.isNullOrUndefined(options.keepAspectRatio) ? true : options.keepAspectRatio;
        //     }
        //     if (android.support.v4.content.ContextCompat.checkSelfPermission(applicationModule.android.currentContext, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
        //         saveToGallery_1 = false;
        //     }
        //     var takePictureIntent = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        //     var dateStamp = createDateTimeStamp();
        //     var picturePath_1;
        //     var nativeFile = void 0;
        //     var tempPictureUri = void 0;
        //     if (saveToGallery_1) {
        //         picturePath_1 = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera/" + "NSIMG_" + dateStamp + ".jpg";
        //         nativeFile = new java.io.File(picturePath_1);
        //     }
        //     else {
        //         picturePath_1 = utils.ad.getApplicationContext().getExternalFilesDir(null).getAbsolutePath() + "/" + "NSIMG_" + dateStamp + ".jpg";
        //         nativeFile = new java.io.File(picturePath_1);
        //     }
        //     var sdkVersionInt = parseInt(platform.device.sdkVersion);
        //     if (sdkVersionInt >= 21) {
        //         tempPictureUri = android.support.v4.content.FileProvider.getUriForFile(applicationModule.android.currentContext, applicationModule.android.nativeApp.getPackageName() + ".provider", nativeFile);
        //     }
        //     else {
        //         tempPictureUri = android.net.Uri.fromFile(nativeFile);
        //     }
        //     takePictureIntent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, tempPictureUri);
        //     if (takePictureIntent.resolveActivity(utils.ad.getApplicationContext().getPackageManager()) != null) {
        //         var appModule_1 = require("application");
        //         appModule_1.android.on("activityResult", function (args) {
        //             var requestCode = args.requestCode;
        //             var resultCode = args.resultCode;
        //             if (requestCode === REQUEST_IMAGE_CAPTURE && resultCode === android.app.Activity.RESULT_OK) {
        //                 if (saveToGallery_1) {
        //                     try {
        //                         var callback = new android.media.MediaScannerConnection.OnScanCompletedListener({
        //                             onScanCompleted: function (path, uri) {
        //                                 if (trace.isEnabled()) {
        //                                     trace.write("image from path " + path + " has been successfully scanned!", trace.categories.Debug);
        //                                 }
        //                             }
        //                         });
        //                         android.media.MediaScannerConnection.scanFile(appModule_1.android.context, [picturePath_1], null, callback);
        //                     }
        //                     catch (ex) {
        //                         if (trace.isEnabled()) {
        //                             trace.write("An error occurred while scanning file " + picturePath_1 + ": " + ex.message + "!", trace.categories.Debug);
        //                         }
        //                     }
        //                 }
        //                 ;
        //                 var asset = new imageAssetModule.ImageAsset(picturePath_1);
        //                 asset.options = {
        //                     width: reqWidth_1,
        //                     height: reqHeight_1,
        //                     keepAspectRatio: shouldKeepAspectRatio_1
        //                 };
        //                 resolve(asset);
        //             }
        //         });
        //         appModule_1.android.foregroundActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        //     }
        // }
        // catch (e) {
        //     if (reject) {
        //         reject(e);
        //     }
        // }
    });
};
exports.isAvailable = function () {
    var utils = require("utils/utils");
    return utils.ad.getApplicationContext().getPackageManager().hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA);
};
exports.requestPermissions = function () {
    if (android.support.v4.content.ContextCompat.checkSelfPermission(applicationModule.android.currentContext, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED ||
        android.support.v4.content.ContextCompat.checkSelfPermission(applicationModule.android.currentContext, android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
        android.support.v4.app.ActivityCompat.requestPermissions(applicationModule.android.currentContext, [android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], REQUEST_REQUIRED_PERMISSIONS);
    }
};
var createDateTimeStamp = function () {
    var result = "";
    var date = new Date();
    result = date.getFullYear().toString() +
        ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
        (date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString()) + "_" +
        date.getHours().toString() +
        date.getMinutes().toString() +
        date.getSeconds().toString();
    return result;
};
