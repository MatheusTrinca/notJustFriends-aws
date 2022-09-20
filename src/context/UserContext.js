import { Auth, DataStore } from 'aws-amplify';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../models';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [sub, setSub] = useState('');
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const dbUser = await DataStore.query(User, authUser.attributes.sub);
      setSub(authUser.attributes.sub);
      setUser(dbUser);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ sub, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export const useUserContext = useContext(UserContext);
