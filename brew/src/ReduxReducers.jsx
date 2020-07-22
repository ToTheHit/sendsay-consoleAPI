export function dropdownData(state = {
  isOpen: false,
  x: 0,
  y: 0,
  action: '',
  content: '',
}, action) {
  switch (action.type) {
    case 'TOGGLE_DROPDOWN': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export function copiedAction(state = {
  id: '',
}, action) {
  switch (action.type) {
    case 'COPY_ACTION':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export function execAction(state = {
  action: '',
}, action) {
  switch (action.type) {
    case 'EXEC_ACTION': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export function setAction(state = {
  action: '',
}, action) {
  switch (action.type) {
    case 'SET_ACTION': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export function userInfo(state = {
  login: '',
  sublogin: '',
  actions: [],
  isUpdatedFromServer: false,
}, action) {
  switch (action.type) {
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export function sendsayBridge(state = {
  sendsay: null,
}, action) {
  switch (action.type) {
    case 'UPDATE_SENDSAYBRIDGE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
