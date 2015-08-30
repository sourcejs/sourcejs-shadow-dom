var path = require('path');
var cheerio = require('cheerio');
var utils = require(path.join(global.pathToApp, 'core/lib/utils.js'));

// Module configuration
var globalConfig = global.opts.plugins && global.opts.plugins.shadowDom ? global.opts.plugins.shadowDom : {};
var config = {
    enabled: true,

    // Public object is exposed to Front-end via options API.
    public: {}
};

// Overwriting base options
utils.extendOptions(config, globalConfig);

var gatherResources = function ($, $headResources, $bodyResources) {
    var resources = {
        top: '',
        bottom: ''
    };

    var processLink = function (el) {
        if (el.name !== 'link' && !el.attribs.href) return $(el);

        return $('<style>@import "' + el.attribs.href + '"</style>');
    };

    $headResources.each(function () {
        var $el = processLink(this);
        var html = $('<div>').append($el.clone()).html();

        resources.top += html;
    });

    $bodyResources.each(function () {
        var $el = processLink(this);
        var html = $('<div>').append($el.clone()).html();

        if ($el[0].name === 'style') {
            resources.top += html;
        } else {
            resources.bottom += html;
        }
    });

    return resources;
};


/*
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - The callback function
 * */
var processRequest = function (req, res, next) {
    // Check if it's clarify request, change after SourceJS Clarify params fix
    var isClarify = !req.headers['user-agent'];

    if (!config.enabled || isClarify) {
        next();
        return;
    }

    // Check if request is targeting Spec
    if (req.specData && req.specData.renderedHtml) {
        var data = req.specData.renderedHtml.replace(/^\s+|\s+$/g, '');
        var $ = cheerio.load(data, {decodeEntities: false});
        var $examples = $('.source_example');
        var $head = $('head');
        var $body = $('body');
        var $headResources = $head.find('style, link').not('[data-source="core"]');
        var $bodyResources = $body.find('style, link').not('[data-source="core"]');

        var resources = gatherResources($, $headResources, $bodyResources);

        $examples.each(function () {
            var $el = $(this);
            var exampleContent = $el.html();

            $el.html('');

            $el.append('<template class="sourcejs_shadow-dom_tpl">'+ resources.top + exampleContent + resources.bottom + '</template>');
        });

        $headResources.remove();
        $bodyResources.remove();

        req.specData.renderedHtml = $.html();

        next();
    } else {
        next();
    }
};

exports.process = processRequest;