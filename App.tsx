import React, { useEffect } from 'react';
import {Provider} from 'react-redux';
import RootNavigation from './navigations';
import store from './src/reudx/store/store';
import PushNotification from 'react-native-push-notification';

const App = () => {


  useEffect(()=>{
    createChannel()
  },[])

  const createChannel=()=>{
  PushNotification.createChannel(
    {
      channelId: "test-channel", 
      channelName: "My channel",
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    },
    (created:any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  }

  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

//make this component available to the app
export default App;
