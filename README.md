# edp-build-url-embed

Embed URL's as base64 strings inside your stylesheets using edp build


## Install

```shell
npm install edp-build-url-embed --save-dev
```

## Usage

Add code in `edp-build-config.js`

```javascript
var UrlEmbededProcessor = require('edp-build-url-embed');
var urlEmbed = new UrlEmbededProcessor();
```


### Options

#### inclusive

Type: `Boolean`

Default: `false`

Specifies the mode of embedding.
* `true` (inclusive) means that you have to manually mark each URL that needs to be embedded using the `/* embed */` comment.
* `false` (exclusive) means that every URL is embedded, except those that are marked with `/* noembed */` comment.


### Excluding URLs manually (when inclusive: false)

```css
.exclude-me {
    background-image: url('exclude_me.png'); /* noembed */
}
```

### Including URLs manually (when inclusive: true)

```css
.include-me {
    background-image: url('include_me.png'); /* embed */
}
```

### When URLs are in the middle of CSS property

```css
.include-me1 {
    background: transparent url('include_me.png') /* embed */ center center no-repeat;
}

.include-me2 {
    background-image: -webkit-image-set(url('include_me1.png') /* embed */ 1x, url('include_me2.png') /* embed */ 2x);
}
```