import $ from 'jquery';

export const registerHotKeys = (checkKeyPressed) => {
  $(document).on('keypress', (e) => checkKeyPressed(e));
};

export const disableHotKeys = () => {
  $(document).off('keypress');
};

export const playSound = () => {
  let sound = document.getElementById('clickSound') as HTMLAudioElement;
  sound.play();
};
