// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('config', ['starter']).controller('ConfigCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $ionicPlatform,buildconfig) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    $scope.goHome = function() {
        $window.location.href = 'manage.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.configs = {};
    function getConfig() {
        $scope.configs = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "config",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            $scope.configs = data;
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }
    getConfig();
    $scope.updateConfig = function(index) {
        console.log($scope.configs[index].key);
        var key = $scope.configs[index].key;
        var key_value = $scope.configs[index].key_value;
        var res = $http({
            method: "PATCH",
            url: buildconfig.appUrl + "config",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            data: {
                key: key,
                key_value: key_value
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.location.href = 'config.html';
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
});