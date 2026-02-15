import {StyleSheet} from 'react-native';
import { colors, fontFamily, shadows, borderRadius } from '../../utils/constants';

const buttonsStyles = StyleSheet.create({
  containerPrimary: {
    borderRadius: borderRadius.medium,
    justifyContent:'center',
    ...shadows.medium,
    // Añadir un gradiente visual con borde
    borderWidth: 0.5,
    borderColor: colors.accent,
  },
  textButtonPrimary: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    letterSpacing: 0.5,
  },
});

export default buttonsStyles;