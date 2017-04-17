/**
 * Created by maple on 2017/4/5.
 */
// var http = require('http');
// var siteUrl = require('url')
//
// var server = http.createServer(function (req, res) {
//     res.writeHead(200,{'Content-Type': 'text/plain'});
//     res.end('Hello World\n');
// });
//
// var urlPath = siteUrl.parse('http:pkbet.org/index.php/Index/egmae/?metype=EG');
// server.listen(1337,'127.0.0.1');
// console.log(urlPath)
// console.log('Server running at http://127.0.0.1:1337/');

// 获取整个页面
// var http = require('http');
// var url = "http://www.imooc.com/learn/348"
//
// http.get(url,function (res) {
//     var html = ""
//     res.on('data',function (data) {
//         html += data
//     })
//
//     res.on('end',function () {
//         console.log(html)
//     })
// }).on('error',function () {
//     console.log('获取数据发生错误！')
// })


var http = require('http');
var cheerio = require('cheerio');
var config = require('./spider_config').config;
var url = "http://www.imooc.com/learn/348";

function filterChapters(chapters) {
    var $ = cheerio.load(chapters);

    var chapter = $(config.dockerClass);

    var courseData = [];

    chapter.each(function (_this) {
        _this = $(this);
        var course = [];
        course.Title = _this.find(config.TitleFlag).text();
        course.Contents = [];
        _this.find(config.videoClass).children(config.flagName).each(function (video) {
            video = $(this);
            var content = [];
            content.id = video.find(config.hrefClass).attr(config.attrName);
            content.title = video.find(config.hrefClass).text();
            course.Contents.push(content);
        });
        courseData.push(course);
    });

    return courseData;
}


function printSpiderData(courseData) {
    courseData.forEach(function (item) {
        console.log(replace(item.Title) + '\n');

        item.Contents.forEach(function (video) {
            video.title = video.title.split('(')[0];
            console.log('    ' + replace(video.id) + '\n');
            console.log('    ' + replace(video.title) + '\n');
        })
    })
}

function replace(obj) {
    //删除内容中的所有空格
    return obj.replace(/\s/gi, '');
}


http.get(url,function (res) {
    var html = "";
    res.on('data',function (data) {
        html += data;
    });

    res.on('end',function () {
        var courseData = filterChapters(html);
        printSpiderData(courseData);
    });
}).on('error',function () {
    console.log('获取数据发生错误！');
});

