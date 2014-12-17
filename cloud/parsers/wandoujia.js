/**
 * Created by fengxiaoping on 12/6/14.
 */
var Crawler = require('cloud/utils/crawler'),
    _ = require('underscore')

var FIELD_MAPPING = {
    'name': 'title',
    'description': 'description',
    'productSite': 'packageName',
    'downloadCount': 'downloadCnt',
    'appstore': function () {
        return 'wandoujia'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 6
    }
}

// http://www.wandoujia.com/apps/com.baidu.BaiduMap
exports.do = function (request, response) {
    var url = request.params.url
    var pn = url.match(/\/apps\/([a-zA-Z0-9.]+)/)[1]
    Crawler.getJSON({
        url: 'http://portal.wandoujia.com/app/detail.json',
        query: {pn: pn}
    }).then(function (body) {
        response.success(
            Crawler.renameFields(body, FIELD_MAPPING)
        )
    }, function (err) {
        response.error(err)
    })
}