// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('report', ['starter']).controller('ReportCtrl', function($scope, $window, $http, $ionicPlatform, $ionicPopup, buildconfig, $ionicActionSheet) {
    $scope.username = $window.sessionStorage.getItem("username");
    device_id = $window.sessionStorage.getItem("device_id");
    device_type = $window.sessionStorage.getItem("device_type");
    version = $window.sessionStorage.getItem("app_version");
    session = $window.sessionStorage.getItem("session");
    $scope.role = $window.sessionStorage.getItem("role");
    $scope.report_type = $window.sessionStorage.getItem("report_type");
    $scope.report = {};
    $scope.hubs = {};
    $scope.search_date = {};
    $scope.search_date.start_ym = '';
    $scope.search_date.end_ym = '';
    $scope.search_date.date_filter = '';
    $scope.search_date.custom_start = '';
    $scope.search_date.custom_end = '';
    $scope.search_date.order = '';
    $scope.appName = buildconfig.appName;
    $scope.orientation = '';
    $scope.goHome = function() {
        $window.location.href = 'main.html';
    }
    $scope.logout = function() {
        $window.localStorage.clear();
        $window.location.href = 'index.html';
    }
    $scope.getActivationReport = function() {
        $scope.reports = {};
        var day;
        var month;
        var year;
        var custom_start;
        var custom_end;
        var location_id = null;
        angular.forEach($scope.hubs, function(hub) {
            if (hub.checked == true) location_id = location_id + hub.id + ',';
        })
        if (location_id != null) location_id = location_id.substr(0, location_id.length - 1);
        if ($scope.search_date.date_filter != 5 || ($scope.search_date.date_filter == 5 && $scope.search_date.custom_start != '' && $scope.search_date.custom_end != '')) {
            if ($scope.search_date.date_filter == 5) {
                year = $scope.search_date.custom_start.getFullYear();
                month = $scope.search_date.custom_start.getMonth() + 1;
                day = $scope.search_date.custom_start.getDate();
                custom_start = year + '-' + month + '-' + day;
                year = $scope.search_date.custom_end.getFullYear();
                month = $scope.search_date.custom_end.getMonth() + 1;
                day = $scope.search_date.custom_end.getDate();
                custom_end = year + '-' + month + '-' + day;
            }
            var res = $http({
                method: "GET",
                url: buildconfig.appUrl + "report/activation",
                headers: {
                    device_id: device_id,
                    device_type: device_type,
                    version: version,
                    'Content-Type': 'application/json',
                    session: session
                },
                params: {
                    order: $scope.search_date.order,
                    date_filter: $scope.search_date.date_filter,
                    location_id: location_id,
                    custom_start: custom_start,
                    custom_end: custom_end
                }
            })
            res.success(function(data, status, header, config) {
                console.log(data);
                if (data.code == 0) {
                    $scope.reports = data.list;
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
    }
    $scope.getServiceReport = function() {
        $scope.reports = {};
        var year;
        var month;
        var start_ym;
        var end_ym;
        console.log($scope.search_date.start_ym);
        if ($scope.search_date.start_ym != '' && $scope.search_date.end_ym != '') {
            year = $scope.search_date.start_ym.getFullYear();
            month = $scope.search_date.start_ym.getMonth() + 1;
            start_ym = year + '-' + month;
            year = $scope.search_date.end_ym.getFullYear();
            month = $scope.search_date.end_ym.getMonth() + 1;
            end_ym = year + '-' + month;
            var res = $http({
                method: "GET",
                url: buildconfig.appUrl + "report/service",
                headers: {
                    device_id: device_id,
                    device_type: device_type,
                    version: version,
                    'Content-Type': 'application/json',
                    session: session
                },
                params: {
                    start_ym: start_ym,
                    end_ym: end_ym
                }
            })
            res.success(function(data, status, header, config) {
                console.log(data);
                if (data.code == 0) {
                    $scope.reports = data.list;
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
        } else $ionicPopup.alert({
            title: 'Search service report failed!',
            template: 'Please provide start and end month.',
            okText: 'OK'
        });
    }
    $scope.getStatusReport = function() {
        $scope.reports = {};
        var location_id = null;
        angular.forEach($scope.hubs, function(hub) {
            if (hub.checked == true) location_id = location_id + hub.id + ',';
        })
        if (location_id != null) location_id = location_id.substr(0, location_id.length - 1);
        console.log(location_id);
        var res = $http({
            method: "GET",
            url: buildconfig.appUrl + "report/status",
            headers: {
                device_id: device_id,
                device_type: device_type,
                version: version,
                'Content-Type': 'application/json',
                session: session
            },
            params: {
                location_id: location_id
            }
        })
        res.success(function(data, status, header, config) {
            console.log(data);
            if (data.code == 0) {
                $scope.reports = data.list;
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

    function doOnOrientationChange() {
        switch (window.orientation) {
            case -90:
            case 90:
                //alert('landscape');
                $scope.orientation = "landscape";
                break;
            default:
                //alert('portrait');
                $scope.orientation = "portrait";
                break;
        }
        $scope.$apply();
    }
    window.addEventListener('orientationchange', doOnOrientationChange);
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