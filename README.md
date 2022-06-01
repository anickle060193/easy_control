# Easy Control
A browser extension that allows easy control of various media streaming websites.

Provides control of:
* [Pandora](http://www.pandora.com/)
* [Spotify](https://play.spotify.com/)
* [Youtube](https://www.youtube.com/)

Chrome Web Store: [Easy Control](https://chrome.google.com/webstore/detail/easy-control/oanebiaiakkpfipgnkpmcpkjfnclbgfi)

Firefox Add-Ons: [Easy Control](https://addons.mozilla.org/en-US/firefox/addon/easy-control/)


## Acknowledgments
* [MDN Browser Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
* [Chrome Extension Developer API](https://developer.chrome.com/extensions/api_index)
* [MUI](https://mui.com/)
* [kellub](https://github.com/kellub) and [lannick](https://github.com/lannick). Thanks guys!


## Building
Run `yarn install` to install dependencies.

### Development
Run `yarn run start` to start developmental build.

### Production
Run `yarn run build` to create production build.

## Releasing an Update
1. Update changelog.
1. Commit changelog updates.
1. Update version in package.json.
1. Run `yarn run package`.
1. Run `yarn run package:source`.
1. Upload extension for Firefox: [Firefox: Submit New Version](https://addons.mozilla.org/en-US/developers/addon/easy-control/versions/submit/).
1. Commit version changes.
1. Place version tag.
1. Push changes.
