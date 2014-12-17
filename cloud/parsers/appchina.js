/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('cloud/utils/crawler')

// www.appchina.com/app/aimoxiu.theme.qmtizinw
var APPCHINA_API_ENDPOINT = 'http://www.appchina.com/market/api'

var FIELD_MAPPING = {
    'name': 'name',
    'rateCount': 'ratingCount',
    'rateValue': function (obj) {
        return parseFloat(obj.rating) / 5
    },
    'voteCount': 'likeTimes',
    'hateCount': 'dislikeTimes',
    'downloadCount': 'downloadCount',
    'brief': 'shorDesc',
    'description': 'updateMsg',
    'category': 'categoryName',
    'productSite': 'packageName',
    'appstore': function () {
        return 'itunes'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 3
    }
}

exports.do = function (request, response) {
    var api = this.api,
        pid = request.params.url.match(
            new RegExp(this.api.get('urlPattern'))
        )[1]
    Crawler.postJSON({
        url: APPCHINA_API_ENDPOINT,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: [
            'api=market.AppSpace',
            'key= ',
            'param=' + JSON.stringify({
                "apiVer": 1,
                "guid": "appchinacrawler",
                "type": "detail.adapted",
                "packageName": pid
            })
        ]
    }).then(function (body) {
        response.success(
            Crawler.renameFields(body, FIELD_MAPPING)
        )
    }, function (err) {
        response.error(err)
    })
}