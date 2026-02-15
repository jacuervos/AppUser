/*!
 * Copyright (c) Laika LLC. All rights reserved.
 */

import React, {ReactElement} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors, fontFamily} from '../../utils/constants';

/**
 * @component Circular
 * @return {ReactElement} - React component
 */
const CircularScreen = (): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="plus-circle" size={80} color={colors.primary} />
        <Text style={styles.title}>Botón Circular</Text>
        <Text style={styles.subtitle}>Funcionalidad adicional</Text>
        <Text style={styles.description}>
          Este es el componente que se muestra cuando se presiona el botón circular
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.primary,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 16,
  },
});

export const Circular = CircularScreen;
