/**
 * Created by fengxiaoping on 12/7/14.
 */
var Crawler = require('cloud/utils/crawler'),
    ERRORS = require('cloud/status_code').ERRORS,
    unirest = require('unirest'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    Url = require('url')

exports.do = function (request, response) {
    var url = request.params.url
    unirest.get(url).end(function (res) {
        console.log('page loaded,%s', res)
        if (res.ok === true) {
            var $ = cheerio.load(res.body)
            var result = {}
            result.voteCount = parseInt($('.modal-post--header--upvote .vote-count').text().trim())
            result.appstore = 'producthunt'
            result.name = $('.modal-post--header--title').text().trim()
            result.brief = $('.modal-post--header--tagline').text().trim()
            result.hitUrl = $('.modal-post--header--title a').attr('href').trim()
            console.log('get redirect!')
            Crawler.getRedirectLocation('http://www.producthunt.com' + result.hitUrl)
                .then(function (u) {
                    result.productSite = Url.parse(u).hostname
                    result.commentCount = parseInt($('.modal-post--comments--title').text().replace(' Comments', ''))
                    result.expiredIn = Crawler.MILLSEC_IN_AN_HOUR * 1
                    response.success(result)
                }, function () {
                    response.error('get product site failed,%s', result.hitUrl)
                })
        } else {
            response.error(ERRORS.PARSER_PARSING_FETCH_FAILED(url))
        }
    })

}
