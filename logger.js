/*
*   Simple log functions
*/

function prettyDate2() {
    var date = new Date();
    var localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
}

function outln(prefix, str) {
    console.log("[" + prefix + "]" + "[" + prettyDate2() + "]" + str);
}

exports.info = function(str) {
    outln("info", str);
}

exports.debug = function(str) {
    outln("debug", str);
}

exports.error = function(str) {
    outln("error", str);
}

exports.warn = function(str) {
    outln("error", str);
}