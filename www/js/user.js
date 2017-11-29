// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('user', ['starter']).controller('UserCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $ionicPlatform, buildconfig) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    user_id = $window.sessionStorage.getItem("user_id");
    company_id = $window.sessionStorage.getItem("company_id");
    $scope.user = {};
    var newTrapCode = '';
    $scope.goHome = function() {
        $window.location.href = 'manage.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.return = function() {
        $window.location.href = 'company.html';
    }
    $ionicModal.fromTemplateUrl('templates/modal_edit.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModalEdit = modal;
    });
    $scope.delUser = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Warning:',
            template: 'Do you want to delete this user?',
            okText: 'OK',
            cancelText: 'Cancel'
        });
        confirmPopup.then(function(res) {
            if (res) {
                var res = $http({
                    method: "DELETE",
                    url: buildconfig.appUrl + "user",
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
                        $window.location.href = 'company.html';
                    }
                });
                res.error(function(data, status, header, config) {
                    console.log(data);
                });
            }
        });
    }
    $scope.updateUser = function(user) {
        var res = $http({
            method: "PATCH",
            url: buildconfig.appUrl + "user",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            data: {
                id: $scope.user.id,
                name: $scope.user.name,
                login_name: $scope.user.login_name,
                pwd: $scope.user.pwd,
                role: $scope.user.role
            }
        })
        console.log($scope.user.status);
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.location.href = 'user.html';
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
    function getUser() {
        $scope.user = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "user/list",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                company_id: company_id,
                page: 1,
                page_size: 100
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.users = data.list;
                angular.forEach($scope.users, function(user) {
                    if (user.role == 1) user.role_name = "admin";
                    if (user.role == 2) user.role_name = "manager";
                    if (user.role == 3) user.role_name = "user";
                    if (user.id == user_id) $scope.user = user;
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
    getUser();
    $scope.cancelUpdate = function() {
        $scope.oModalEdit.hide();
        getUser();
    }
});