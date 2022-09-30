export const exitBtn = {
  classes: 'shepherd-button-secondary',
  text: 'Exit',
  type: 'cancel',
};

export const backBtn = {
  classes: 'shepherd-button-primary',
  text: 'Back',
  type: 'back',
};

export const nextBtn = {
  classes: 'shepherd-button-primary',
  text: 'Next',
  type: 'next',
};

export const doneBtn = {
  classes: 'shepherd-button-secondary',
  text: 'Done',
  type: 'complete',
};

export const firstStepBtns = [exitBtn, nextBtn];

export const basicStepBtns = [exitBtn, backBtn, nextBtn];

export const lastStepBtns = [backBtn, doneBtn];
