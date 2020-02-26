// Actions
export function setLogin(userInfo) {
  return {
    type: 'SET_LOGIN',
    userInfo,
  };
}

export function setLogout() {
  return {
    type: 'SET_LOGOUT',
  };
}

export function setRegistered(userInfo) {
  return {
    type: 'SET_REGISTERED',
    userInfo,
  };
}

export function updateUserInfo(userInfo) {
  return {
    type: 'UPDATE_USER_INFO',
    userInfo,
  };
}

//Reducer
let initialState = {
  loggedIn: false,
  registered: false,
  userInfo: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOGIN':
      return Object.assign({}, state, {
        loggedIn: true,
        userInfo: action.userInfo,
      });
    case 'SET_REGISTERED':
      return Object.assign({}, state, {
        registered: true,
      });
    case 'SET_LOGOUT':
      return Object.assign({}, state, {
        userInfo: null,
        loggedIn: false,
      });
    case 'UPDATE_USER_INFO':
      return Object.assign({}, state, {
        userInfo: action.userInfo,
      });
    default:
      return state;
  }
}
