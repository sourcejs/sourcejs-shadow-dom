require([
    'jquery',
    'sourceModules/module'
], function($, Module) {

    'use strict';

    /**
     * @Object default module option values
     */
    var defaults = {
    };

    /**
     * @constructor
     *
     * @param [Object] config - auth inline configuration set of options
     */
    function ShadowDom(config) {
        var _this = this;
        var _config = config || {};
        var globalConfig = this.options.plugins && this.options.plugins.shadowDom ? this.options.plugins.shadowDom : {};

        this.conf = $.extend(true, {},
            defaults,
            _config.options,
            globalConfig
        );

        $(function() {
            _this.init();
        });
    }

    ShadowDom.prototype = Module.createInstance();
    ShadowDom.prototype.constructor = ShadowDom;

    ShadowDom.prototype.init = function(){
        var examples = Array.prototype.slice.call(document.querySelectorAll('.source_example'));

        examples.forEach(function(item){
            var tpl = item.querySelector('.sourcejs_shadow-dom_tpl');

            if (!tpl) return;

            var shadow = item.createShadowRoot();
            var holder = document.createElement('html');
            holder.innerHTML = tpl.innerHTML;

            shadow.appendChild(document.importNode(holder, true));
        });
    };

    return new ShadowDom();
});