const rufflePlayerConfig = {
    "publicPath": undefined,
    "polyfills": false, // we're an loader. there's no need to polyfill
    "favorFlash": false, // notorious for severe volume of vulnerability.

    // security
    "allowScriptAccess": false,
    "openUrlMode": "confirm",

    "autoplay": "on",
    "logLevel": "error",

    // misc
    "menu": true,
    "contextMenu": "on",
    "allowFullscreen": true,
    "showSwfDownload": true,
    "warnOnUnsupportedContent": true,
    "contextMenu": "on",
   
    "scale": "showAll",
    "letterbox": "on",
    "splashScreen": false,
}

const note = document.getElementById("note")
const content = document.getElementById("content")

let loadingInt = null

function loadingBlink() {
    note.innerText = "Now loading..."
    let visibility = "visible"
    
    note.style.visibility = visibility
    note.style.color = "#ffffff"
    loadingInt = setInterval(() => {
        switch (visibility) {
            case "visible":
                visibility = "hidden"
                break;
            case "hidden":
                visibility = "visible"
                break;
        }

        note.style.visibility = visibility
    }, 170)
}

function stopLoading() {
    clearInterval(loadingInt)
    note.style.visibility = "visible"
    note.style.color = "#a3a3a3"
}

loadingBlink()

window.addEventListener("load", async (event) => {
    stopLoading()
    const q = location.hash

    if (q.length < 2) {
        note.innerText = "fail: no swf source provided"
        return
    }

    if (typeof(window.RufflePlayer) !== "object") {
        note.innerText = "fail: ruffle is not loaded"
        return
    }

    const ruffle = window.RufflePlayer.newest()
    const player = ruffle.createPlayer()
    const pr = player.ruffle()

    content.appendChild(player)

    try {
        loadingBlink()
        await pr.load({
            url: q.slice(1),
            ...rufflePlayerConfig
        });
        content.style.visibility = "visible"
    } catch (err) {
        note.innerText = `failed to load: ${err.toString()}`
        console.error(err)
    }

    stopLoading()
});