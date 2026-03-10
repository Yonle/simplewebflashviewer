/*
  https://codeberg.org/Yonle/simplewebflashviewer
  Copyright 2026 Yonle <yonle@proton.me>

  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
    "unmuteOverlay": "visible",

    "forceAlign": true,
    "forceScale": true,
    "scale": "showAll",
    "letterbox": "on",
    "splashScreen": false,
    "wmode": "direct",
}

const note = document.getElementById("note")
const enote = document.getElementById("extra_note")
const content = document.getElementById("content")

let loadingInt = null
let timeout = null

function stillLoadingNote() {
    enote.innerText = "Still loading?\nTry reload flash loader if persist."
}

function slowLoadingNote() {
    enote.innerText = "Slow loading? Check your internet\nand ensure WebAssembly is on"
    enote.style.visibility = "visible"

    timeout = setTimeout(stillLoadingNote, 20000)
}

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

    timeout = setTimeout(slowLoadingNote, 5000)
}

function stopLoading() {
    clearInterval(loadingInt)
    clearTimeout(timeout)
    note.style.visibility = "visible"
    note.style.color = "#a3a3a3"
    enote.style.visibility = "hidden"
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
