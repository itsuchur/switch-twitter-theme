# Switch White/Dark Twitter

## Description

Switch White/Dark Twitter is a Firefox extension that automatically changes the layout of Twitter depending on your current Windows theme. This means that when you switch to a dark Windows theme, the Twitter layout will automatically switch to a dark mode as well, and vice versa for a light theme.

## Installation

To install the extension, follow these steps:

1. Open Firefox and go to https://addons.mozilla.org/en-US/firefox/addon/switch-white-dark-twitter/
2. Click on the "Add to Firefox" button
3. When prompted, click "Add" to confirm the installation

Once installed, the extension will automatically start working, changing the layout of Twitter depending on your current Windows theme.

## Usage

Once installed, the extension will automatically change the layout of Twitter depending on your current Windows theme. There are no additional steps required to use it.

## Support

If you have any questions or issues with the extension, please [open an issue](https://github.com/itsuchur/switch-twitter-theme/issues).

## Development

The extension supports both `twitter.com` and `x.com` and follows the system color preference reported by Firefox. Pages refresh when the preference changes, or on the first visit if the saved theme differs. Cookies must be enabled for the site.

Run regression tests with Node.js 18 or newer using `node --test`.

For a manual check, open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `manifest.json`. Visit X, change the system color preference, and verify that the page refreshes once and adopts the corresponding theme. Also check a nested route and a fresh profile without a `night_mode` cookie.
