export enum appModes {
  MODE_LOADING = 'LOADING',
  MODE_ERROR = 'ERROR',
  MODE_LIST_OF_LISTS = 'LIST_OF_LISTS',
  MODE_A_LIST = 'A_LIST',
  MODE_MOVE = 'MOVE',
  DATA_CONFLICT = 'DATA_CONFLICT',
}

export const restrictions = {
  maxTaskLength: 180,
  collectDaysBefore: 7,
};

export const statusMessages = {
  msgHello: 'Hello!',
  msgPlanAWeek: 'Planing a week ...',
  msgChecking: 'Checking ...',
  msgAdding: 'Adding ...',
  msgSaved: 'Saved.',
  msgMoved: 'Item moved.',
  msgCopied: 'Item copied.',
  msgExported: 'List exported.',
  msgImported: 'List imported.',
  msgAddedAndRefreshed: 'Item added and list refreshed.',
  msgDataConflict: 'Data conflict.',
  msgLoadingLists: 'Loading lists ...',
  msgLoadingAList: 'Loading a list ...',
  msgListsLoaded: 'Lists loaded.',
  msgTodaysLoaded: 'Today\'s list loaded.',
  msgLoaded: ' loaded.',
  msgCreatingAList: 'Creating a list: ',
  msgDeletingAList: 'Deleting a list ...',
  msgListDeleted: 'List removed.',
  msgWeekPlanned: 'A week ahead added.',
};

export const secsPerDay = 864e5;
