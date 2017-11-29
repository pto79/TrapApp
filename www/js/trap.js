// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('trap', ['starter']).controller('TrapCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, buildconfig) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    trap_unique_code = $window.sessionStorage.getItem("trap_unique_code");
    hub_id = $window.sessionStorage.getItem("hub_id");
    $scope.newTrap = {};
    $scope.collection = [];
    $scope.collection2 = [];
    $scope.picData;
    var newTrapCode = '';
    $scope.appName = buildconfig.appName;
    $scope.goHome = function() {
        $window.location.href = 'main.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.return = function() {
        $window.location.href = 'hub.html';
    }
    $ionicModal.fromTemplateUrl('templates/modal_edit.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalEdit = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal_image.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalImage = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal_reset.html', {
        id: '3', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalReset = modal;
    });
    $scope.showPic = function(index) {
        $scope.indexOfImage = index;
        $scope.oModalImage.show();
    }
    $scope.delTrap = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Warning:',
            template: 'Do you want to delete?',
            okText: 'OK',
            cancelText: 'Cancel'
        });
        confirmPopup.then(function(res) {
            if (res) {
                var res = $http({
                    method: "DELETE",
                    url: buildconfig.appUrl + "trap",
                    headers: {
                        device_id: device_id,
                        device_type: device_type,
                        version: version,
                        'Content-Type': 'application/json',
                        session: session
                    },
                    data: {
                        id: id
                    }
                })
                res.success(function(data, status, header, config) {
                    console.log(data);
                    if (data.code == 0) {
                        $window.location.href = 'hub.html';
                    }
                });
                res.error(function(data, status, header, config) {
                    console.log(data);
                });
            }
        });
    }
    $scope.updateTrap = function(trap) {
        images = JSON.stringify(trap.images);
        var res = $http({
            method: "PATCH",
            url: buildconfig.appUrl + "trap",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            data: {
                id: trap.id,
                name: trap.name,
                description: trap.description,
                images: images,
                map: 'n.a'
            }
        })
        console.log(trap.status);
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.location.href = 'trap.html';
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else if (data.code == 101) $ionicPopup.alert({
                title: 'Update failed!',
                template: 'Please check the update details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }
    $scope.resetTrap = function(trap) {
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "trap",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                unique_code: newTrapCode
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                if (data.trap.id == trap.id) {
                    trap.images = JSON.stringify(trap.images);
                    var res = $http({
                        method: "PATCH",
                        url: buildconfig.appUrl + "trap",
                        headers: {
                            device_id: device_id,
                            device_type: device_type,
                            version: version,
                            'Content-Type': 'application/json',
                            session: session
                        },
                        data: {
                            id: trap.id,
                            status: 1,
                            reset: 1,
                            comment: trap.comment,
                            reset_image: trap.images
                        }
                    })
                    res.success(function(data, status, header, config) {
                        console.log(data);
                        if (data.code == 0) {
                            $window.location.href = 'trap.html';
                        }
                    });
                    res.error(function(data, status, header, config) {
                        console.log(data);
                    });
                } else var alertPopup = $ionicPopup.alert({
                    title: 'Reset failed!',
                    template: 'Please scan the QR code again!',
                    okText: 'OK'
                });
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            }
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }

    function getTrap() {
        $scope.trap = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "trap",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                unique_code: trap_unique_code
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.trap = data.trap;
                //console.log($scope.trap.images.toString());
                //console.log(JSON.parse($scope.trap.images));
                switch (data.trap.status) {
                    case 0:
                        $scope.trap.status = 'Pending Signal';
                        break;
                    case 1:
                        $scope.trap.status = 'Ready';
                        break;
                    case 2:
                        $scope.trap.status = 'Captured';
                        break;
                    default:
                }
                if ($scope.trap.images != "")
                    $scope.trap.images = angular.fromJson($scope.trap.images);
                else
                    $scope.trap.images = ["https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"];
                console.log($scope.trap.images);
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            }
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }
    getTrap();
    $scope.scanBarcode = function() {
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                console.log(imageData.text);
                //alert(imageData.text);
                newTrapCode = imageData.text;
            }, function(error) {
                console.log("An error happened -> " + error);
            });
        });
    }
    $scope.takePic = function() {
        document.addEventListener("deviceready", function() {
            var options = {
                quality: 70,
                destinationType: 1, //Camera.DestinationType.DATA_URL, 0:data_url 1:file_url
                sourceType: 1, //Camera.PictureSourceType.CAMERA, 0:Library 1:Camera
                //allowEdit: true,
                encodingType: 0, //Camera.EncodingType.JPEG,
                //targetWidth: 100,
                //targetHeight: 100,
                //popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                //alert(imageData);
                $scope.picData = imageData;
                newUpload();
            }, function(err) {
                // error
            });
        }, false);
    }

    function newUpload() {
        var fileURL = $scope.picData;
        var uploaded = [];
        var thumbnail = [];
        var key = '';
        var keyname = '';
        var win = function(r) {
            console.log("Code = " + r.responseCode);
            //alert("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            //console.log(response);
            r.response = JSON.parse(r.response);
            //alert(r.response);
            uploaded = r.response.uploaded;
            thumbnail = r.response.thumbnail;
            key = r.response.key;
            for (var i in uploaded) {
                keyname = uploaded[i].toString();
                //filename = keyname.slice(key.length + 1);
                keyname = buildconfig.appUpload + keyname;
                $scope.collection.push(keyname);
                //alert($scope.collection);
            }
            for (var j in thumbnail) {
                keyname = thumbnail[j].toString();
                //filename = keyname.slice(key.length + 1);
                keyname = buildconfig.appUpload + keyname;
                $scope.collection2.push(keyname);
                //alert($scope.collection);
            }
            $scope.$apply();
        }
        var fail = function(error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
        var options = {}; //= new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);;
        options.mimeType = "image/jpeg";
        var params = {};
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(buildconfig.appUrl + "upload"), win, fail, options);
    }
    $scope.cancelUpdate = function() {
        $scope.oModalEdit.hide();
        getTrap();
    }
});