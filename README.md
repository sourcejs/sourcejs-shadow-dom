# SourceJS Shadow DOM

Experimental implementation of Shadow DOM for spec examples in SourceJS.

Note: Currently optimized for Chrome browser only.

Compatible with [SourceJS](http://sourcejs.com) 0.5.5+.

## Install

To install middleware, run npm command in `sourcejs/user` folder:

```
npm install sourcejs-shadow-dom --save
```

After restarting SourceJS app, middleware will be loaded automatically. To disable it, remove npm module and restart the app.

## How it Works

The plugin consists out of midlleware (server-side) and client-side initialization plugin.

Using [cheerio](https://github.com/cheeriojs/cheerio) on server-side, module modifies `.source_example` sections, moving their content into `template` with linked CSS from the page. After processing all examples, server-side module removes global linked CSS and passes prepared templates on client-side, where Shadow DOM containers are created.

## TODO

* Fix HTML code source highlight
* Add Firefox Scoped CSS as Shadow DOM alternative
* Provide iFrame polyfill to unsupported browsers, with link to Clarify

Please contribute to add new features or share your feedback in issues section.

## More SourceJS Plugins

* https://github.com/sourcejs/sourcejs-jade
* https://github.com/sourcejs/sourcejs-smiles