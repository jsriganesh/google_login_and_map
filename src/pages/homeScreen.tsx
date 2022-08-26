import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {screenName} from '../utils/screenName';
import store from '../reudx/store/store';
import Header from '../components/header';
import MapView from 'react-native-maps';
import {defaultLocation} from '../utils/constant';
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
import {
  GeneralProps,
  RegionPropsTypes,
  RootStateProps,
} from '../utils/interface';
import {requestUserPermission} from '../services/notificationService';
import PushNotification from 'react-native-push-notification';

interface HomeScreenProps extends GeneralProps {
  startPoint: RegionPropsTypes;
  endPoint: RegionPropsTypes;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  startPoint,
  endPoint,
  navigation,
}) => {
  // useEffect(() => {
  //   requestUserPermission();
  // }, []);

  const locationDetails = (
    label: string,
    callback: CallableFunction,
    location: RegionPropsTypes,
    type: string,
  ) => {
    return (
      <View style={{marginBottom: 20}}>
        <View style={styles.titleView}>
          {type === 'SP' ? (
            <Image
              source={require('../../assets/images/startPoint.png')}
              style={styles.markerStyle}
            />
          ) : (
            <Image
              source={require('../../assets/images/endPoint.png')}
              style={styles.markerStyle}
            />
          )}

          <Text style={styles.titleTextStyle}>{'Your ' + label}</Text>
        </View>

        <View style={styles.flexRow}>
          <Text>{'latitude :  '}</Text>
          <Text>{location?.latitude ? location.latitude : '-'}</Text>
        </View>

        <View style={styles.flexRow}>
          <Text>{'longitude :  '}</Text>
          <Text>{location?.longitude ? location.longitude : '-'}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            callback();
          }}>
          <Text style={styles.btnTextStyle}>
            {'Select '}
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const selectStartPoint = () => {
    navigation.navigate(screenName.GoogleMapScreen, {type: 'SP'});
  };

  const selectEndPoint = () => {
    navigation.navigate(screenName.GoogleMapScreen, {type: 'EP'});
  };

  const goToDirection = () => {
    navigation.navigate(screenName.GoogleMapScreen, {type: 'Direction'});
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.bodyContainer}>
        {locationDetails('start point', selectStartPoint, startPoint, 'SP')}
        {locationDetails('end point', selectEndPoint, endPoint, 'EP')}

        {startPoint?.latitude &&
        startPoint?.longitude &&
        endPoint?.latitude &&
        endPoint?.longitude ? (
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              goToDirection();
            }}>
            <Text style={styles.btnTextStyle}>{'Start Navigation'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const mapStateToProps = (state: RootStateProps) => ({
  userDetails: state.userDetailsReducer.userDetails,
  startPoint: state.selectedLatLongReducer.selectedStartPoint,
  endPoint: state.selectedLatLongReducer.selectedEndPoint,
});

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: '#000000',
    borderRadius: 6,
    height: 40,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  btnTextStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  flexRow: {
    flexDirection: 'row',
  },
  titleView: {
    marginBottom:5,
    flexDirection: 'row',
    alignItems:"flex-end"
  },
  markerStyle: {
    height: 40,
    width: 40,
  },
  titleTextStyle:{
    fontSize:18,
    fontWeight:"bold"
  }
});
