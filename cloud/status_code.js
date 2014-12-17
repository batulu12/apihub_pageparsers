/**
 * Created by fengxiaoping on 12/6/14.
 */

exports.ERRORS = {
    PARSER_INVALID_URL: function (msg) {
        return {
            errorCode: 1001,
            errorMessage: 'invalid url,' + msg
        }
    },
    PARSER_PARSING_FAILED: function (msg) {
        return {
            errorCode: 1002,
            errorMessage: 'parsing failed,' + msg
        }
    },
    PARSER_PARSING_FETCH_FAILED: function (url) {
        return {
            errorCode: 1003,
            errorMessage: 'parsing failed, fetch url failed,' + url
        }
    },
    PARSER_PARSING_FETCH_REDIRECT_FAILED: function (url) {
        return {
            errorCode: 1004,
            errorMessage: 'parsing failed, fetch redirect failed,' + url
        }
    },
    PARSER_PARSING_NOT_EXISTS: function (url) {
        return {
            errorCode: 1005,
            errorMessage: 'parsing failed, page not exists,' + url
        }
    }
}