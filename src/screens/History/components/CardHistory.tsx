/*!
 * Copyright (c) Laika LLC. All rights reserved.
 */

import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React, {ReactElement, useState} from 'react';
import CardHistoryStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors, fontFamily} from '../../../utils/constants';

// Tipos de datos
interface OrderItem {
  id: string;
  fecha: string;
  nombre: string;
  telefono: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  imagen?: string;
}

interface IncentiveItem {
  id: string;
  fecha: string;
  estado: 'activo' | 'usado' | 'expirado';
  imagen?: string;
}

// Datos de ejemplo
const mockOrders: OrderItem[] = [
  {
    id: '1',
    fecha: '2024-02-14',
    nombre: 'Juan Pérez',
    telefono: '+57 300 123 4567',
    estado: 'completada',
  },
  {
    id: '2',
    fecha: '2024-02-13',
    nombre: 'María García',
    telefono: '+57 301 987 6543',
    estado: 'pendiente',
  },
  {
    id: '3',
    fecha: '2024-02-12',
    nombre: 'Carlos López',
    telefono: '+57 302 456 7890',
    estado: 'cancelada',
  },
];

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

  const getOrderStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return colors.primary;
      case 'pendiente':
        return '#FFA500';
      case 'cancelada':
        return colors.error;
      default:
        return colors.gray;
    }
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
      year: 'numeric'
    });
  };

  return (
    <View style={CardHistoryStyles.container}>
      {/* Pestañas */}
      <View style={CardHistoryStyles.tabsContainer}>
        <TouchableOpacity
          style={[
            CardHistoryStyles.tab,
            activeTab === 'ordenes' && CardHistoryStyles.activeTab
          ]}
          onPress={() => setActiveTab('ordenes')}
        >
          <Text style={[
            CardHistoryStyles.tabText,
            activeTab === 'ordenes' && CardHistoryStyles.activeTabText
          ]}>
            Órdenes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            CardHistoryStyles.tab,
            activeTab === 'incentivos' && CardHistoryStyles.activeTab
          ]}
          onPress={() => setActiveTab('incentivos')}
        >
          <Text style={[
            CardHistoryStyles.tabText,
            activeTab === 'incentivos' && CardHistoryStyles.activeTabText
          ]}>
            Incentivos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de las pestañas */}
      <ScrollView style={CardHistoryStyles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'ordenes' ? (
          // Lista de órdenes
          <View style={CardHistoryStyles.listContainer}>
            {mockOrders.map((order) => (
              <View key={order.id} style={CardHistoryStyles.orderCard}>
                <View style={CardHistoryStyles.orderImageContainer}>
                  <Icon name="shopping-cart" size={30} color={colors.primary} />
                </View>
                
                <View style={CardHistoryStyles.orderContent}>
                  <Text style={CardHistoryStyles.orderFecha}>
                    {formatDate(order.fecha)}
                  </Text>
                  <Text style={CardHistoryStyles.orderNombre}>
                    {order.nombre}
                  </Text>
                  <Text style={CardHistoryStyles.orderTelefono}>
                    {order.telefono}
                  </Text>
                  <View style={[
                    CardHistoryStyles.orderEstado,
                    { backgroundColor: getOrderStatusColor(order.estado) }
                  ]}>
                    <Text style={CardHistoryStyles.orderEstadoText}>
                      {order.estado.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          // Lista de incentivos
          <View style={CardHistoryStyles.listContainer}>
            {mockIncentives.map((incentive) => (
              <View key={incentive.id} style={CardHistoryStyles.incentiveCard}>
                <View style={CardHistoryStyles.incentiveImageContainer}>
                  <Icon name="gift" size={30} color={colors.primary} />
                </View>
                
                <View style={CardHistoryStyles.incentiveContent}>
                  <Text style={CardHistoryStyles.incentiveFecha}>
                    {formatDate(incentive.fecha)}
                  </Text>
                  <View style={[
                    CardHistoryStyles.incentiveEstado,
                    { backgroundColor: getIncentiveStatusColor(incentive.estado) }
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

