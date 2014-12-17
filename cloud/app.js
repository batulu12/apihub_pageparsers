var express = require('express'),
//models = require('cloud/models'),
    app = express()

app.set('views', 'cloud/views')   // 设置模板目录
app.set('view engine', 'ejs')    // 设置 template 引擎
app.use(express.bodyParser())    // 读取请求 body 的中间件

app.get('/api.txt', function (req, res) {
    models.API.getAll().then(function (apis) {
        console.log('result:%s', apis)
        res.send(apis)
    }, function (err) {
        res.status(500).send(err)
    })
});

app.listen()