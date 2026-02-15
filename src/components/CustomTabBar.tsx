import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors, fontFamily} from '../utils/constants';

const {width} = Dimensions.get('window');

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar = ({state, descriptors, navigation}: TabBarProps) => {
  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'History':
        return 'history';
      case 'Circular':
        return 'circle';
      case 'Incentivos':
        return 'gift';
      case 'Account':
        return 'user';
      default:
        return 'home';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'Home';
      case 'History':
        return 'Historial';
      case 'Circular':
        return 'Circular';
      case 'Incentivos':
        return 'Incentivos';
      case 'Account':
        return 'Perfil';
      default:
        return routeName;
    }
  };

  // Separar las rutas en dos grupos: antes y después del botón central
  const leftRoutes = state.routes.slice(0, 2); // Map, History
  const rightRoutes = state.routes.slice(3); // Incentivos, Account
  const centerRoute = state.routes[2]; // Circular

  return (
    <View style={styles.tabBar}>
      {/* Curved background */}
      <View style={styles.curvedBackground} />
      
      {/* Tab buttons container */}
      <View style={styles.tabContainer}>
        {/* Left side buttons */}
        <View style={styles.leftSide}>
          {leftRoutes.map((route: any, index: number) => {
            const label = getLabel(route.name);
            const iconName = getIconName(route.name);
            const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);

            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive,
                ]}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}>
                <Icon
                  name={iconName}
                  size={20}
                  color={isFocused ? colors.white : colors.darkGray}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {color: isFocused ? colors.white : colors.darkGray},
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center button */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => {
            const isFocused = state.index === 2;
            const event = navigation.emit({
              type: 'tabPress',
              target: centerRoute.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(centerRoute.name);
            }
          }}>
          <View style={styles.centerButtonInner}>
            <Icon name="plus" size={24} color={colors.white} />
          </View>
        </TouchableOpacity>

        {/* Right side buttons */}
        <View style={styles.rightSide}>
          {rightRoutes.map((route: any, index: number) => {
            const label = getLabel(route.name);
            const iconName = getIconName(route.name);
            const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);

            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive,
                ]}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}>
                <Icon
                  name={iconName}
                  size={20}
                  color={isFocused ? colors.white : colors.darkGray}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {color: isFocused ? colors.white : colors.darkGray},
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'transparent',
  },
  curvedBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  leftSide: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  rightSide: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyRegular,
    marginTop: 4,
  },
  centerButton: {
    position: 'absolute',
    top: -20,
    left: width / 2 - 30, // Centrar exactamente (30 es la mitad del width 60)
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  centerButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBar;
