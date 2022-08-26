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
import {
  ParamListBase,
  Route,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {screenName} from '../utils/screenName';
import store from '../reudx/store/store';
import Header from '../components/header';
import MapView, {Marker} from 'react-native-maps';
import {defaultLocation, googleMapApiKey} from '../utils/constant';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PushNotification from 'react-native-push-notification';

import {
  GeneralProps,
  RegionPropsTypes,
  RootStateProps,
} from '../utils/interface';
import {ActionTypes} from '../reudx/action/actionList';
import {connect} from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';

interface GoogleMapScreenProps extends GeneralProps {
  // navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string, {type: string}>;
  startPoint: RegionPropsTypes;
  endPoint: RegionPropsTypes;
}
// interface RegionPropsTypes {
//     latitude: number;
//     latitudeDelta?: number;
//     longitude: number;
//     longitudeDelta?: number;
//   }
const GoogleMapScreen: React.FC<GoogleMapScreenProps> = ({
  route,
  startPoint,
  endPoint,
}) => {
  const isFocused = useIsFocused();
  const currentType = route.params.type;
  const [regionValue, setRegionValue] =
    useState<RegionPropsTypes>(defaultLocation);

  const navigation = useNavigation();

  const onMapReady = () => {};

  useEffect(() => {
    getPermission();
  }, [isFocused]);

  useEffect(() => {
    const watchPosition = setInterval(() => {
      getPermission();
    }, 3000);

    return clearInterval(watchPosition);
  }, []);

  const getPermission = () => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      _getCurrentLocation();
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        _getCurrentLocation();
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const _getCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          console.log(JSON.stringify(position));
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegionValue(region);

          if (
            currentType === 'Direction' &&
            (distance(
              endPoint.latitude,
              endPoint.longitude,
              region.latitude,
              region.longitude,
            ) <= 0.01)
          ) {
            handleNotification();
          }
        },
        error => {},
        {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
      );
    } catch (e) {}
  };

  const handleNotification = () => {
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'Location Reached..',
      message: 'You Have successfully reached your destitation',
    });
  };

  const distance = (
    desLat: number,
    desLon: number,
    currentLat: number,
    currentLon: number,
    unit = 'K',
  ) => {
    var radlat1 = (Math.PI * desLat) / 180;
    var radlat2 = (Math.PI * currentLat) / 180;
    var theta = desLon - currentLon;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  };

  return (
    <View style={styles.container}>
      {regionValue.latitude && regionValue.longitude && (
        <MapView
          // mapType="satellite"
          style={{...styles.map}}
          region={regionValue}
          showsUserLocation={false}
          onPress={d => {
            console.log(d.nativeEvent.coordinate);

            if (currentType === 'SP') {
              store.dispatch({
                type: ActionTypes.SELECTED_START_POINT,
                payload: d.nativeEvent.coordinate,
              });
            } else if (currentType === 'EP') {
              store.dispatch({
                type: ActionTypes.SELECTED_END_POINT,
                payload: d.nativeEvent.coordinate,
              });
            }
          }}
          onMapReady={onMapReady}
          // onRegionChangeComplete={onRegionChange}
        >
          {regionValue?.latitude && regionValue?.longitude ? (
            <Marker
              onPress={() => {}}
              coordinate={{
                latitude: regionValue?.latitude,
                longitude: regionValue?.longitude,
              }}>
              <Image
                source={require('../../assets/images/livelocation.png')}
                style={styles.markerStyle}
              />
            </Marker>
          ) : null}

          {startPoint?.latitude && startPoint?.longitude ? (
            <Marker
              onPress={() => {}}
              coordinate={{
                latitude: startPoint?.latitude,
                longitude: startPoint?.longitude,
              }}>
              <Image
                source={require('../../assets/images/startPoint.png')}
                style={styles.markerStyle}
              />
            </Marker>
          ) : null}

          {endPoint?.latitude && endPoint?.longitude ? (
            <Marker
              onPress={() => {}}
              coordinate={{
                latitude: endPoint?.latitude,
                longitude: endPoint?.longitude,
              }}>
              <Image
                source={require('../../assets/images/endPoint.png')}
                style={styles.markerStyle}
              />
            </Marker>
          ) : null}

          {currentType === 'Direction' ? (
            <MapViewDirections
              destination={{
                latitude: endPoint.latitude,
                longitude: endPoint.longitude,
              }}
              origin={{
                latitude: startPoint.latitude,
                longitude: startPoint.longitude,
              }}
              apikey={googleMapApiKey}
              mode={'DRIVING'}
              optimizeWaypoints={true}
              strokeColor={'green'}
              strokeWidth={3}

              // onStart={(params) => { }}
              // onReady={result => { }}
              // onError={(errorMessage) => {  }}
            />
          ) : null}
        </MapView>
      )}
    </View>
  );
};

const mapStateToProps = (state: RootStateProps) => ({
  startPoint: state.selectedLatLongReducer.selectedStartPoint,
  endPoint: state.selectedLatLongReducer.selectedEndPoint,
});

export default connect(mapStateToProps)(GoogleMapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  markerStyle: {
    height: 40,
    width: 40,
  },
});

// function distance(lat1, lon1, lat2, lon2, unit) {
//   var radlat1 = Math.PI * lat1/180
//   var radlat2 = Math.PI * lat2/180
//   var theta = lon1-lon2
//   var radtheta = Math.PI * theta/180
//   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//   if (dist > 1) {
//     dist = 1;
//   }
//   dist = Math.acos(dist)
//   dist = dist * 180/Math.PI
//   dist = dist * 60 * 1.1515
//   if (unit=="K") { dist = dist * 1.609344 }
//   if (unit=="N") { dist = dist * 0.8684 }
//   return dist
// }

// /* console.log(distance(12.681228, 77.964348,12.681245, 77.964350,"K") <= 0.01) */  10 meter
// /* console.log(distance(12.681228, 77.964348,12.681233, 77.964367,"K") <= 0.1) */
// /* console.log(distance(12.681228, 77.964348,12.681313, 77.964364,"K") <= 0.1) */
// /* console.log(distance(12.681228, 77.964348,12.681411, 77.964505,"K") <= 0.1) */
// /* console.log(distance(12.681228, 77.964348,12.683056, 77.965878,"K") <= 0.1)  false */
