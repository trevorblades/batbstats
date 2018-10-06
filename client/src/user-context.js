import React from 'react';

export const {Provider, Consumer} = React.createContext();
export function withUser(Component) {
  return function UserComponent(props) {
    return <Consumer>{user => <Component {...props} {...user} />}</Consumer>;
  };
}
