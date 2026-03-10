## simplewebflashviewer

this is a simple flash viewer used for `<iframe>` in other site.

## using it

whatever is in `src/` is a static site, but you will need to download the [ruffle's web package](https://ruffle.rs/downloads#website-package), then extract the zip to `src/ruffle/`

to use it in your site, you use a iframe like this:
```html
<iframe
    src="src/"
    width="640"
    height="480"
    allow="fullscreen"
    style="border-color: transparent"
    sandbox="allow-scripts allow-modals allow-popups allow-downloads allow-same-origin"
/>
```

some of the restrictions has been set under `src/loader.js`, so several options on the iframe's `sandbox` attribute should be fine.

you can adjust the width and height to your liking.

say, you're serving this as a static site at `https://media.yourdomain.com/flashviewer/`

to load an swf, you need to invoke this in your javascript:
```js
<iframeDoc>.src = "https://media.yourdomain.com/flashviewer/index.html#" + swf_url
```

## csp

### root domain (the user/frontend)

you will need to ensure that your root domain that loads the iframe has a csp setting of `frame-src 'self' data: blob: https://media.yourdomain.com/flashviewer/ https://media.yourdomain.com/media/`, assuming that most of the flash are loaded from `https://media.yourdomain.com/media/`

### iframe domain (the simpleWebFlashViewer)

for the csp on the iframe at `https://media.yourdomain.com/flashviewer/`, because ruffle doesn't understand nonce yet, you will need to ensure that these are set:
- `script-src 'self' 'wasm-unsafe-eval'`
- `style-src 'self' 'unsafe-inline'`

you might want to also set this:
- `frame-ancestors 'self' https://yourdomain.com` assuming you're using this for `https://yourdomain.com` as the root domain.

## optimization

you need to also set the `cache-control` header to be this:
- `public, max-age=604800, immutable`

this ensures that browser do not reload ruffle runtime from server everytime & makes ruffle loading faster, because the ruffle wasm is sized around **13 MB**.
