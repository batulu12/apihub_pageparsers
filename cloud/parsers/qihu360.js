/**
 * Created by fengxiaoping on 12/7/14.
 */

var Crawler = require('cloud/utils/crawler')

var QIHU360_API_ENDPOINT = 'http://openbox.mobilem.360.cn/mintf/getAppInfoByIds'

var FIELD_MAPPING = {
    'name': 'name',
    'description': 'brief',
    'productSite': 'apkid',
    'downloadCount': function (obj) {
        return parseInt(obj.download_times)
    },
    'rateValue': function (obj) {
        return parseFloat(obj.rating)
    },
    'tags': function (obj) {
        return obj.list_tag.split(' ')
    },
    'appstore': function () {
        return 'qihu360'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 12
    }
}

exports.do = function (request, response) {
    var url = request.params.url
    Crawler.getJSON({
        url: QIHU360_API_ENDPOINT,
        query: {
            'Charset': 'UTF-8',
            'accept': '*/*',
            'id': url.match(/soft_id\/([\d]+)/)[1]
        }
    }).then(function (body) {
        if (body.total > 0) {
            var result = body.data[0]
            response.success(
                Crawler.renameFields(result, FIELD_MAPPING)
            )
        } else {
            response.error('None exists application')
        }
    }, function (err) {
        response.error(err)
    })
}