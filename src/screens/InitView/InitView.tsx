import React, { useEffect } from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {PrincipalTextInput} from '../../components/textInput/PrincipalTextInput.tsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import InitViewStyles from './styles.tsx';
import {colors} from '../../utils/constants.tsx';
import {PrimaryButton} from '../../components/buttons/PrimaryButton.tsx';
import {useAuth} from '../../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  Tab: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const InitView = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const { error } = useAuth();

  // Verificar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Para pruebas, no hacemos redirección automática
      // Solo cuando se presione el botón de "Iniciar sesión"
    };

    checkAuthStatus();
  }, [navigation]);

  const creteSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ingresa un email válido')
      .required('El email es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });

  const handleLogin = async (values: {email: string; password: string}) => {
    // Redirección directa para pruebas
    navigation.replace('Tab');
  };

  // Para propósitos de prueba, no mostramos pantalla de carga inicial
  return (
    <View style={InitViewStyles.container}>
      <LinearGradient
        style={InitViewStyles.gradientStyles}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        colors={[colors.primary, colors.lightGreen, colors.secondary]}>
        <View style={InitViewStyles.containerImage}>
          <Image
            source={require('../../../assets/images/login.png')}
            style={InitViewStyles.image}
          />
        </View>
        <View style={InitViewStyles.containerTitle}>
          <Text style={InitViewStyles.firstTitle}>User</Text>
          <Text style={InitViewStyles.secondTitle}>App</Text>
        </View>
      </LinearGradient>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={creteSchema}
        onSubmit={handleLogin}>
        {({errors, touched, handleSubmit, values, setFieldValue}) => (
          <View>
            {error && (
              <View style={InitViewStyles.errorContainer}>
                <Text style={InitViewStyles.errorText}>{error}</Text>
              </View>
            )}
            <PrincipalTextInput
              value={values.email}
              valueChange={'email'}
              change={setFieldValue}
              style={InitViewStyles.textInput}
              label={'Correo electrónico'}
              mode={'flat'}
              keyboard={'email-address'}
              error={!!errors?.email && touched?.email}
            />
            <PrincipalTextInput
              value={values.password}
              valueChange={'password'}
              change={setFieldValue}
              style={InitViewStyles.textInput}
              label={'Contraseña'}
              mode={'flat'}
              keyboard={'default'}
              security={true}
              error={!!errors?.password && touched?.password}
            />
            <View style={InitViewStyles.containerButton}>
              <PrimaryButton
                text="Iniciar sesión"
                width={150}
                height={50}
                backgroundColor={colors.primary}
                disabled={false}
                action={() => navigation.navigate('Tab')}
              />
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={InitViewStyles.textHelp}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={InitViewStyles.textHelp}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default InitView;
