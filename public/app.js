/**
 * Created by fengxiaoping on 12/7/14.
 */


AV.initialize("fqzgxfgh1ek0jhnl76vcd4u3atpqemhxbk0eyx05gyrlinpz", "ploqvsjyiesbailj9jp8vhgkaa0vl110781x1grztc5ufh1u");

var exampleUrls = {
    'wandoujia': 'http://www.wandoujia.com/apps/com.facebook.orca',
    'appchina': 'http://www.appchina.com/app/com.autonavi.minimap',
    '36kr.next': 'http://next.36kr.com/posts/2648',
    'google.play': 'http://play.google.com/store/apps/details?id=com.pacoapp.paco',
    'producthunt': 'http://www.producthunt.com/posts/wire-2',
    '360.zhushou': 'http://zhushou.360.cn/detail/index/soft_id/2078421',
    'apple.itunes': 'https://itunes.apple.com/app/id454638411'
}

var API = AV.Object.extend('API')

angular.module('dashboardApp', [])
    .controller('ParserController', ['$scope', '$http', function ($scope, $http) {
        $scope.localTest = true
        //$scope.exampleUrls = exampleUrls

        $scope.init = function () {
            new AV.Query(API).find().then(function (apis) {
                $scope.$apply(function () {
                    $scope.apis = apis
                })
            })
        }

        $scope.setExample = function (url) {
            $scope.url = url
        }

        $scope.parsePage = function () {
            $scope.result = 'processing, please wait for a second'
            if ($scope.localTest === true) {
                $http.post('/avos/page.parser',
                    {url: $scope.url})
                    .success(function (data, status, headers, config) {
                        if (data.error) {
                            $scope.result = 'api failed,' + JSON.stringify(data.error)
                            $scope.lastUpdate = new Date()
                        } else {
                            console.log(data.result)
                            $scope.result = data.result
                            $scope.lastUpdate = new Date()
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.result = 'api failed'
                        $scope.lastUpdate = new Date()
                    })
            } else {
                AV.Cloud.run('page.parser', {url: $scope.url}, {
                    success: function (result) {
                        $scope.$apply(function () {
                            $scope.result = result
                            $scope.lastUpdate = new Date()
                        })
                    },
                    error: function (error) {
                        $scope.$apply(function () {
                            $scope.result = error
                            $scope.lastUpdate = new Date()
                        })
                    }
                });
            }
        }
    }])
