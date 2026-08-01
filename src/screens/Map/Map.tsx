import React, { ReactElement, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet, Alert,
} from 'react-native';
import * as MapLibreRN from '@maplibre/maplibre-react-native';
const { MapView, Camera } = MapLibreRN;
import { Header } from '../../components/header/Header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, shadows } from '../../utils/constants';
import {getCurrentLocation} from "../../functions/Geolocation.tsx";
import {CircleLayer, ShapeSource} from "@maplibre/maplibre-react-native";
import useOrderStore from "../../store/orderStore.ts";

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

type RootStackParamList = {
  Account: undefined;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  collectorMarker: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  pickupMarker: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  pickupMarkerCompleted: {
    backgroundColor: colors.success || '#4CAF50',
  },
  markerIcon: {
    color: colors.white,
    fontSize: 14,
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    maxHeight: '35%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.lg,
  },
  listHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pointItem: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    ...shadows.sm,
  },
  pointItemCompleted: {
    borderLeftColor: colors.success || '#4CAF50',
    opacity: 0.6,
  },
  pointItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
    marginBottom: 4,
  },
  pointItemAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fontFamily.fontFamilyRegular,
    marginBottom: 4,
  },
  pointItemUser: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fontFamily.fontFamilySemiBold,
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  completeButtonText: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilySemiBold,
    fontSize: 12,
  },
  completedBadge: {
    backgroundColor: colors.success || '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  completedBadgeText: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilySemiBold,
    fontSize: 11,
  },
  floatingButton: {
    position: 'absolute',
    top: 80,
    right: 15,
    backgroundColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontFamily: fontFamily.fontFamilySemiBold,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilySemiBold,
    fontSize: 14,
  },
  statsContainer: {
    position: 'absolute',
    top: 80,
    left: 15,
    right: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    ...shadows.md,
    maxWidth: 160,
  },
  statItem: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fontFamily.fontFamilyRegular,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
    marginTop: 2,
  },
  detailsModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    flex: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 12,
  },
  detailsContent: {
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fontFamily.fontFamilyRegular,
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
  },
});

/**
 * @component MapScreen
 * HU-18: Visualización de recolector en el map
 * @return {ReactElement} - React component
 */
export const MapScreen = (): ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapViewRef = useRef(null);
  const [cameraConfig, setCameraConfig] = useState({
    centerCoordinate: [-74.0721, 4.7110], // [longitude, latitude]
    zoomLevel: 14,
    animationDuration: 1000,
  });

  const {orderViewMap} = useOrderStore();

  const [location, setLocation] = useState<LocationCoords | null>(null);

  useEffect(() => {
    const requestLocation = async () => {
      const currentLocation = await getCurrentLocation();

      if (currentLocation) {
        setLocation(currentLocation);
        setCameraConfig({
          centerCoordinate: [currentLocation.longitude, currentLocation.latitude], // [longitude, latitude]
          zoomLevel: 14,
          animationDuration: 1000,
        })
      } else {
        Alert.alert(
            'Permiso requerido',
            'Necesitamos acceso a tu ubicación para continuar.',
        );
      }
    };

    requestLocation();
  }, []);

  return (
      <View style={styles.container}>
        <Header action={() => navigation.navigate('Account')} goBack={() => navigation.goBack()} />

        <MapView
            ref={mapViewRef}
            style={styles.map}
            mapStyle={MAP_STYLE_URL}
        >
          <Camera
              centerCoordinate={cameraConfig.centerCoordinate}
              zoomLevel={cameraConfig.zoomLevel}
          />

          {/* Capa del marcador de mi ubicación */}
          {location && (
              <ShapeSource
                  id="collector-source"
                  shape={{
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        id: 'collector',
                        properties: { title: 'Tu ubicación' },
                        geometry: {
                          type: 'Point',
                          coordinates: [location.longitude, location.latitude],
                        },
                      },
                    ],
                  }}
              >
                <CircleLayer
                    id="collector-layer"
                    style={{
                      circleRadius: 22,
                      circleColor: colors.primary,
                      circleOpacity: 1,
                      circleStrokeWidth: 3,
                      circleStrokeColor: colors.white,
                    }}
                />
              </ShapeSource>
          )}

          {/* Capa de marcadores de recolector */}
          {orderViewMap?.collector?.location && (
              <ShapeSource
                  id="pickup-points-source"
                  shape={{
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: {
                          address: orderViewMap.address,
                          order_id:   orderViewMap.id,
                          completed: false,
                        },
                        geometry: {
                          type: 'Point',
                          coordinates: [
                            parseFloat(orderViewMap.collector.location.longitude),
                            parseFloat(orderViewMap.collector.location.latitude),
                          ],
                        },
                      },
                    ]
                  }}
              >
                <CircleLayer
                    id="pickup-completed-layer"
                    filter={['==', ['get', 'completed'], true]}
                    style={{
                      circleRadius: 17,
                      circleColor: colors.warning,
                      circleOpacity: 0.8,
                    }}
                />
                <CircleLayer
                    id="pickup-pending-layer"
                    filter={['==', ['get', 'completed'], false]}
                    style={{
                      circleRadius: 17,
                      circleColor: colors.warning,
                      circleOpacity: 0.8,
                    }}
                />
              </ShapeSource>
          )}

        </MapView>

      </View>
  );
};
