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
  