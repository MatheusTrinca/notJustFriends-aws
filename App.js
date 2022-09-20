import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsconfig from './src/aws-exports';
import UserContextProvider from './src/context/UserContext';

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } });

const App = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(setAuthUser);
  }, []);

  console.log(authUser);

  return (
    <SafeAreaProvider>
      <UserContextProvider>
        <NavigationContainer style={styles.container}>
          <Navigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserContextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withAuthenticator(App);

// 2:48:10
