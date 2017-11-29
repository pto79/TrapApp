// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova']).run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function(event) {
        if (true) { // your check here
            $ionicPopup.confirm({
                title: 'System warning',
                template: 'Are you sure you want to exit?',
                okText: 'OK',
                cancelText: 'Cancel'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 100);
}).constant('buildconfig', {
    appName: 'Trap',
    appTitle: 'iTrap',
    appVersion: '2.1',
    appUrl: 'http://api.trap.triedgetechnology.com.sg/',
    appUpload: 'http://api.trap.triedgetechnology.com.sg/trap_upload/'
}).controller('LoginCtrl', function($scope, $ionicPopup, $window, $http, $cordovaDevice, buildconfig) {
    var platform = '1';
    var uuid = '123456789';
    var localUsername = '';
    var localPassword = '';
    $scope.appTitle = buildconfig.appTitle;
    $scope.appVersion = buildconfig.appVersion;
    document.addEventListener("deviceready", function() {
        platform = $cordovaDevice.getPlatform();
        uuid = $cordovaDevice.getUUID();
    }, false);
    $window.sessionStorage.setItem("app_version", $scope.appVersion);
    $window.sessionStorage.setItem("device_type", platform);
    $window.sessionStorage.setItem("device_id", uuid);
    $scope.data = [];
    $scope.login = function() {
        var hash = CryptoJS.SHA1($scope.data.password);
        $scope.password = hash.toString(CryptoJS.enc.Hex);
        var res = $http({
            method: "POST",
            url: buildconfig.appUrl + "login",
            headers: {
                device_id: uuid,
                device_type: platform,
                version: $scope.appVersion,
                'Content-Type': 'application/json'
            },
            data: {
                login_name: $scope.data.username,
                pwd: $scope.password
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.sessionStorage.setItem("username", $scope.data.username);
                $window.sessionStorage.setItem("session", data.session);
                $window.localStorage.setItem("username", $scope.data.username);
                $window.localStorage.setItem("password", $scope.password);
                $window.sessionStorage.setItem("role",data.role);
                if (data.role != 1) $window.location.href = 'main.html';
                else $window.location.href = 'manage.html';
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + $scope.appVersion,
                    okText: 'OK'
                });
            } else $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your internet connection!',
                okText: 'OK'
            });
        });
    }

    function checkLogin() {
        localUsername = $window.localStorage.getItem("username");
        localPassword = $window.localStorage.getItem("password")
        if (localUsername != null && localPassword != null) {
            var res = $http({
                method: "POST",
                url: buildconfig.appUrl + "login",
                headers: {
                    device_id: uuid,
                    device_type: platform,
                    version: $scope.appVersion,
                    'Content-Type': 'application/json'
                },
                data: {
                    login_name: localUsername,
                    pwd: localPassword
                }
            })
            res.success(function(data, status, header, config) {
                console.log(data);
                if (data.code == 0) {
                    $window.sessionStorage.setItem("username", $scope.data.username);
                    $window.sessionStorage.setItem("session", data.session);
                    $window.sessionStorage.setItem("role",data.role);
                    if (data.role != 1) $window.location.href = 'main.html';
                    else $window.location.href = 'manage.html';
                } else $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!',
                    okText: 'OK'
                });
            });
            res.error(function(data, status, header, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your internet connection!',
                    okText: 'OK'
                });
            });
        }
    }
    checkLogin();
});