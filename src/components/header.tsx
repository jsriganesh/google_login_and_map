import * as React from 'react';
import {Text, View, StyleSheet, Image, Touchable, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {logoutIcon} from '../utils/constant';
import {RootStateProps, UserDetailsProps} from '../utils/interface';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../utils/screenName';

interface HeaderProps {
  userDetails: UserDetailsProps;
}

const Header: React.FC<HeaderProps> = ({userDetails}) => {
  const navigation = useNavigation()

  async function signOut() {
    try {
      await GoogleSignin.signOut().then(() => {
        console.log('sign out successfully');
        navigation.navigate(screenName.LoginScreen as never)
      });
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{signOut()}}>
      <Image source={{uri: logoutIcon}} style={styles.imageStyle} />
      </TouchableOpacity>
      {
        userDetails?.photoURL || userDetails?.photo ?
        <Image source={{uri: userDetails.photoURL ? userDetails.photoURL : userDetails.photo}} style={styles.imageStyle} />
        : null
      }
      
    </View>
  );
};

const mapStateToProps = (state: RootStateProps) => ({
  userDetails: state.userDetailsReducer.userDetails,
});

export default connect(mapStateToProps)(Header);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#888888',
    borderBottomWidth: 0.5,
    padding: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  imageStyle: {
    borderRadius: 30,
    height: 35,
    width: 35,
  },
});
