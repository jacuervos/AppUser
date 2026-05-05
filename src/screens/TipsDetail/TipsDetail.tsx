import React, {ReactElement, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../../utils/constants';
import {RootStackParamList} from '../../types/navigation';
import tipsDetailStyles from './styles';

type TipsDetailRouteProp = RouteProp<RootStackParamList, 'TipsDetail'>;
type TipsDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @component TipsDetail
 * @return {ReactElement} - React component
 */
const TipsDetail = (): ReactElement => {
  const navigation = useNavigation<TipsDetailNavigationProp>();
  const route = useRoute<TipsDetailRouteProp>();
  const {initialTips} = route.params || {};

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set());

  // Tips expandidos con más información
  const allTips = initialTips || [
    {
      id: 1,
      tip: 'Usa bolsas reutilizables para tus compras',
      category: 'Consumo',
      description: 'Las bolsas reutilizables reducen significativamente la cantidad de plástico de un solo uso. Una bolsa reutilizable puede reemplazar hasta 1,000 bolsas de plástico durante su vida útil.',
      difficulty: 'Fácil' as const,
      impact: 'Medio' as const,
      steps: [
        'Compra bolsas reutilizables de tela o materiales duraderos',
        'Mantenlas siempre en tu auto, bolso o cerca de la puerta',
        'Lávalas regularmente para mantenerlas limpias',
        'Lleva varias para compras grandes'
      ]
    },
    {
      id: 2,
      tip: 'Ahorra agua cerrando el grifo al cepillarte',
      category: 'Hogar',
      description: 'Un grifo abierto puede desperdiciar hasta 6 litros de agua por minuto. Cerrarlo mientras te cepillas puede ahorrar hasta 24 litros de agua diariamente por persona.',
      difficulty: 'Fácil' as const,
      impact: 'Alto' as const,
      steps: [
        'Moja tu cepillo de dientes y cierra el grifo',
        'Aplica pasta dental y cepíllate durante 2 minutos',
        'Abre el grifo solo para enjuagarte',
        'Considera usar un vaso con agua para enjuagarte'
      ]
    },
    {
      id: 3,
      tip: 'Recicla correctamente separando los materiales',
      category: 'Reciclaje',
      description: 'El reciclaje efectivo requiere separación correcta. Materiales mal separados pueden contaminar lotes enteros de reciclaje, reduciendo su efectividad.',
      difficulty: 'Medio' as const,
      impact: 'Alto' as const,
      steps: [
        'Aprende las categorías de reciclaje de tu localidad',
        'Limpia los envases antes de reciclarlos',
        'Separa por tipo: papel, plástico, vidrio, metal',
        'No mezcles materiales orgánicos con reciclables'
      ]
    },
    {
      id: 4,
      tip: 'Utiliza iluminación LED en casa',
      category: 'Hogar',
      description: 'Las bombillas LED consumen hasta 80% menos energía que las incandescentes y duran 25 veces más. La inversión inicial se recupera en ahorros de energía.',
      difficulty: 'Fácil' as const,
      impact: 'Medio' as const,
      steps: [
        'Reemplaza las bombillas más utilizadas primero',
        'Busca la equivalencia en lúmenes, no en watts',
        'Elige la temperatura de color adecuada para cada espacio',
        'Considera bombillas inteligentes para mayor control'
      ]
    },
    {
      id: 5,
      tip: 'Composta tus residuos orgánicos',
      category: 'Reciclaje',
      description: 'El compostaje convierte los desechos orgánicos en fertilizante natural, reduciendo los residuos enviados a vertederos y creando nutrientes para plantas.',
      difficulty: 'Avanzado' as const,
      impact: 'Alto' as const,
      steps: [
        'Separa residuos orgánicos: frutas, verduras, cáscaras',
        'Crea o compra un contenedor de compost',
        'Alterna capas de material verde (húmedo) y marrón (seco)',
        'Voltea regularmente y mantén humedad adecuada'
      ]
    },
    {
      id: 6,
      tip: 'Prefiere productos locales y de temporada',
      category: 'Consumo',
      description: 'Los productos locales requieren menos transporte, reduciendo las emisiones de carbono. Los productos de temporada son más nutritivos y económicos.',
      difficulty: 'Medio' as const,
      impact: 'Medio' as const,
      steps: [
        'Identifica los mercados locales de tu área',
        'Aprende qué productos están en temporada',
        'Planifica menús basados en disponibilidad local',
        'Considera unirte a programas de agricultura comunitaria'
      ]
    }
  ];

  const categories = ['Todos', ...new Set(allTips.map(tip => tip.category))];
  
  const filteredTips = selectedCategory === 'Todos' 
    ? allTips 
    : allTips.filter(tip => tip.category === selectedCategory);

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

  const handleTipComplete = (tipId: number) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
      // Mostrar feedback positivo
      Alert.alert('¡Excelente!', 'Has marcado este tip como completado. ¡Sigues contribuyendo al planeta! 🌱');
    }
    setCompletedTips(newCompleted);
  };

  const handleShare = async (tip: any) => {
    try {
      await Share.share({
        message: `💡 Tip Ecológico: ${tip.tip}\n\nCategoría: ${tip.category}\n\n¡Comparte tips verdes y ayuda al planeta! 🌍`,
        title: `Tip Ecológico - ${tip.category}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return colors.secondary;
      case 'Medio': return '#FFA500';
      case 'Avanzado': return '#FF6B6B';
      default: return colors.gray;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto': return colors.primary;
      case 'Medio': return '#FFA500';
      case 'Bajo': return colors.gray;
      default: return colors.gray;
    }
  };

  return (
    <View style={tipsDetailStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Filtros de categoría */}
      <View style={tipsDetailStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={tipsDetailStyles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                tipsDetailStyles.categoryButton,
                selectedCategory === category && tipsDetailStyles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text style={[
                tipsDetailStyles.categoryText,
                selectedCategory === category && tipsDetailStyles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de tips */}
      <ScrollView 
        style={tipsDetailStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tipsDetailStyles.scrollContent}>
        
        <View style={tipsDetailStyles.statsContainer}>
          <Text style={tipsDetailStyles.statsText}>
            {completedTips.size} de {allTips.length} tips completados
          </Text>
          <View style={tipsDetailStyles.progressBar}>
            <View 
              style={[
                tipsDetailStyles.progressFill,
                { width: `${(completedTips.size / allTips.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {filteredTips.map((tip) => (
          <View key={tip.id} style={tipsDetailStyles.tipCard}>
            <View style={tipsDetailStyles.tipHeader}>
              <View style={tipsDetailStyles.tipTitleContainer}>
                <Text style={tipsDetailStyles.tipTitle}>{tip.tip}</Text>
                <Text style={tipsDetailStyles.tipCategory}>{tip.category}</Text>
              </View>
              <TouchableOpacity
                style={[
                  tipsDetailStyles.completeButton,
                  completedTips.has(tip.id) && tipsDetailStyles.completeButtonActive
                ]}
                onPress={() => handleTipComplete(tip.id)}>
                <Icon 
                  name={completedTips.has(tip.id) ? 'check-circle' : 'circle'} 
                  size={20} 
                  color={completedTips.has(tip.id) ? colors.primary : colors.gray} 
                  solid={completedTips.has(tip.id)}
                />
              </TouchableOpacity>
            </View>

            <Text style={tipsDetailStyles.tipDescription}>{tip.description}</Text>

            {/* Badges de dificultad e impacto */}
            <View style={tipsDetailStyles.badgesContainer}>
              <View style={[tipsDetailStyles.badge, { backgroundColor: getDifficultyColor(tip.difficulty!) + '20' }]}>
                <Text style={[tipsDetailStyles.badgeText, { color: getDifficultyColor(tip.difficulty!) }]}>
                  {tip.difficulty}
                </Text>
              </View>
              <View style={[tipsDetailStyles.badge, { backgroundColor: getImpactColor(tip.impact!) + '20' }]}>
                <Text style={[tipsDetailStyles.badgeText, { color: getImpactColor(tip.impact!) }]}>
                  Impacto {tip.impact}
                </Text>
              </View>
            </View>

            {/* Pasos para implementar */}
            {tip.steps && (
              <View style={tipsDetailStyles.stepsContainer}>
                <Text style={tipsDetailStyles.stepsTitle}>Cómo implementarlo:</Text>
                {tip.steps.map((step, index) => (
                  <View key={`${tip.id}-step-${index}`} style={tipsDetailStyles.stepItem}>
                    <View style={tipsDetailStyles.stepNumber}>
                      <Text style={tipsDetailStyles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={tipsDetailStyles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

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
