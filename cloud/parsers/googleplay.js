/**
 * Created by fengxiaoping on 12/6/14.
 */

var Crawler = require('cloud/utils/crawler'),
    ERRORS = require('cloud/status_code').ERRORS

var GOOGLE_PLAY_API_ENDPOINT = 'https://api.import.io/store/data/3b9cd76c-fc99-44ae-bf58-e4fc1dfd5627/_query?&='

var FIELD_MAPPING = {
    'name': 'title',
    'category': 'category/_text',
    'rateCount': 'ratingCount',
    'rateValue': function (obj) {
        return parseFloat(obj.rating) / 5
    },
    'voteCount': 'likeTimes',
    'hateCount': 'dislikeTimes',
    'downloadCount': 'downloadCount',
    'brief': 'shorDesc',
    'description': 'description',
    'productSite': 'packageName',
    'appstore': function () {
        return 'googleplay'
    },
    'expiredIn': function () {
        return Crawler.MILLSEC_IN_AN_HOUR * 3
    }
}

exports.do = function (request, response) {
    var url = request.params.url
    Crawler.postJSON({
        url: GOOGLE_PLAY_API_ENDPOINT,
        query: {
            '_user': 'de6718a6-46f9-4a4a-9f26-20e8283623d3',
            '_apikey': 'gP/OA4gTaSBr5qZf+4fRxpmSVj0paa3a95gLBAW6m+tH+Ti2Cu5gKPdIxAty/MvXQDj4oiIR6zkicEEh47iY7g=='
        },
        body: {
            'input': {
                'webpage/url': url
            }
        }
    }).then(function (body) {
        if (body.results && body.results.length > 0) {
            response.success(Crawler.renameFields(body.results[0], FIELD_MAPPING))
        } else {
            response.error(ERRORS.PARSER_PARSING_NOT_EXISTS(url))
        }
    }, function (err) {
        response.error(err)
    })
}