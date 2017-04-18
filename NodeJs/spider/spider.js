"use strict";
var http = require('http');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./spider_config').config;

var videoIds = config.videoIds;
var url = config.SiteUrl + config.url;
var index = 0;
var _path = config.savePath;//path.dirname(__dirname);


function filterChapters(chapters) {
    var $ = cheerio.load(chapters);

    var chapter = $(config.dockerClass);

    var classTitle = $(config.classTitle).text().trim();

    var courseData = {
        classTitle : classTitle,
        videos : []
    };

    chapter.each(function (_this) {
        _this = $(this);
        var course = [];
        //章节注释
        var info = _this.find(config.TitleFlag).children(config.infoClass).text();
        _this.find(config.TitleFlag).children(config.infoClass).remove();

        //章节标题
        course.Title = _this.find(config.TitleFlag).text().trim() + '（' + info.trim() + '）';
        course.Contents = [];
        _this.find(config.videoClass).children(config.flagName).each(function (video) {
            video = $(this);
            var content = [];
            content.id = video.find(config.hrefClass).attr(config.attrName).trim();
            content.title = video.find(config.hrefClass).text().split('(')[0].trim();
            course.Contents.push(content);
        });

        courseData.videos.push(course);
    });

    return courseData;
}


function spiderWriteFile(html,fileName) {

    fs.exists(_path,function (exists) {
        if (!exists)
            fs.mkdirSync(_path);

        var _filePath = _path + fileName +'.html';
        fs.writeFile(_filePath, html, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file " + fileName + ".html was saved!");
        });
    });

}


function printSpiderData(courseData) {

    fs.exists(_path,function (exists) {
        if (!exists)
            fs.mkdirSync(_path);

        var _filePath = _path + 'tableOfContents.md';
        var string = '';
        courseData.forEach(function (course) {

            string += "# " + course.classTitle + "\n";

            course.videos.forEach(function (item) {

                string += '### ' + item.Title + "\n";

                item.Contents.forEach(function (video) {
                    string += '#### [' + video.title + "](" + config.SiteUrl + video.id + ") " + "\n";
                });

            });

        });

        fs.writeFile(_filePath, string, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("Write The Table Of Contents Success!");
        });

    });
}

function getPageAsync(Url) {
    return new Promise(function (resolve, reject) {
        console.log('正在抓取网页内容: ' + Url);

        http.get(Url,function (res) {
            var html = "";
            res.on('data',function (data) {
                html += data;
            });

            res.on('end',function () {
                resolve(html);
            });
        }).on('error',function (e) {
            reject(e);
            console.log('获取数据发生错误！');
        });
    })
}

var fetchCourseArray = [];

videoIds.forEach(function (id) {
    fetchCourseArray.push(getPageAsync(url + id));
});

Promise
    .all(fetchCourseArray)
    .then(function (pages) {
        var coursesData = [];

        pages.forEach(function (html) {
            var fileName = videoIds[index];
            index += 1;

            var courses = filterChapters(html);

            spiderWriteFile(html,fileName);

            coursesData.push(courses);
        });

        printSpiderData(coursesData);
    });


