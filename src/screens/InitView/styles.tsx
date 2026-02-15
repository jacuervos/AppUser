import {StyleSheet} from 'react-native';
import {colors, fontFamily, shadows, borderRadius} from '../../utils/constants.tsx';

const InitViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerImage: {
    backgroundColor: colors.white,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    ...shadows.large,
    // Añadir un borde sutil
    borderWidth: 2,
    borderColor: colors.lightGreen,
  },
  image: {
    width: 80,
    height: 80,
  },
  containerTitle: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  firstTitle:{
    color: colors.primary,
    fontSize: 28,
    fontFamily: fontFamily.fontFamilyBold,
    // Añadir sombra al texto
    textShadowColor: colors.lightGreen,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  secondTitle:{
    color: colors.accent,
    fontSize: 28,
    fontFamily: fontFamily.fontFamilyBold
  },
  textInput: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    marginTop: '5%',
    fontFamily: fontFamily.fontFamilyRegular,
    // Mejorar bordes
    borderRadius: borderRadius.medium,
    borderTopLeftRadius: borderRadius.medium,
    borderTopRightRadius: borderRadius.medium,
  },
  containerButton: {
    marginTop: '15%',
    alignSelf: 'center',
    alignItems:'center'
  },
  gradientStyles: {
    height: '40%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textHelp:{
    fontFamily: fontFamily.fontFamilyRegular,
    textDecorationLine: 'underline',
    marginTop: 10,
    fontSize: 15,
    color: colors.tertiary
  },
  errorContainer: {
    backgroundColor: colors.lightGray,
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: borderRadius.small,
    padding: 12,
    margin: 15,
    alignSelf: 'center',
    width: '90%',
    ...shadows.small,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: fontFamily.fontFamilySemiBold,
    textAlign: 'center',
  },
});

export default InitViewStyles;
