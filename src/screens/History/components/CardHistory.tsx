import {View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import React, {ReactElement, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CardHistoryStyles from './styles';
import {colors} from '../../../utils/constants';
import useOrderStore from '../../../store/orderStore';
import {OrderHistoryItem} from '../../../types/order.types';
import {RootStackParamList} from '../../../types/navigation';

/**
 * @component Card History
 * @return {ReactElement} - React component
 */
export const CardHistory = (): ReactElement => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { myOrders, loading, error, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getOrderStatusColor = (stateName: string) => {
    const name = stateName.toLowerCase();
    if (name.includes('complet') || name.includes('finaliz')) { return colors.primary; }
    if (name.includes('pendi') || name.includes('asignad') || name.includes('inici')) { return '#FFA500'; }
    if (name.includes('cancel')) { return colors.error; }
    return colors.gray;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderOrderCard = (order: OrderHistoryItem) => (
    <TouchableOpacity
      key={order.id}
      activeOpacity={0.7}
      style={CardHistoryStyles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', {order})}>
      <Image
          source={require('../../../../assets/images/recogida.png')}
          style={CardHistoryStyles.image}

      />
      <View style={CardHistoryStyles.orderContent}>
        <Text style={CardHistoryStyles.orderFecha}>
          {formatDate(order.date)}
        </Text>
        <Text style={CardHistoryStyles.orderNombre}>
          {order.type_waste?.map(w => w?.name).filter(Boolean).join(', ') || 'Sin materiales'}
        </Text>
        <Text style={CardHistoryStyles.orderTelefono}>
          {order.collector
            ? `Recolector: ${order.collector.name ?? order.collector.id}`
            : 'Sin recolector asignado'}
        </Text>
        <View
          style={[
            CardHistoryStyles.orderEstado,
            {backgroundColor: getOrderStatusColor(order.state?.name ?? '')},
          ]}>
          <Text style={CardHistoryStyles.orderEstadoText}>
            {order.state?.name?.toUpperCase() ?? 'DESCONOCIDO'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderOrdersContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 40}} />;
    }
    if (error) {
      return (
        <Text style={{textAlign: 'center', marginTop: 40, color: colors.error}}>
          {error}
        </Text>
      );
    }
    if (myOrders.length === 0) {
      return (
        <Text style={{textAlign: 'center', marginTop: 40, color: colors.gray}}>
          No tienes órdenes registradas
        </Text>
      );
    }
    return myOrders.map(renderOrderCard);
  };

  return (
    <View style={CardHistoryStyles.container}>

      {/* Contenido de las pestañas */}
      <ScrollView
        style={CardHistoryStyles.content}
        showsVerticalScrollIndicator={false}>
        <View style={CardHistoryStyles.listContainer}>
          {renderOrdersContent()}
        </View>
      </ScrollView>
    </View>
  );
};


