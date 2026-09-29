import React, {ReactElement, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  NativeModules
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../hooks/useAuth';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import useOrderStore from "../../store/orderStore.ts";
import {OrderHistoryItem} from "../../types/order.types.ts";
import homeStyles from './styles';
import useBlogStore from "../../store/blogStore.ts";
import useTipStore from "../../store/tipStore.ts";
import {RescheduleOrderModal} from '../../components/modals/RescheduleOrderModal';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;


/**
 * @component Home
 * @return {ReactElement} - React component
 */
const Home = (): ReactElement => {
  const {userInfo} = useAuth();
  const {orderActive, fetchMyOrderActive, getInfoOrderMap} = useOrderStore();
  const {blogs, getBlogs} = useBlogStore();
  const {tips, getTips} = useTipStore();

  const { GeocoderModule } = NativeModules;

  const [ordersWithAddress, setOrdersWithAddress] = useState<OrderHistoryItem[] | []>([]);
  const [orderToReschedule, setOrderToReschedule] = useState<OrderHistoryItem | null>(null);

  const navigation = useNavigation<HomeNavigationProp>();

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBlogsPress = () => {
    navigation.navigate('BlogsList');
  };

  const handleTipsPress = () => {
    navigation.navigate('TipsDetail');
  };

  const handleOrderPress = (order: OrderHistoryItem) => {
    if(order?.collector?.location === null){
      Alert.alert(
          `¡Espera!`,
          'No puedes ver aún la ubicación del recolector'
      );
    }else {
      navigation.navigate('Map' as never);
      getInfoOrderMap(order);
    }
  };

  const formatOrderDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const normalized = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    fetchMyOrderActive();
    getBlogs();
    getTips();
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (orderActive.length === 0) {
      setOrdersWithAddress([]);
      return;
    }

    setOrdersWithAddress(current =>
      orderActive.map(order => {
        const previous = current.find(item => item.id === order.id);
        return {
          ...order,
          address: previous?.address || order.address,
        };
      }),
    );

    const loadAddresses = async () => {
      try {
        const data = await Promise.all(
          orderActive.map(async order => {
            const response = await GeocoderModule.getAddress(
              parseFloat(order.pickup_location.latitude),
              parseFloat(order.pickup_location.longitude),
            );
            return {
              ...order,
              address: response.addressLine,
            };
          }),
        );
        if (!cancelled) {
          setOrdersWithAddress(data);
        }
      } catch (error) {
        console.error('Error cargando direcciones:', error);
        if (!cancelled) {
          setOrdersWithAddress(orderActive);
        }
      }
    };

    loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [orderActive]);

  return (
    <View style={homeStyles.container}>
      {/* Header personalizado con logo de la app */}
      <View style={homeStyles.appHeader}>
        <View style={homeStyles.logoContainer}>
          <Image
            source={require('../../../assets/images/login.png')}
            style={homeStyles.appLogo}
          />
          <View style={homeStyles.appTitleContainer}>
            <Text style={homeStyles.appTitle}>User</Text>
            <Text style={homeStyles.appSubtitle}>App</Text>
          </View>
        </View>
        
        <View style={homeStyles.headerInfo}>
          <Text style={homeStyles.headerTime}>{getCurrentTime()}</Text>
          <Text style={homeStyles.headerWelcome}>
            ¡Hola, {userInfo?.name || 'Usuario'}!
          </Text>
        </View>
      </View>

      <ScrollView 
        style={homeStyles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}>

        {ordersWithAddress.length > 0 && (
          <>
            {/* SECCIÓN ÓRDENES EN CURSO - Lo más importante */}
            <View style={homeStyles.section}>
              <View style={homeStyles.sectionHeader}>
                <Icon name="clock" size={20} color={colors.primary} />
                <Text style={homeStyles.sectionTitle}>Órdenes en Curso</Text>
              </View>

              {ordersWithAddress.map((order) => {
                const materialNames = order.items.map(item => item.type_waste_name).join(', ');
                const totalPoints = order.items.reduce(
                    (total, item) => total + item.points,
                    0,
                );
                return <View key={order.id} style={homeStyles.orderCard}>
                  <TouchableOpacity onPress={() => handleOrderPress(order)}>
                    <View style={homeStyles.orderHeader}>
                      <Text style={homeStyles.orderNumber}>{order.id}</Text>
                      <View style={[homeStyles.statusBadge, {
                        backgroundColor: colors.primary
                      }]}>
                        <Text style={homeStyles.orderStatusText}>{order.status}</Text>
                      </View>
                    </View>

                    <View style={homeStyles.orderInfo}>
                      <Icon name="map-marker-alt" size={12} color={colors.gray} />
                      <Text style={homeStyles.orderLocation}>{order.address}</Text>
                    </View>
                    <View style={homeStyles.orderDetails}>
                      <Text style={homeStyles.orderMaterials}>
                        Materiales: {materialNames}
                      </Text>
                      <View style={homeStyles.orderBottom}>
                        <Text style={homeStyles.orderTime}>{formatOrderDate(order.date)}</Text>
                        <Text style={homeStyles.orderPoints}>🎯 {totalPoints} pts</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => setOrderToReschedule(order)}
                      style={[homeStyles.statusOrder, {
                    backgroundColor: colors.info
                  }]}>
                    <Text style={homeStyles.orderStatusText}>Reprogramar órden</Text>
                  </TouchableOpacity>
                </View>
              })}
            </View>
          </>
        )}

        {/* SECCIÓN BLOGS */}
        <View style={homeStyles.section}>
          <TouchableOpacity 
            style={homeStyles.sectionHeader}
            onPress={handleBlogsPress}>
            <Icon name="blog" size={20} color={colors.primary} />
            <Text style={homeStyles.sectionTitle}>Blog Ecológicos</Text>
            <Icon name="chevron-right" size={16} color={colors.gray} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          {blogs.slice(0, 3).map((blog) => (
            <View 
              key={blog.id}
              style={homeStyles.blogCard}>
              <View style={homeStyles.blogIcon}>
                <Icon name="newspaper" size={20} color={colors.primary} />
              </View>
              <View style={homeStyles.blogContent}>
                <Text style={homeStyles.blogTitle}>{blog.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SECCIÓN TIPS */}
        <View style={homeStyles.section}>
          <TouchableOpacity 
            style={homeStyles.sectionHeader}
            onPress={handleTipsPress}>
            <Icon name="lightbulb" size={20} color={colors.primary} />
            <Text style={homeStyles.sectionTitle}>Tips Ecológicos</Text>
            <Icon name="chevron-right" size={16} color={colors.gray} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          {tips.slice(0, 3).map((tip) => (
            <View key={tip.id} style={homeStyles.tipCard}>
              <View style={homeStyles.tipIcon}>
                <Icon name="leaf" size={16} color={colors.primary} />
              </View>
              <Text style={homeStyles.tipText}>{tip.title}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <RescheduleOrderModal
        visible={orderToReschedule !== null}
        order={orderToReschedule}
        onClose={() => setOrderToReschedule(null)}
      />
    </View>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
