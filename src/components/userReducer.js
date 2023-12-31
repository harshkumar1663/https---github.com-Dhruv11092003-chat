const initialState = null;

export const setUser = (username) => {
  return {
    type: 'SET_USER',
    payload: username,
  };
};

export const clearUser = () => {
  return {
    type: 'CLEAR_USER',
  };
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

export default userReducer;
