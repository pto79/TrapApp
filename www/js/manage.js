// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('manage', ['starter']).controller('ManageCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $ionicPlatform, buildconfig) {
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
    $scope.goCompany = function(id) {
        $window.sessionStorage.setItem("company_id", id);
        $window.location.href = 'company.html';
    }
    $scope.goConfig = function(id) {
        $window.location.href = 'config.html';
    }
    $ionicModal.fromTemplateUrl('templates/modal_new.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalNew = modal;
    });
    $scope.newCompany = {};
    $scope.addCompany = function() {
        var res = $http({
            method: "POST",
            url: buildconfig.appUrl + "company",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                session: session,
                'Content-Type': 'application/json'
            },
            data: {
                name: $scope.newCompany.name,
                description: $scope.newCompany.description
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                getCompanies();
                $scope.oModalNew.hide();
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else $ionicPopup.alert({
                title: 'Add company failed!',
                template: 'Please check the company details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            var alertPopup = $ionicPopup.alert({
                title: 'Add company failed!',
                template: 'Please check your internet connection!',
                okText: 'OK'
            });
        });
    }

    function getCompanies() {
        $scope.companies = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "company/list",
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
                $scope.companies = data.list;
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
    getCompanies();
});