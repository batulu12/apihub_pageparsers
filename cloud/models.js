/**
 * Created by fengxiaoping on 12/6/14.
 */

var Q = require('q')

function getAllByQuery(query) {
    var deferred = Q.defer(),
        skip = 0, limit = 500,
        results = [];
    query.limit(limit)
    function getBunch() {
        query.skip(skip)
        query.find(function (items) {
            items.forEach(function (item) {
                results.push(item)
            })
            if (items.length === limit) {
                skip += limit;
                getBunch();
            } else {
                deferred.resolve(results);
            }
        })
    }

    getBunch()
    return deferred.promise
}

var models = ['API'],
    result = {}

models.forEach(function (modelName) {
    result[modelName] = AV.Object.extend(modelName)
    result[modelName].getAll = function () {
        return getAllByQuery(new AV.Query(result[modelName]))
    }
    console.log('Model loaded,%s', modelName)
})

module.exports = result