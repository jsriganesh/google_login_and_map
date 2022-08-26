import React, {useEffect} from 'react';
import {
  NavigationContainer,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {screenName} from './src/utils/screenName';
import LoginScreen from './src/pages/loginScreen';
import HomeScreen from './src/pages/homeScreen';
import GoogleMapScreen from './src/pages/googleMapScreen';

const Stack = createNativeStackNavigator();

type HomeNavigationProps = {};
const HomeNavigation = (props: HomeNavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      // initialRouteName={props.initialRouteName}
      >
      <Stack.Screen name={screenName.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={screenName.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={screenName.GoogleMapScreen} component={GoogleMapScreen} />
      
    </Stack.Navigator>
  );
};

type RootNavigationProps = {
};

const RootNavigation = (props: RootNavigationProps) => {

  return (
    <NavigationContainer >
      <HomeNavigation />
    </NavigationContainer>
  );
};

// export default RootNavigation;
export default RootNavigation;
