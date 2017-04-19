var fs        = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');
var Promise = require('bluebird');

processImg('1.jpg', 'test_1.jpg')
    .then(recognizer)
    .then(function (text) {
        console.log("识别结果:"+text);
    })
    .catch(function (err) {
        console.error("识别失败:"+err);
    });

/**
 * 处理图片为阈值图片
 * @param imgPath
 * @param newPath
 * @param [thresholdVal=55] 默认阈值
 * @returns {Promise}
 */
function processImg (imgPath, newPath, thresholdVal) {

    return new Promise(function(resolve, reject) {

        gm(imgPath)
        .threshold(thresholdVal || 55)
        .write(newPath, function(err) {
            console.log(err)
            return false
            if (err)
                return reject(err);

            resolve(newPath);
        });
    });
}

/**
 * 识别图片
 * @param imgPath
 * @param options tesseract options
 * @returns {Promise}
 */
function recognizer (imgPath, options) {
    options = Object.assign({psm: 7}, options);

    return new Promise(function(resolve, reject) {
            tesseract
            .process(imgPath, options, function(err, text) {
                if (err) return reject(err);
                resolve(text.replace(/[\r\n\s]/gm, ''));
            });
    });
}