// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('company', ['starter']).controller('CompanyCtrl', function($scope, $window, $http, $ionicModal, $ionicPopup, $ionicPlatform, buildconfig) {
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    company_id = $window.sessionStorage.getItem("company_id");
    $scope.goHome = function() {
        $window.location.href = 'manage.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.goUser = function(id) {
        $window.sessionStorage.setItem("user_id", id);
        $window.location.href = 'user.html';
    }
    $scope.newUser = {};
    $scope.company = {};
    $scope.users = {};
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
    $scope.delCompany = function(id) {
        //trapList();
        $scope.traps = {};
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
                company_id: id,
                page: 1,
                page_size: 100
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.users = data.list;
                console.log($scope.traps.length);
                if ($scope.users.length == 0) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Warning:',
                        template: 'Do you want to delete this company?',
                        okText: 'OK',
                        cancelText: 'Cancel'
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            var res = $http({
                                method: "DELETE",
                                url: buildconfig.appUrl + "company",
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
                                    $window.location.href = 'manage.html';
                                }
                            });
                            res.error(function(data, status, header, config) {
                                console.log(data);
                            });
                        }
                    });
                } else $ionicPopup.alert({
                    title: 'Delete company failed!',
                    template: 'This company has been linked to users.',
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
    $scope.addUser = function() {
        console.log($scope.newUser);
        console.log(company_id);
        var hash = CryptoJS.SHA1($scope.newUser.pwd);
        $scope.password = hash.toString(CryptoJS.enc.Hex);
        console.log($scope.password);
        var res = $http({
            method: "POST",
            url: buildconfig.appUrl + "user",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                session: session,
                'Content-Type': 'application/json'
            },
            data: {
                name: $scope.newUser.name,
                login_name: $scope.newUser.login_name,
                pwd: $scope.password,
                company_id: company_id,
                role: $scope.newUser.role
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.oModalNew.hide();
                $window.location.href = 'company.html';
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else $ionicPopup.alert({
                title: 'Add user failed!',
                template: 'Please check the user details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            console.log(data);
            var alertPopup = $ionicPopup.alert({
                title: 'Add user failed!',
                template: 'Please check your internet connection!',
                okText: 'OK'
            });
        });
    }
    $scope.updateCompany = function(company) {
        var res = $http({
            method: "PATCH",
            url: buildconfig.appUrl + "company",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            data: {
                id: company.id,
                name: company.name,
                description: company.description
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $window.location.href = 'company.html';
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version,
                    okText: 'OK'
                });
            } else if(data.code == 101) $ionicPopup.alert({
                title: 'Update failed!',
                template: 'Please check the update details!',
                okText: 'OK'
            });
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }

    function getCompany() {
        $scope.hub = {};
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "company",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                company_id: company_id
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.company = data.company;
                getUsers();
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
    getCompany();

    function getUsers() {
        $scope.users = {};
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
                company_id: $scope.company.id,
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
                })
            } else if (data.code == 102) {
                $ionicPopup.alert({
                    title: 'Version error!',
                    template: 'Please upgrade your app to version' + version ,
                    okText: 'OK'
                });
            }
        });
        res.error(function(data, status, header, config) {
            console.log(data);
        });
    }
    $scope.cancelUpdate = function() {
        $scope.oModalEdit.hide();
        getCompany();
    }
});