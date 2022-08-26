import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import store from '../reudx/store/store';

interface LoginScreenProps {}
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {screenName} from '../utils/screenName';
import {ActionTypes} from '../reudx/action/actionList';
import {webClientId} from '../utils/constant';

GoogleSignin.configure({
  webClientId: webClientId,
});

const LoginScreen = (props: LoginScreenProps) => {
  const navigation = useNavigation();

  const checkIsLogin = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      storeUserDetails(currentUser);
    } catch (error) {
      console.log('some thing went wrong');
    }
  };

  useEffect(() => {
    checkIsLogin();
  }, []);

  async function signInWithGoogle() {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userDetails = await auth().signInWithCredential(googleCredential);

    storeUserDetails(userDetails);
  }

  const storeUserDetails = (userDetails: any) => {
    if (userDetails?.user) {
      store.dispatch({
        type: ActionTypes.USER_DETAILS,
        payload: userDetails.user,
      });
      navigation.navigate(screenName.HomeScreen as never);
    } else {
      console.log('some thing went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text>App</Text>

      <TouchableOpacity
        onPress={() => {
          signInWithGoogle();
        }}>
        <Text>{'Sign in '}</Text>
      </TouchableOpacity>

      <GoogleSigninButton
        style={styles.googleButtonStyle}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signInWithGoogle()}
        disabled={false}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {},
  googleButtonStyle: {
    width: 192,
    height: 48,
  },
});
