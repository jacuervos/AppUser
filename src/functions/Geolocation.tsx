import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

export const getCurrentLocation = (): Promise<LocationCoords | null> => {
    return new Promise(async resolve => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(null);
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                error => {
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                },
            );
        } catch (error) {
            resolve(null);
        }
    });
};