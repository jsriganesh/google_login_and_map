import { ParamListBase, Route } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type GeneralProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: Route<string, object | undefined>;
};




export interface UserDetailsProps {
  displayName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: number;
  photoURL: string;
  providerId: string;
  uid: string;
  photo?:string
}

export type  RegionPropsTypes = {
  latitude: number;
  latitudeDelta?: number;
  longitude: number;
  longitudeDelta?: number;
}


export type UserDetailsReducerProps = {
    userDetails: UserDetailsProps;
  };

  export type SelectedLatLongReducer = {
    // userDetails: UserDetailsProps;
    selectedStartPoint:RegionPropsTypes ,
  selectedEndPoint: RegionPropsTypes,
  };




export type RootStateProps = {
    userDetailsReducer: UserDetailsReducerProps;
    selectedLatLongReducer: SelectedLatLongReducer;
  };