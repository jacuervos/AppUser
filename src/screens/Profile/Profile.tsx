import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Pressable,
} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ChangeImage} from '../../components/modals/ChangeImage';
import {PrimaryButton} from '../../components/buttons/PrimaryButton';
import {PrincipalTextInput} from '../../components/textInput/PrincipalTextInput';
import {useAuth} from '../../hooks/useAuth';
import {colors} from '../../utils/constants';
import {openCamera, openGallery} from '../../functions/Camera';
import ProfileStyles from './styles';
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome5";

type RootStackParamList = {
  Tab: undefined;
};


const Profile = ({}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {isLoading, error, userInfo, clearError, updateProfile } = useAuth();

  const [imageProfile, setImageProfile] = useState(userInfo?.photo);
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  const creteSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    phone: Yup.string().required('El teléfono es requerido'),
  });

  const handleUpdate = async (values: any) => {
    await updateProfile(
        {
          ...values,
          ...(changeImage ? { images: imageProfile } : {}),
          identification: userInfo?.identification,
        },
        userInfo?.id ?? 0
    );
    Toast.show({
      type: 'success',
      text1: '¡En hora nueva!',
      text2: 'Se ha actualizado la información correctamente!',
    });
    setChangeImage(false)
    navigation.goBack();
    clearError();
  };

  const openModal = () => {
    sheetRef?.current?.present();
  };

  const handleTakeImage = async (image: 'photo' | 'gallery') => {
    if(image === 'photo'){
      const photo = await openCamera();
      setImageProfile(photo?.url ?? '');
    }else {
      const photo = await openGallery();
      setImageProfile(photo?.url ?? '');
    }
    setChangeImage(true);
    sheetRef?.current?.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={ProfileStyles.flexContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ProfileStyles.scrollContainer}>
          <View style={ProfileStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={ProfileStyles.headerButton}>
              <Icon name="arrow-left" size={20} color={colors.primary} />
            </TouchableOpacity>
            <LinearGradient
              style={ProfileStyles.gradientStyles}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              colors={[colors.primary, colors.white]}>
              <View style={ProfileStyles.containerImage}>
                <Image
                    source={imageProfile ? {uri: imageProfile} : require('../../../assets/images/login.png')}
                    style={ProfileStyles.image}
                />
              </View>
              <Pressable
                  onPress={openModal}
                  style={ProfileStyles.containerCamera}>
                <MaterialIcons
                  name={'camera-alt'}
                  color={colors.black}
                  size={12}
                />
              </Pressable>
              <View style={ProfileStyles.containerTitle}>
                <Text style={ProfileStyles.firstTitle}>Actualizar información</Text>
              </View>
            </LinearGradient>
            <Formik
              initialValues={{
                email: userInfo?.email || '',
                name: userInfo?.name || '',
                phone: userInfo?.phone || '',
                identification: userInfo?.identification || '',
              }}
              validationSchema={creteSchema}
              onSubmit={handleUpdate}>
              {({errors, touched, handleSubmit, values, setFieldValue}) => (
                <View>
                  {error && (
                    <View style={ProfileStyles.errorContainer}>
                      <Text style={ProfileStyles.errorText}>{error}</Text>
                    </View>
                  )}
                  <PrincipalTextInput
                    value={values.name}
                    valueChange={'name'}
                    change={setFieldValue}
                    style={ProfileStyles.textInput}
                    label={'Nombre'}
                    mode={'flat'}
                    keyboard={'default'}
                    error={!!errors?.name && touched?.name}
                  />
                  <PrincipalTextInput
                    value={values.phone}
                    valueChange={'phone'}
                    change={setFieldValue}
                    style={ProfileStyles.textInput}
                    label={'Teléfono'}
                    mode={'flat'}
                    keyboard={'numeric'}
                    error={!!errors?.phone && touched?.phone}
                  />
                  <PrincipalTextInput
                    disabled={true}
                    value={values.identification}
                    valueChange={'identification'}
                    change={setFieldValue}
                    style={ProfileStyles.textInput}
                    label={'Identificación'}
                    mode={'flat'}
                    keyboard={'numeric'}
                    error={!!errors?.identification && touched?.identification}
                  />
                  <PrincipalTextInput
                    disabled={true}
                    value={values.email}
                    valueChange={'email'}
                    change={setFieldValue}
                    style={ProfileStyles.textInput}
                    label={'Correo electrónico'}
                    mode={'flat'}
                    keyboard={'email-address'}
                    error={!!errors?.email && touched?.email}
                  />
                  <View style={ProfileStyles.containerButton}>
                    <PrimaryButton
                      text={isLoading ? 'Actualizando...' : 'Actualizar'}
                      width={150}
                      height={50}
                      backgroundColor={colors.primary}
                      disabled={isLoading}
                      action={() => handleSubmit()}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <ChangeImage sheetRef={sheetRef} handleTakeImage={handleTakeImage} />
    </KeyboardAvoidingView>
  );
};

export default Profile;
