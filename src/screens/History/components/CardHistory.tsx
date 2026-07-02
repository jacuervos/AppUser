import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import React, {ReactElement, useEffect, useState} from 'react';
import CardHistoryStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../../../utils/constants';
import useOrderStore from '../../../store/orderStore';
import {OrderHistoryItem} from '../../../types/order.types';

// Tipos de datos
interface IncentiveItem {
  id: string;
  fecha: string;
  estado: 'activo' | 'usado' | 'expirado';
  imagen?: string;
}

// Datos de ejemplo para incentivos (hasta tener API propia)
const mockIncentives: IncentiveItem[] = [
  {
    id: '1',
    fecha: '2024-02-14',
    estado: 'activo',
  },
  {
    id: '2',
    fecha: '2024-02-10',
    estado: 'usado',
  },
  {
    id: '3',
    fecha: '2024-02-05',
    estado: 'expirado',
  },
];

/**
 * @component Card History
 * @return {ReactElement} - React component
 */
export const CardHistory = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<'ordenes' | 'incentivos'>('ordenes');
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

  const getIncentiveStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return colors.primary;
      case 'usado':
        return '#808080';
      case 'expirado':
        return colors.error;
      default:
        return colors.gray;
    }
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
    <View key={order.id} style={CardHistoryStyles.orderCard}>
      <View style={CardHistoryStyles.orderImageContainer}>
        <Icon name="shopping-cart" size={30} color={colors.primary} />
      </View>

      <View style={CardHistoryStyles.orderContent}>
        <Text style={CardHistoryStyles.orderFecha}>
          {formatDate(order.date)}
        </Text>
        <Text style={CardHistoryStyles.orderNombre}>
          {order.type_waste?.map(w => w.type_waste).filter(Boolean).join(', ') || 'Sin materiales'}
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
    </View>
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
      {/* Pestañas */}
      <View style={CardHistoryStyles.tabsContainer}>
        <TouchableOpacity
          style={[
            CardHistoryStyles.tab,
            activeTab === 'ordenes' && CardHistoryStyles.activeTab,
          ]}
          onPress={() => setActiveTab('ordenes')}>
          <Text
            style={[
              CardHistoryStyles.tabText,
              activeTab === 'ordenes' && CardHistoryStyles.activeTabText,
            ]}>
            Órdenes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            CardHistoryStyles.tab,
            activeTab === 'incentivos' && CardHistoryStyles.activeTab,
          ]}
          onPress={() => setActiveTab('incentivos')}>
          <Text
            style={[
              CardHistoryStyles.tabText,
              activeTab === 'incentivos' && CardHistoryStyles.activeTabText,
            ]}>
            Incentivos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de las pestañas */}
      <ScrollView
        style={CardHistoryStyles.content}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'ordenes' ? (
          <View style={CardHistoryStyles.listContainer}>
            {renderOrdersContent()}
          </View>
        ) : (
          // Lista de incentivos
          <View style={CardHistoryStyles.listContainer}>
            {mockIncentives.map(incentive => (
              <View key={incentive.id} style={CardHistoryStyles.incentiveCard}>
                <View style={CardHistoryStyles.incentiveImageContainer}>
                  <Icon name="gift" size={30} color={colors.primary} />
                </View>

                <View style={CardHistoryStyles.incentiveContent}>
                  <Text style={CardHistoryStyles.incentiveFecha}>
                    {formatDate(incentive.fecha)}
                  </Text>
                  <View
                    style={[
                      CardHistoryStyles.incentiveEstado,
                      {backgroundColor: getIncentiveStatusColor(incentive.estado)},
                    ]}>
                    <Text style={CardHistoryStyles.incentiveEstadoText}>
                      {incentive.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};


