import React, { useEffect, useRef, useState } from 'react';
import {Alert, Text, View, Image, TouchableOpacity} from 'react-native';
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
import {ActivityIndicator} from "react-native-paper";

type RootStackParamList = {
  Tab: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const InitView = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { login, isLoading, error, isAuthenticated, isInitialized, clearError } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const didRestoreSession = useRef(false);

  useEffect(() => {
    if (!isInitialized || didRestoreSession.current) {
      return;
    }

    didRestoreSession.current = true;

    if (isAuthenticated) {
      navigation.replace('Tab');
      return;
    }

    setIsInitializing(false);
  }, [isAuthenticated, isInitialized, navigation]);

  const creteSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ingresa un email válido')
      .required('El email es requerido'),
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .required('La contraseña es requerida'),
  });

  const handleLogin = async (values: {email: string; password: string}) => {
    try {
      clearError(); // Limpiar errores previos
      await login(values);
      // Si el login es exitoso, navegar a la pantalla principal
      navigation.replace('Tab');
    } catch (err) {
      Alert.alert(
          'Error de autenticación',
          err instanceof Error ? err?.message : 'Error al iniciar sesión',
      );
    }
  };

  // Mostrar loading mientras se inicializa la autenticación
  if (isInitializing) {
    return (
        <View style={InitViewStyles.container}>
          <LinearGradient
              style={InitViewStyles.gradientStyles}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              colors={[colors.primary, colors.white]}>
            <View style={InitViewStyles.containerImage}>
              <Image
                  source={require('../../../assets/images/login.png')}
                  style={InitViewStyles.image}
              />
            </View>
            <View style={InitViewStyles.containerTitle}>
              <Text style={InitViewStyles.firstTitle}>Recycler</Text>
              <Text style={InitViewStyles.secondTitle}>App</Text>
            </View>
          </LinearGradient>
          <View style={[InitViewStyles.containerButton, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[InitViewStyles.textHelp, { marginTop: 10, color: colors.primary }]}>
              Verificando sesión...
            </Text>
          </View>
        </View>
    );
  }

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
                text={isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                width={150}
                height={50}
                backgroundColor={colors.primary}
                disabled={false}
                action={handleSubmit}
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
