import React, {ReactElement, useLayoutEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import tipsDetailStyles from './styles';
import useTipStore from "../../store/tipStore.ts";

type TipsDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component TipsDetail
 * @return {ReactElement} - React component
 */
const TipsDetail = (): ReactElement => {
  const navigation = useNavigation<TipsDetailNavigationProp>();

  const {tips} = useTipStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Tips Ecológicos',
      headerBackTitle: '',
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const handleShare = async (tip: any) => {
    try {
      await Share.share({
        message: `💡 Tip Ecológico: ${tip.title}\n\n¡Comparte tips verdes y ayuda al planeta! 🌍`,
        title: `Tip Ecológico - ${tip.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={tipsDetailStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Lista de tips */}
      <ScrollView 
        style={tipsDetailStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tipsDetailStyles.scrollContent}>

        {tips.map((tip) => (
          <View key={tip.id} style={tipsDetailStyles.tipCard}>
            <View style={tipsDetailStyles.tipHeader}>
              <View style={tipsDetailStyles.tipTitleContainer}>
                <Text style={tipsDetailStyles.tipTitle}>{tip.title}</Text>
              </View>
            </View>
            <Text style={tipsDetailStyles.tipDescription}>{tip.description}</Text>

            {/* Acciones */}
            <View style={tipsDetailStyles.actionsContainer}>
              <TouchableOpacity
                style={tipsDetailStyles.actionButton}
                onPress={() => handleShare(tip)}>
                <Icon name="share-alt" size={14} color={colors.primary} />
                <Text style={tipsDetailStyles.actionText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TipsDetail;
