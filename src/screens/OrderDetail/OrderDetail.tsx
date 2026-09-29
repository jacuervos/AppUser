import React, {ReactElement, useEffect, useState} from 'react';
import {NativeModules, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import {OrderTypeWaste} from '../../types/order.types';
import orderDetailStyles from './styles';

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return 'Sin fecha';
  }
  const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const statusColor = (name?: string, apiColor?: string) => {
  if (apiColor) {
    return apiColor;
  }
  const value = (name ?? '').toLowerCase();
  if (value.includes('complet') || value.includes('finaliz')) {
    return colors.primary;
  }
  if (value.includes('pendi') || value.includes('asignad') || value.includes('inici')) {
    return '#FFA500';
  }
  if (value.includes('cancel')) {
    return colors.error;
  }
  return colors.gray;
};

const materialName = (item: OrderTypeWaste) =>
  item.type_waste_name || item.name || item.type_waste || 'Material';

const OrderDetail = (): ReactElement => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const {order} = route.params;
  const {GeocoderModule} = NativeModules;
  const [address, setAddress] = useState(order.address || 'Buscando dirección...');

  const materials = (order.items?.length ? order.items : order.type_waste) ?? [];
  const totalWeight = materials.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  const totalPoints = materials.reduce((sum, item) => sum + (Number(item.points) || 0), 0);
  const collectorName = order.collector?.name ?? order.collector?.id;
  const stateName = order.state?.name || order.status || 'Desconocido';

  useEffect(() => {
    let cancelled = false;

    const loadAddress = async () => {
      const latitude = order?.latitude;
      const longitude = order?.longitude;

      if (latitude == null || longitude == null) {
        setAddress(order.address || 'Dirección no disponible');
        return;
      }

      try {
        const response = await GeocoderModule.getAddress(
          parseFloat(latitude),
          parseFloat(longitude),
        );
        if (!cancelled) {
          setAddress(response.addressLine || order.address || 'Dirección no disponible');
        }
      } catch (error) {
        if (!cancelled) {
          setAddress(order.address || 'Dirección no disponible');
        }
      }
    };

    loadAddress();

    return () => {
      cancelled = true;
    };
  }, [order, GeocoderModule]);

  return (
    <View style={orderDetailStyles.container}>
      <View style={orderDetailStyles.header}>
        <TouchableOpacity
          style={orderDetailStyles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.primary} />
        </TouchableOpacity>
        <Text style={orderDetailStyles.headerTitle}>Detalle</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={orderDetailStyles.content}>
        <View style={orderDetailStyles.hero}>
          <Text style={orderDetailStyles.orderId}>Orden {order.id}</Text>
          <View style={orderDetailStyles.heroRow}>
            <View
              style={[
                orderDetailStyles.statusBadge,
                {backgroundColor: statusColor(stateName, order.state?.color)},
              ]}>
              <Text style={orderDetailStyles.statusText}>{stateName.toUpperCase()}</Text>
            </View>
            <Text style={orderDetailStyles.dateText}>{formatDate(order.date)}</Text>
          </View>
        </View>

        <View style={orderDetailStyles.section}>
          <Text style={orderDetailStyles.sectionTitle}>Recogida</Text>
          <View style={orderDetailStyles.row}>
            <Icon
              name="map-marker-alt"
              size={14}
              color={colors.primary}
              style={orderDetailStyles.rowIcon}
            />
            <Text style={orderDetailStyles.rowText}>{address}</Text>
          </View>
        </View>

        <View style={orderDetailStyles.section}>
          <Text style={orderDetailStyles.sectionTitle}>Recolector</Text>
          {order.collector ? (
            <>
              <View style={orderDetailStyles.row}>
                <Icon
                  name="user"
                  size={14}
                  color={colors.primary}
                  style={orderDetailStyles.rowIcon}
                />
                <Text style={orderDetailStyles.rowText}>
                  {collectorName ?? 'Recolector asignado'}
                </Text>
              </View>
            </>
          ) : (
            <Text style={orderDetailStyles.muted}>Sin recolector asignado</Text>
          )}
        </View>

        <View style={orderDetailStyles.section}>
          <Text style={orderDetailStyles.sectionTitle}>Materiales</Text>
          {materials.length === 0 ? (
            <Text style={orderDetailStyles.muted}>Sin materiales registrados</Text>
          ) : (
            materials.map(item => (
              <View key={item.id} style={orderDetailStyles.materialRow}>
                <Text style={orderDetailStyles.materialName}>{materialName(item)}</Text>
                <Text style={orderDetailStyles.materialMeta}>{item.weight} kg</Text>
                <Text style={orderDetailStyles.materialPoints}>{item.points} pts</Text>
              </View>
            ))
          )}
        </View>

        <View style={orderDetailStyles.summary}>
          <View style={orderDetailStyles.summaryItem}>
            <Text style={orderDetailStyles.summaryLabel}>Peso total</Text>
            <Text style={orderDetailStyles.summaryValue}>{totalWeight} kg</Text>
          </View>
          <View style={orderDetailStyles.summaryItem}>
            <Text style={orderDetailStyles.summaryLabel}>Puntos</Text>
            <Text style={orderDetailStyles.summaryValue}>{totalPoints}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;
