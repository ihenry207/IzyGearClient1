// mainly for transferring the firebase uid and trigger connect
import React from 'react';

const UserContext = React.createContext();

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;