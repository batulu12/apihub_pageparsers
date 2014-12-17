/**
 * Created by fengxiaoping on 12/6/14.
 */

var _ = require('underscore')
var unirest = require('unirest')
var Q = require('q')
var Url = require('url')

exports.MILLSEC_IN_AN_HOUR = 1000 * 60 * 60

function processResponse(req, deferred) {
    req.end(function (res) {
        if (res.ok === true) {
            if (typeof res.body === 'string') {
                deferred.resolve(JSON.parse(res.body))
            } else {
                deferred.resolve(res.body)
            }
        } else {
            deferred.reject({
                status: res.status,
                body: res.body
            })
        }
    })
}

exports.getJSON = function (options) {
    var deferred = Q.defer()
    var req = unirest.get(options.url)
        .header(_.extend(
            {'Content-Type': 'application/json'},
            options.header
        ))
        .query(_.extend({}, options.query))
    processResponse(req, deferred)
    return deferred.promise
}

exports.postJSON = function (options) {
    var deferred = Q.defer()
    var req = unirest.post(options.url)
        .query(_.extend({}, options.query))
        .header(_.extend(
            {'Content-Type': 'application/json'},
            options.header
        ))
    if (options.body) {
        if (Array.isArray(options.body)) {
            options.body.forEach(function (part) {
                req.send(part)
            })
        } else {
            req.send(options.body)
        }
    }
    processResponse(req, deferred)
    return deferred.promise
}

exports.getRedirectLocation = function (url) {
    var deferred = Q.defer()

    unirest.get(url).followRedirect(false)
        .headers({'Referer': 'http://next.36kr.com/'})
        .end(function (response) {
            if (response.ok === false && response.statusCode >= 300 && response.statusCode < 400) {
                deferred.resolve(response.headers['location'])
            } else {
                deferred.resolve(undefined)
            }
        })
    return deferred.promise
}

exports.MILLSEC_IN_AN_HOUR = 1000 * 60 * 60

exports.renameFields = function (obj, mapping) {
    for (var key in mapping) {
        var targetKey = mapping[key]
        if ((typeof targetKey === 'string') && (key != targetKey)) {
            obj[key] = obj[targetKey]
            delete obj[targetKey]
        } else if (typeof targetKey === 'function') {
            obj[key] = targetKey(obj)
        }
    }
    return obj
}

exports.apify = function (obj, api) {
    obj.parsers = [api.get('apiPath')]
    return obj
}

exports.HOST_WITH_MULTIPLE_APPS = [
    'google.com',
    'facebook.com',
    'baidu.com',
    'apple.com',
    'adobe.com',
    'tencent.com'
]
_.each(exports.HOST_WITH_MULTIPLE_APPS, function (h) {
    exports.HOST_WITH_MULTIPLE_APPS.push('www.' + h)
})


