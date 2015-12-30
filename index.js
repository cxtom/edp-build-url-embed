/**
 * @file UrlEmbededProcessor
 * @author cxtom(cxtom2010@gmail.com)
 */

/* globals AbstractProcessor */

var util = require('util');
var path = require('path');
var mime = require('mime');
var assert = require('assert');


var BASE_URL_REGEX = 'url\\(["\']?([^"\'\\(\\)]+?)["\']?\\)[};,!\\s]';
var EXCLUSIVE_URL_REGEX = BASE_URL_REGEX + '(?!\\s*?\\/\\*\\s*?noembed\\s*?\\*\\/)';
var INCLUSIVE_URL_REGEX = BASE_URL_REGEX + '\\s*?\\/\\*\\s*?embed\\s*?\\*\\/';
var EMBEDDABLE_URL_REGEX = /^data:/;
var REMOTE_URL_REGEX = /^(http|https):/;

function UrlEmbededProcessor(options) {
    AbstractProcessor.call(this, options);
}

util.inherits(UrlEmbededProcessor, AbstractProcessor);


UrlEmbededProcessor.DEFAULT_OPTIONS = {
    name: 'UrlEmbededProcessor',
    files: ['*.styl', '*.css', '*.less'],
    extensions: ['.jpg', '.png'],

    inclusive: true
};


/**
 * 构建处理
 *
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
UrlEmbededProcessor.prototype.process = function (file, processContext, callback) {

    var fileContent = file.data;
    var filePath = file.path;

    var basePath = process.cwd();

    var urlRegex = new RegExp(this.inclusive ? INCLUSIVE_URL_REGEX : EXCLUSIVE_URL_REGEX, 'g');

    var me = this;

    var data = fileContent.replace(urlRegex, function ($0, $1) {

        var url = $1;

        if (url.match(EMBEDDABLE_URL_REGEX)
            || url.match(REMOTE_URL_REGEX)
            || me.extensions.indexOf(path.extname(url)) < 0) {
            return url;
        }

        url = path.resolve(path.dirname(filePath), url);
        url = path.relative(basePath, url);

        var resource = processContext.getFileByPath(url);

        assert(resource, 'embed resource not exist:' + url);

        var base64Content = resource.data.toString('base64');
        var mimeType = mime.lookup(url);

        var dataUri = 'url("data:' + mimeType + ';base64,' + base64Content + '")';

        return dataUri;

    });

    file.setData(data);

    callback();

};

module.exports = UrlEmbededProcessor;
