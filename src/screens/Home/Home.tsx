import React, {ReactElement} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../hooks/useAuth';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import homeStyles from './styles';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component Home
 * @return {ReactElement} - React component
 */
const Home = (): ReactElement => {
  const {userInfo} = useAuth();
  const navigation = useNavigation<HomeNavigationProp>();

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleIncentivePress = (incentiveTitle: string) => {
    Alert.alert(
      incentiveTitle,
      'Redireccionando al detalle de la orden siempre y cuando se encuentre en curso',
      [
        {
          text: 'OK',
          onPress: () => console.log('Redirigiendo al detalle...'),
        },
      ]
    );
  };

  // Datos de ejemplo para blogs
  const blogs = [
    { id: 1, title: 'Cómo reducir tu huella de carbono', author: 'EcoTeam', date: '2024-02-10', category: 'Sostenibilidad', excerpt: 'Descubre estrategias efectivas para reducir tu impacto ambiental en el día a día.' },
    { id: 2, title: 'Recetas sostenibles para el hogar', author: 'GreenLife', date: '2024-02-08', category: 'Hogar', excerpt: 'Aprende a preparar productos de limpieza ecológicos y naturales en casa.' },
    { id: 3, title: 'Tecnología verde del futuro', author: 'TechEco', date: '2024-02-05', category: 'Tecnología', excerpt: 'Explora las innovaciones tecnológicas que están revolucionando la sostenibilidad.' }
  ];

  // Datos de ejemplo para tips
  const tips = [
    { id: 1, tip: 'Usa bolsas reutilizables para tus compras', category: 'Consumo' },
    { id: 2, tip: 'Ahorra agua cerrando el grifo al cepillarte', category: 'Hogar' },
    { id: 3, tip: 'Recicla correctamente separando los materiales', category: 'Reciclaje' }
  ];

  // Datos de ejemplo para órdenes en curso
  const activeOrders = [
    { 
      id: 1, 
      orderNumber: 'ORD-001', 
      status: 'En progreso', 
      location: 'Centro de Reciclaje Norte', 
      estimatedTime: '15 min',
      materials: ['Plástico', 'Papel'],
      points: 45
    },
    { 
      id: 2, 
      orderNumber: 'ORD-002', 
      status: 'Pendiente', 
      location: 'EcoEstación Sur', 
      estimatedTime: '30 min',
      materials: ['Vidrio', 'Metal'],
      points: 60
    }
  ];

  const handleBlogsPress = () => {
    navigation.navigate('BlogsList', { initialBlogs: blogs });
  };

  const handleTipsPress = () => {
    navigation.navigate('TipsDetail', { initialTips: tips });
  };

  const handleOrderPress = (order: any) => {
    Alert.alert(
      `Orden ${order.orderNumber}`,
      `Estado: ${order.status}\nUbicación: ${order.location}\nTiempo estimado: ${order.estimatedTime}\nPuntos: ${order.points}`
    );
  };

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
        
        {/* SECCIÓN ÓRDENES EN CURSO - Lo más importante */}
        <View style={homeStyles.section}>
          <View style={homeStyles.sectionHeader}>
            <Icon name="clock" size={20} color={colors.primary} />
            <Text style={homeStyles.sectionTitle}>Órdenes en Curso</Text>
          </View>
          
          {activeOrders.map((order) => (
            <TouchableOpacity 
              key={order.id}
              style={homeStyles.orderCard}
              onPress={() => handleOrderPress(order)}>
              <View style={homeStyles.orderHeader}>
                <Text style={homeStyles.orderNumber}>{order.orderNumber}</Text>
                <View style={[homeStyles.statusBadge, { 
                  backgroundColor: order.status === 'En progreso' ? colors.primary : '#FFA500' 
                }]}>
                  <Text style={homeStyles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
              <View style={homeStyles.orderInfo}>
                <Icon name="map-marker-alt" size={12} color={colors.gray} />
                <Text style={homeStyles.orderLocation}>{order.location}</Text>
              </View>
              <View style={homeStyles.orderDetails}>
                <Text style={homeStyles.orderMaterials}>
                  Materiales: {order.materials.join(', ')}
                </Text>
                <View style={homeStyles.orderBottom}>
                  <Text style={homeStyles.orderTime}>⏰ {order.estimatedTime}</Text>
                  <Text style={homeStyles.orderPoints}>🎯 {order.points} pts</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECCIÓN TOP INCENTIVOS */}
        <View style={homeStyles.section}>
          <View style={homeStyles.sectionHeader}>
            <Icon name="star" size={20} color={colors.primary} />
            <Text style={homeStyles.sectionTitle}>Top Incentivos</Text>
          </View>
          
          <View style={homeStyles.incentivesGrid}>
            <TouchableOpacity 
              style={homeStyles.incentiveCard}
              onPress={() => handleIncentivePress('Descuento 20%')}>
              <View style={homeStyles.cardIconContainer}>
                <Icon name="percentage" size={24} color={colors.primary} />
              </View>
              <Text style={homeStyles.cardTitle}>Descuento 20%</Text>
              <Text style={homeStyles.cardSubtitle}>Supermercado</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeStyles.incentiveCard}
              onPress={() => handleIncentivePress('Café Gratis')}>
              <View style={homeStyles.cardIconContainer}>
                <Icon name="coffee" size={24} color={colors.primary} />
              </View>
              <Text style={homeStyles.cardTitle}>Café Gratis</Text>
              <Text style={homeStyles.cardSubtitle}>Tiendas aliadas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeStyles.incentiveCard}
              onPress={() => handleIncentivePress('Entrada Cine')}>
              <View style={homeStyles.cardIconContainer}>
                <Icon name="film" size={24} color={colors.primary} />
              </View>
              <Text style={homeStyles.cardTitle}>Entrada Cine</Text>
              <Text style={homeStyles.cardSubtitle}>Días de semana</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECCIÓN BLOGS */}
        <View style={homeStyles.section}>
          <TouchableOpacity 
            style={homeStyles.sectionHeader}
            onPress={handleBlogsPress}>
            <Icon name="blog" size={20} color={colors.primary} />
            <Text style={homeStyles.sectionTitle}>Blog Ecológico</Text>
            <Icon name="chevron-right" size={16} color={colors.gray} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          {blogs.map((blog) => (
            <View 
              key={blog.id}
              style={homeStyles.blogCard}>
              <View style={homeStyles.blogIcon}>
                <Icon name="newspaper" size={20} color={colors.primary} />
              </View>
              <View style={homeStyles.blogContent}>
                <Text style={homeStyles.blogTitle}>{blog.title}</Text>
                <View style={homeStyles.blogMeta}>
                  <Text style={homeStyles.blogAuthor}>Por {blog.author}</Text>
                  <Text style={homeStyles.blogDate}>{blog.date}</Text>
                </View>
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
          
          {tips.map((tip) => (
            <View key={tip.id} style={homeStyles.tipCard}>
              <View style={homeStyles.tipIcon}>
                <Icon name="leaf" size={16} color={colors.secondary} />
              </View>
              <View style={homeStyles.tipContent}>
                <Text style={homeStyles.tipText}>{tip.tip}</Text>
                <Text style={homeStyles.tipCategory}>{tip.category}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
