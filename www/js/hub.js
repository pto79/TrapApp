// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('hub', ['starter']).controller('HubCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $cordovaBarcodeScanner, $ionicPlatform, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, buildconfig) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    hub_id = $window.sessionStorage.getItem("hub_id");
    $scope.goHome = function() {
        $window.location.href = 'main.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.refresh = function() {
        $window.location.reload();
    }
    $scope.goTrap = function(unique_code) {
        $window.sessionStorage.setItem("trap_unique_code", unique_code);
        $window.location.href = 'trap.html';
    }
    $scope.newTrap = {};
    $scope.hub = {};
    $scope.collection = [];
    $scope.collection2 = [];
    $scope.picData;
    var newTrap;
    $scope.appName = buildconfig.appName;
    $ionicModal.fromTemplateUrl('templates/modal_new.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalNew = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal_edit.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalEdit = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal_image.html', {
        id: '3', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalImage = modal;
    });
    $scope.showPic = function(index) {
        $scope.indexOfImage = index;
        $scope.oModalImage.show();
    }
    $scope.delImage = function(index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Warning:',
            template: 'Do you want to delete this photo?',
            okText: 'OK',
            cancelText: 'Cancel'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.collection.splice(index, 1);
                $scope.oModalImage.hide();
            }
        });
    }
    $scope.delHub = function(id) {
        //trapList();
        $scope.traps = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "trap/list",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                hub_id: $scope.hub.id,
                page: 1,
                page_size: 100
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.traps = data.list;
                console.log($scope.traps.length);
                if ($scope.traps.length == 0) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Warning:',
                        template: 'Do you want to delete this hub?',
                        okText: 'OK',
                        cancelText: 'Cancel'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            var res = $http({
                                method: "DELETE",
                                url: buildconfig.appUrl + "hub",
                                headers: {
                                    device_id: device_id,
                                    device_type: device_type,
                                    version: version,
                                    'Content-Type': 'application/json',
                                    session: session
                                },
                                data: {
                                    id: hub_id
                                }
                            })
                            res.success(function(data, status, header, config) {
                                console.log(data);
                                if (data.code == 0) {
                                    $window.location.href = 'main.html';
                                }
                            });
                            res.error(function(data, status, header, config) {
                                console.log(data);
                            });
                        }
                    });
                } else $ionicPopup.alert({
                    title: 'Delete place failed!',
                    template: 'This place has been linked to ' + buildconfig.appName,
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
    $scope.addTrap = function(trap) {
        newTrap = trap;
        checkTrap();
    }

    function checkTrap() {
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
                unique_code: newTrap.unique_code
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'This ' + buildconfig.appName + ' has already been added',
                    template: 'Do you want to replace?',
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
                                id: data.trap.id
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
                        submitTrap();
                    }
                });
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else submitTrap();
        });
        res.error(function(data, status, header, config) {});
    }

    function submitTrap() {
        //newTrap.unique_code = 'test41';
        //newTrap.images = 'n.a';
        newTrap.images = [];
        for (i=0; i<$scope.collection.length; i++) {
            newTrap.images.push( { "main" : $scope.collection[i], "thumbnail" : $scope.collection2[i] } );
            //alert(newTrap.images);
        }
        newTrap.images = JSON.stringify(newTrap.images);
        //alert(newTrap.images);
        var res = $http({
            method: "POST",
            url: buildconfig.appUrl + "trap",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                session: session,
                'Content-Type': 'application/json'
            },
            data: {
                name: newTrap.name,
                description: newTrap.description,
                unique_code: newTrap.unique_code,
                hub_id: hub_id,
                images: newTrap.images,
                map: 'n.a'
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.oModalNew.hide();
                $window.location.href = 'hub.html';
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else $ionicPopup.alert({
                title: 'Add failed!' + data.code,
                template: 'Please check the details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            console.log(data);
            var alertPopup = $ionicPopup.alert({
                title: 'Add failed!',
                template: 'Please check your internet connection!',
                okText: 'OK'
            });
        });
    }
    $scope.updateHub = function(hub) {
        var res = $http({
            method: "PATCH",
            url: buildconfig.appUrl + "hub",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            data: {
                id: hub.id,
                name: hub.name,
                description: hub.description,
                image: hub.images,
                alert_email_1: hub.alert_email_1,
                alert_email_2: hub.alert_email_2,
                alert_email_3: hub.alert_email_3,
                alert_sms_1: hub.alert_sms_1,
                alert_sms_2: hub.alert_sms_2,
                alert_sms_3: hub.alert_sms_3
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.location.href = 'hub.html';
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

    function getHub() {
        $scope.hub = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "hub",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                id: hub_id
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.hub = data.trap;
                if($scope.hub.images != "")
                    $scope.hub.images = angular.fromJson($scope.hub.images);
                else
                    $scope.hub.images = ["https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"];
                getTraps();
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
    getHub();

    function getTraps() {
        $scope.traps = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "trap/list",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                hub_id: $scope.hub.id,
                page: 1,
                page_size: 100
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.traps = data.list;
                angular.forEach($scope.traps, function(trap) {
                  if(trap.is_heartbeat_ok == 0) trap.color = 'lightpink';
                  else {
                    if (trap.status == 0) trap.color = 'lightgray';
                    if (trap.status == 1) trap.color = 'lightgreen';
                    if (trap.status == 2) trap.color = '#FED8B1';
                    }
                    if (trap.images != "")
                        trap.images = angular.fromJson(trap.images);
                    else
                        trap.images = ["https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"];
                })
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
    $scope.scanBarcode = function() {
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                console.log(imageData.text);
                //alert(imageData.text);
                $scope.newTrap.unique_code = imageData.text;
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
            r.response = angular.fromJson(r.response);
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
        params.thumbnail_x = 80;
        params.thumbnail_y = 80;
        options.params = params;
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(buildconfig.appUrl + "upload"), win, fail, options);
    }
    $scope.cancelUpdate = function() {
        $scope.oModalEdit.hide();
        getHub();
    }
});