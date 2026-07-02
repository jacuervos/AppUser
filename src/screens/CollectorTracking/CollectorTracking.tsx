import React, { ReactElement, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Header } from '../../components/header/Header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, shadows } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

interface CollectorLocation {
  id: number;
  latitude: number;
  longitude: number;
  updated_at: string;
}

interface Collector {
  id: number;
  name: string;
  location: CollectorLocation | null;
}

interface TrackingData {
  order_id: number;
  collector: Collector;
  pickup_location: {
    latitude: number;
    longitude: number;
  };
}

type RootStackParamList = {
  Home: undefined;
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  markerIcon: {
    color: colors.white,
    fontSize: 16,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    ...shadows.lg,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fontFamily.bold,
    color: colors.text,
    marginBottom: 8,
  },
  infoPanelSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    marginBottom: 4,
  },
  infoPanelValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fontFamily.semibold,
    color: colors.primary,
    marginBottom: 8,
  },
  lastUpdateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
    marginTop: 8,
    fontStyle: 'italic',
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
    fontFamily: fontFamily.semibold,
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
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
  refreshButton: {
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
});

/**
 * @component CollectorTracking
 * HU-18: Visualización del recolector en camino
 * @return {ReactElement} - React component
 */
export const CollectorTracking = (): ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapViewRef = useRef<MapView>(null);

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener la ubicación del recolector
  const fetchCollectorLocation = async () => {
    try {
      const response = await fetch('http://your-api-url/api/my-collector-location', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${/* get token from auth store */}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('No hay recolector asignado en este momento');
        } else {
          setError('Error al obtener la ubicación del recolector');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setTrackingData(data.data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(data.message || 'Error desconocido');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.');
      console.error('Error fetching collector location:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchCollectorLocation();
  }, []);

  // Poll para actualizaciones cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        fetchCollectorLocation();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshing]);

  // Animar el mapa para mostrar ambas ubicaciones
  useEffect(() => {
    if (trackingData && mapViewRef.current) {
      const collectorLocation = trackingData.collector.location;
      const userLocation = trackingData.pickup_location;

      if (collectorLocation) {
        mapViewRef.current.fitToCoordinates(
          [
            { latitude: collectorLocation.latitude, longitude: collectorLocation.longitude },
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
          ],
          {
            edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
            animated: true,
          }
        );
      }
    }
  }, [trackingData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCollectorLocation();
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.infoPanelSubtitle, { marginTop: 15 }]}>
          Cargando ubicación del recolector...
        </Text>
      </View>
    );
  }

  if (error || !trackingData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header action={() => navigation.navigate('Home')} />

      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: trackingData.pickup_location.latitude,
          longitude: trackingData.pickup_location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcador del usuario (punto de recogida) */}
        <Marker
          coordinate={{
            latitude: trackingData.pickup_location.latitude,
            longitude: trackingData.pickup_location.longitude,
          }}
          title="Tu Ubicación"
          description="Punto de recogida"
        >
          <View style={styles.markerContainer}>
            <View style={styles.userMarker}>
              <Icon name="location-dot" style={styles.markerIcon} />
            </View>
          </View>
        </Marker>

        {/* Marcador del recolector */}
        {trackingData.collector.location && (
          <Marker
            coordinate={{
              latitude: trackingData.collector.location.latitude,
              longitude: trackingData.collector.location.longitude,
            }}
            title="Recolector en camino"
            description={trackingData.collector.name}
          >
            <View style={styles.markerContainer}>
              <View style={styles.collectorMarker}>
                <Icon name="truck" style={styles.markerIcon} />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Botón de actualización */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Icon name="sync" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>

      {/* Panel de información */}
      {trackingData && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>
            {trackingData.collector.name}
          </Text>
          <Text style={styles.infoPanelSubtitle}>Recolector asignado</Text>

          {trackingData.collector.location ? (
            <>
              <Text style={styles.infoPanelValue}>
                📍 En camino hacia tu ubicación
              </Text>
              <Text style={styles.infoPanelSubtitle}>
                Orden #{trackingData.order_id}
              </Text>
              <Text style={styles.lastUpdateText}>
                Última actualización: {formatTime(lastUpdate)}
              </Text>
            </>
          ) : (
            <Text style={styles.infoPanelSubtitle}>
              Ubicación no disponible
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
