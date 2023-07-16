export function tableReducer(state, action) {
  switch (action.type) {
    case "updateTableState":
      return action.payload;
    default:
      return state;
  }
}