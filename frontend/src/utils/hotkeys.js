import $ from 'jquery';

export function registerHotKeys() {
    // console.log("hotkeys ENabled");
    $(document).on("keypress", (e) => this.checkKeyPressed(e));
}

export function disableHotKeys() {
    // console.log("hotkeys disabled");
    $(document).off("keypress");
}

export function playSound() {
    let sound = document.getElementById('clickSound');
    sound.play()
}