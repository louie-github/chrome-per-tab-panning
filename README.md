<div align="center">
  <h1>Per-tab Panning</h1>
  <h3>A simple Chrome extension to pan individual tabs left and right.</h3>
  <img src="sample.png" alt="Sample screenshot">
</div>
<br>

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
* Click the "Export current session" button to export your session data
  (what you answered as guesses while randomizing) as a JSON file.

# Notes
Because we need to capture tab audio to pan it left and right, Chrome
treats your tab as if it was being "shared" in some way, as in being
shared in Google Meet or similar videoconferencing applications.

This has the side effect of making full-screen not take up the whole
display, but rather, just the entire tab area, excluding the address
bar and anything above that.

To stop this behavior, reset the panning value by pressing the "X"
button next to the slider. This closes the tab capture stream which
brings back the proper full-screen behavior.

Any help is appreciated to fix this issue!

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
development and is mainly an **academic exercise**. It is preferred to
build the extension yourself.

## Steps:
1. Clone this repository by running `git clone https://github.com/louie-github/chrome-per-tab-panning.git`
2. Run `yarn install && yarn run build`
3. Go to `chrome://extensions/`, enable Developer Mode, click on
   "Load unpacked", and select the `dist` folder.


Alternatively, you can download a built version from the
[Releases](https://github.com/louie-github/chrome-per-tab-panning/releases)
page. Download the ZIP file, extract the "per-tab-panning" folder, and
load that folder as an unpacked extension as described above in Step 3.