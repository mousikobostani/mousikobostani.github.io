
function reload(id) {
    const iframe = document.getElementById(id);
    iframe.contentWindow.location.reload();
}
/*
function resize(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
    iframe.contentWindow.addEventListener('resize', () => {
        iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
    });
}
*/
function fullscreen(id) {
    const element = document.getElementById(id);
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

/*
(document.querySelectorAll('a.controls').forEach(i => {
    i.addEventListener('click', (e) => e.preventDefault());
}))();
*/
