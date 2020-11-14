export const settings = {
  addNewAt: { explain: 'Add new item at position', handler: 'numeric', default: 5, min: 1, max: 10 },
  displayListLength: {
    explain: 'Display number of tasks at once',
    default: 17,
    handler: 'numeric',
    min: 1,
    max: 50,
  },
  displayLast: { explain: 'Display number of tasks at bottom', default: 3, handler: 'numeric', min: 1, max: 50 },
  displayDoneLength: { explain: 'Display number of done tasks', default: 3, handler: 'numeric', min: 1, max: 50 },
  openListIfExists: { explain: 'Load this list on start', handler: 'selector', field: '' },
};
