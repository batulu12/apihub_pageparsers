require("cloud/app.js");

var models = require('cloud/models')
var ERRORS = require('cloud/status_code').ERRORS

function matchPattern(url, pattern) {
    if (url && pattern) {
        var match = url.match(new RegExp(pattern))
        if (match && match.length > 1) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function ApiDefine(api) {
    var apiPath = api.get('apiType') + '.' + api.get('apiName') + '.' + api.get('apiVersion')
    api.set('apiPath', apiPath)
    var workerPath = 'cloud/' + api.get('worker')
    var worker = require(workerPath)
    worker.api = api
    console.log('api loaded,%s,%s', apiPath, workerPath)

    return {
        apiPath: apiPath,
        isValid: function () {
            return !(typeof worker === 'undefined')
        },
        callback: function (request, response) {
            var url = request.params.url,
                urlPattern = api.get('urlPattern')
            if (url && matchPattern(url, urlPattern)) {
                try {
                    worker.do(request, response)
                } catch (err) {
                    console.trace(err.stack)
                    response.error(ERRORS.PARSER_PARSING_FAILED(err.stack))
                }
            } else {
                response.error(ERRORS.PARSER_INVALID_URL(url))
            }
        }
    }
}

models.API.getAll().then(function (apis) {
    apis.forEach(function (api) {
        var apiDefine = new ApiDefine(api)
        if (apiDefine.isValid()) {
            api.callback = apiDefine.callback
            AV.Cloud.define(apiDefine.apiPath, apiDefine.callback)
        } else {
            console.log('invalid api,%s', JSON.stringify(api))
        }
    })

    AV.Cloud.define('page.parser', function (request, response) {
        var url = request.params.url
        var hit = false
        for (var i = 0; i < apis.length; i++) {
            var api = apis[i]
            if (url && matchPattern(url, api.get('urlPattern'))) {
                api.callback(request, response)
                hit = true
                break
            }
        }
        if (!hit) {
            response.error('no parser for this url,' + url)
        }
    })

}, function (err) {
    console.error(err)
})

