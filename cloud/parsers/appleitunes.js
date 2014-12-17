/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('cloud/utils/crawler'),
    Url = require('url'),
    _ = require('underscore'),
    ERRORS = require('cloud/status_code').ERRORS

var FIELD_MAPPING = {
    'name': 'trackName',
    'rateCount': 'userRatingCount',
    'rateValue': function (obj) {
        if (obj.averageUserRating) {
            return parseFloat(obj.averageUserRating) / 5
        }
    },
    'versionizedRateCount': 'userRatingCountForCurrentVersion',
    'versionizedRateValue': function (obj) {
        if (obj.averageUserRatingForCurrentVersion) {
            return parseFloat(obj.averageUserRatingForCurrentVersion) / 5
        }
    },
    'description': 'description',
    'category': function (obj) {
        return obj.genres
    },
    'productSite': function (obj) {
        if (obj.sellerUrl) {
            var sellerUrl = Url.parse(obj.sellerUrl)
            obj.productSite = sellerUrl.hostname
        } else {
            obj.productSite = obj.bundleId
        }
        if (_.contains(Crawler.HOST_WITH_MULTIPLE_APPS, obj.productSite)) {
            obj.productSite += obj.pathname
        }
        return obj.productSite
    },
    'appstore': function () {
        return 'itunes'
    },
    'tags': function () {
        return ['ios']
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 36
    }
}

exports.do = function (request, response) {
    var url = request.params.url,
        pid = url.match(
            new RegExp(this.api.get('urlPattern'))
        )[1]
    Crawler.getJSON({
        url: 'http://itunes.apple.com/lookup?id=' + pid
    }).then(function (body) {
        if (body.resultCount && body.resultCount > 0) {
            response.success(Crawler.renameFields(body.results[0], FIELD_MAPPING))
            //response.success(body)
        } else {
            response.error(ERRORS.PARSER_PARSING_NOT_EXISTS(url))
        }
        response.success(body)
    }, function (err) {
        response.error(err)
    })
}