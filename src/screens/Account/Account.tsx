import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView, Image,
} from 'react-native';
import React, {ReactElement} from 'react';
import {colors, fontFamily} from '../../utils/constants';
import {useAuth} from '../../hooks/useAuth';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/navigation.ts";

/**
 * @component Account View
 * @return {ReactElement} - React component
 */
export const Account = (): ReactElement => {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {userInfo, logout} = useAuth();

  // Datos del usuario con valores por defecto
  const userData = {
    name: userInfo?.name || 'Usuario',
    phone: userInfo?.phone || 'No disponible',
    document: userInfo?.identification || 'No disponible',
    email: userInfo?.email || 'No disponible',
    points: userInfo?.points || 0,
    image: userInfo?.photo || ''
  };

  const handleEdit = () => {
    navigation.navigate('Profile');
  };

  const handleWhatsApp = () => {
    const phoneNumber = '573178874640'
    const message = `Hola, soy ${userData.name}. Me gustaría obtener más información.`;
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('Error', 'WhatsApp no está instalado en este dispositivo');
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudo abrir WhatsApp'));
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            logout()
              .then(() => {
                Alert.alert('Éxito', 'Sesión cerrada exitosamente');
              })
              .catch((error) => {
                console.error('Logout error:', error);
                Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
              });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar con puntos */}
        <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {userData.image === '' ?
              <Icon name="user" size={40} color={colors.primary} />
              :
              <Image
                  source={{uri: userData.image}}
                  style={styles.image}
              />
          }

        </View>
        <View style={styles.pointsContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.pointsText}>{userData.points}</Text>
          <Text style={styles.pointsLabel}>puntos</Text>
        </View>
      </View>

      {/* Información del usuario */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>{userData.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{userData.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Correo electrónico</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Documento</Text>
          <Text style={styles.infoValue}>{userData.document}</Text>
        </View>
      </View>

      {/* Botón Editar */}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Icon name={"edit"} size={16} color={colors.white} />
        <Text style={styles.editButtonText}>
          {'Editar Perfil'}
        </Text>
      </TouchableOpacity>

      {/* Botón WhatsApp */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
        <Icon name="whatsapp" size={20} color={colors.white} />
        <Text style={styles.whatsappButtonText}>
          Botón para comunicarse por whatsapp
        </Text>
      </TouchableOpacity>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out-alt" size={16} color={colors.white} />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espacio extra al final para evitar que se corten los botones
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.black,
    marginHorizontal: 5,
  },
  pointsLabel: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.black,
  },
  editSection: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.black,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textInputActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    marginLeft: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  whatsappButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyBold,
    marginLeft: 10,
    textAlign: 'center',
  },
  logoutSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    marginLeft: 10,
  },
});
