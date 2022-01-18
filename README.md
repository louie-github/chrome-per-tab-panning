<center>
  <h1 align="center">Per-tab Panning</h1>
  <h3 align="center">A simple Chrome extension to pan individual tabs left and right.</h3>
</center><br>

* Click on the extension icon and drag the slider to adjust the panning
  of the active tab.
* Double-click on the slider to reset the panning value.
* Alternatively, you can also click the "X" button next to the slider.
  This also closes the tabCapture stream, removing the "This tab's
  content is being shared" indicator on the tab.
* The current panning setting is displayed as a badge next to the icon.
* Click "Randomize" to randomly select either full left, full right, or
  no panning. Try to guess which one is selected using the buttons on
  the right. Your score is displayed below.
* Click the "Reset" button next to the score display to reset your
  score.

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
