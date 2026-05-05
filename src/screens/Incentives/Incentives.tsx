import React, {ReactElement} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../../utils/constants';
import IncentivesStyles from './styles';

interface Incentive {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image?: string;
  available: boolean;
}

// Datos de ejemplo de incentivos
const incentivesData: Incentive[] = [
  {
    id: '1',
    title: '20% Descuento en Supermercado',
    description: 'Obtén un 20% de descuento en tu compra de supermercado',
    points: 100,
    category: 'Descuentos',
    available: true,
  },
  {
    id: '2',
    title: 'Café Gratis',
    description: 'Disfruta de un café gratis en nuestras tiendas asociadas',
    points: 50,
    category: 'Comida y Bebida',
    available: true,
  },
  {
    id: '3',
    title: 'Entrada de Cine',
    description: 'Una entrada gratis al cine entre semana',
    points: 150,
    category: 'Entretenimiento',
    available: true,
  },
  {
    id: '4',
    title: 'Descuento en Transporte',
    description: '50% de descuento en tu próximo viaje en transporte público',
    points: 75,
    category: 'Transporte',
    available: false,
  },
  {
    id: '5',
    title: 'Kit de Productos Ecológicos',
    description: 'Kit completo de productos ecológicos para el hogar',
    points: 200,
    category: 'Productos',
    available: true,
  },
  {
    id: '6',
    title: 'Clase de Yoga',
    description: 'Una clase de yoga gratis en nuestros centros afiliados',
    points: 80,
    category: 'Bienestar',
    available: true,
  },
];

/**
 * @component Incentives
 * @return {ReactElement} - React component
 */
export const Incentives = (): ReactElement => {

  const handleIncentivePress = (incentive: Incentive) => {
    if (!incentive.available) {
      Alert.alert('No Disponible', 'Este incentivo no está disponible en este momento');
      return;
    }
    
    Alert.alert(
      incentive.title,
      `${incentive.description}\n\nPuntos requeridos: ${incentive.points}\n\n¿Te gustaría canjear este incentivo?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Canjear',
          onPress: () => {
            Alert.alert('¡Éxito!', 'Incentivo canjeado exitosamente. Recibirás un código por correo electrónico.');
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Descuentos':
        return 'percentage';
      case 'Comida y Bebida':
        return 'coffee';
      case 'Entretenimiento':
        return 'film';
      case 'Transporte':
        return 'bus';
      case 'Productos':
        return 'gift';
      case 'Bienestar':
        return 'heart';
      default:
        return 'star';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Descuentos':
        return '#FF6B6B';
      case 'Comida y Bebida':
        return '#4ECDC4';
      case 'Entretenimiento':
        return '#45B7D1';
      case 'Transporte':
        return '#96CEB4';
      case 'Productos':
        return '#FECA57';
      case 'Bienestar':
        return '#FF9FF3';
      default:
        return colors.primary;
    }
  };

  return (
    <View style={IncentivesStyles.container}>
    
      <ScrollView 
        style={IncentivesStyles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={IncentivesStyles.scrollContent}>
    
        {/* Lista de incentivos */}
        <View style={IncentivesStyles.incentivesSection}>
          <Text style={IncentivesStyles.sectionTitle}>Incentivos Disponibles</Text>
          
          {incentivesData.map((incentive) => (
            <TouchableOpacity
              key={incentive.id}
              style={[
                IncentivesStyles.incentiveCard,
                !incentive.available && IncentivesStyles.incentiveCardDisabled
              ]}
              onPress={() => handleIncentivePress(incentive)}
              disabled={!incentive.available}>
              
              <View style={IncentivesStyles.cardHeader}>
                <View style={[
                  IncentivesStyles.categoryIcon,
                  { backgroundColor: getCategoryColor(incentive.category) }
                ]}>
                  <Icon 
                    name={getCategoryIcon(incentive.category)} 
                    size={16} 
                    color={colors.white} 
                  />
                </View>
                
                <View style={IncentivesStyles.cardTitleContainer}>
                  <Text style={[
                    IncentivesStyles.incentiveTitle,
                    !incentive.available && IncentivesStyles.textDisabled
                  ]}>
                    {incentive.title}
                  </Text>
                  <Text style={IncentivesStyles.categoryText}>
                    {incentive.category}
                  </Text>
                </View>

                <View style={IncentivesStyles.pointsContainer}>
                  <Text style={[
                    IncentivesStyles.pointsText,
                    !incentive.available && IncentivesStyles.textDisabled
                  ]}>
                    {incentive.points}
                  </Text>
                  <Text style={IncentivesStyles.pointsLabel}>pts</Text>
                </View>
              </View>

              <Text style={[
                IncentivesStyles.incentiveDescription,
                !incentive.available && IncentivesStyles.textDisabled
              ]}>
                {incentive.description}
              </Text>

              {!incentive.available && (
                <View style={IncentivesStyles.unavailableOverlay}>
                  <Text style={IncentivesStyles.unavailableText}>
                    No disponible
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

   
    </View>
  );
};

export default Incentives;
