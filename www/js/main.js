// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('main', ['starter']).controller('MainCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $ionicActionSheet, buildconfig) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    $scope.role = $window.sessionStorage.getItem("role");
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
    $scope.goHub = function(id) {
        $window.sessionStorage.setItem("hub_id", id);
        $window.location.href = 'hub.html';
    }
    $ionicModal.fromTemplateUrl('templates/modal_new.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalNew = modal;
    });
    $ionicModal.fromTemplateUrl('templates/modal_image.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalImage = modal;
    });
    $scope.newHub = {};
    $scope.collection = [];
    $scope.collection2 = [];
    $scope.picData;
    $scope.email_inputs = [{
        value: null
    }];
    $scope.addEmailInput = function(index) {
        console.log("new input");
        $scope.email_inputs.push({
            value: null
        });
    }
    $scope.removeEmailInput = function(index) {
        $scope.email_inputs.splice(index, 1);
    }
    $scope.sms_inputs = [{
        value: null
    }];
    $scope.addSmsInput = function(index) {
        console.log("new input");
        $scope.sms_inputs.push({
            value: null
        });
    }
    $scope.removeSmsInput = function(index) {
        $scope.sms_inputs.splice(index, 1);
    }
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
    $scope.addHub = function() {
        if ($scope.email_inputs[0].value != null) $scope.newHub.alert_email_1 = $scope.email_inputs[0].value;
        else $scope.newHub.alert_email_1 = '';
        if ($scope.email_inputs[1] != undefined && $scope.email_inputs[1].value != null) $scope.newHub.alert_email_2 = $scope.email_inputs[1].value;
        else $scope.newHub.alert_email_2 = '';
        if ($scope.email_inputs[2] != undefined && $scope.email_inputs[2].value != null) $scope.newHub.alert_email_3 = $scope.email_inputs[2].value;
        else $scope.newHub.alert_email_3 = '';
        if ($scope.sms_inputs[0].value != null) $scope.newHub.alert_sms_1 = $scope.sms_inputs[0].value;
        else $scope.newHub.alert_sms_1 = '';
        if ($scope.sms_inputs[1] != undefined && $scope.sms_inputs[1].value != null) $scope.newHub.alert_sms_2 = $scope.sms_inputs[1].value;
        else $scope.newHub.alert_sms_2 = '';
        if ($scope.sms_inputs[2] != undefined && $scope.sms_inputs[2].value != null) $scope.newHub.alert_sms_3 = $scope.sms_inputs[2].value;
        else $scope.newHub.alert_sms_3 = '';
        $scope.newHub.images = { "main" : $scope.collection[0], "thumbnail" : $scope.collection2[0] };
        $scope.newHub.images = JSON.stringify($scope.newHub.images);
        //alert($scope.newHub.images);
        var res = $http({
            method: "POST",
            url: buildconfig.appUrl + "hub",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                session: session,
                'Content-Type': 'application/json'
            },
            data: {
                name: $scope.newHub.name,
                description: $scope.newHub.description,
                contact_name: $scope.newHub.contact_name,
                contact_number: $scope.newHub.contact_number,
                images: $scope.newHub.images,
                alert_email_1: $scope.newHub.alert_email_1,
                alert_email_2: $scope.newHub.alert_email_2,
                alert_email_3: $scope.newHub.alert_email_3,
                alert_sms_1: $scope.newHub.alert_sms_1,
                alert_sms_2: $scope.newHub.alert_sms_2,
                alert_sms_3: $scope.newHub.alert_sms_3
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                getHubs();
                $scope.oModalNew.hide();
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else $ionicPopup.alert({
                title: 'Add hub failed!',
                template: 'Please check the hub details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            var alertPopup = $ionicPopup.alert({
                title: 'Add hub failed!',
                template: 'Please check your internet connection!',
                okText: 'OK'
            });
        });
    }

    function getHubs() {
        $scope.hubs = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "hub/list",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                page: 1,
                page_size: 100
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.hubs = data.list;
                angular.forEach($scope.hubs, function(hub) {
                    if (hub.images != "")
                        hub.images = angular.fromJson(hub.images);
                    else
                        hub.images = ["https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"];
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
    getHubs();
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
            //alert(r.response);
            r.response = angular.fromJson(r.response);
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
                //alert($scope.collection2);
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
    $scope.report = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<i class="icon ion-document-text"></i>   Activation Report'
            }, {
                text: '<i class="icon ion-document-text"></i>   Service Report'
            }, {
                text: '<i class="icon ion-document-text"></i>   Status Report'
            }],
            buttonClicked: function(index) {
                switch (index) {
                    case 0:
                        $window.sessionStorage.setItem("report_type", 'activation');
                        break;
                    case 1:
                        $window.sessionStorage.setItem("report_type", 'service');
                        break;
                    case 2:
                        $window.sessionStorage.setItem("report_type", 'status');
                        break;
                    default:
                }
                $window.location.href = 'report.html';
                return true;
            }
        });
    }
});