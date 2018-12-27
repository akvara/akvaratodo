import $ from 'jquery';

export const registerHotKeys = () => {
  // console.log("hotkeys ENabled");
  $(document).on('keypress', (e) => this.checkKeyPressed(e));
};

export const disableHotKeys = () => {
  // console.log("hotkeys disabled");
  $(document).off('keypress');
};

export const playSound = () => {
  let sound = document.getElementById('clickSound');
  sound.play();
};
