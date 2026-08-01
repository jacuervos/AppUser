import React from 'react';
import {View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import {IHeader} from './Iheader.tsx';
import headerStyles from './styles.tsx';
import useAuth from "../../hooks/useAuth.ts";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export const Header: React.FC<IHeader> = ({action, goBack}) => {
  const {userInfo} = useAuth()
  return (
    <View style={headerStyles.container}>
       {goBack && (
          <TouchableOpacity
              onPress={goBack}
              style={headerStyles.containerIcon}>
              <FontAwesome5Icon name={'angle-left'} size={40} color={'white'} />
          </TouchableOpacity>
       )}
      <Text style={headerStyles.title}>¡Hola, {userInfo?.name || 'Usuario'}!</Text>
      <Pressable onPress={action}>
        <Image
          source={require('../../../assets/images/login.png')}
          style={headerStyles.image}
        />
      </Pressable>
    </View>
  );
};
