var mazeWidth;
var mazeHeight;
var backgroundColorPosition = "rgb(240, 0, 0)";
var backgroundColorTrace;
var backgroundColorClear = "rgb(255, 255, 255)";
var backgroundColorRoute = "rgb(255, 255, 255)";
var backgroundColorExit = "rgb(0, 200, 0)";

var validExits;

var wallColor;
var startAtRow, startAtCol;
var currentCell;
var rowPosition, colPosition;
var blackTrace;
var demoMode;
var simpleMode;
var explorerMode;
// cursor keys and W - A - S - D
var cursorKeyCodes = [37, 38, 39, 40, 87, 65, 83, 68];

// stop watch
// thanks to https://medium.com/@olinations/an-accurate-vanilla-js-stopwatch-script-56ceb5c6f45b
var stopWatchActive;
var savedTime;
var difference;

var interval;

var remainingExits = [];

var shareUrl;
var twitterShareUrl = "https://twitter.com/intent/tweet?text=";
var telegramShareUrl = "https://telegram.me/share/url?url=<URL>&text=<TEXT>";


wallColor = "rgb(0,0,0)";