export const createReducer = (initialState: any, handlers: any) => (state: any, actionC: any) => {
  if (state === void 0) {
    state = initialState;
  }
  if (Object.prototype.hasOwnProperty.call(handlers, actionC.type)) {
    return handlers[actionC.type](state, actionC);
  }
  return state;
};
