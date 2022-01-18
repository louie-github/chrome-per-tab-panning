<center>
  <h1 align="center">Per-tab Panning</h1>
  <h3 align="center">A simple Chrome extension to pan individual tabs left and right.</h3>
</center><br>

* Click on the extension icon and drag the slider to adjust the panning
  of the active tab.
* [functionality to be implemented]
* The current panning setting is displayed as a badge next to the icon.

# Credits
Thanks to [piousdeer](https://github.com/piousdeer/chrome-volume-manager)
for nearly all of the actual extension code written in this repository.
Only minor changes have been made.

This extension includes some icons from Google's
[Material Design Icons](https://github.com/google/material-design-icons),
licensed under the [Apache License 2.0](static/icons/Material_Icons.LICENSE),
and some icons from the [Ionicons](https://ionic.io/ionicons) icon set,
licensed under the [MIT License](static/icons/Ionicons.LICENSE)

The [extension logo](static/icons/logo_512.png) is a derivative work of
some Ionicons icons, and is also licensed under the same
[MIT License](static/icons/logo.LICENSE).

# Usage
This extension is not published in the Chrome Web Store as it is in
development and is mainly an **academic exercise**; you have to build
it yourself.

## Steps:
1. Clone this repository by running `git clone https://github.com/louie-github/chrome-per-tab-panning.git`
2. Run `yarn install && yarn run build`
3. Go to `chrome://extensions/`, enable Developer Mode, click on
   "Load unpacked", and select the `dist` folder.
