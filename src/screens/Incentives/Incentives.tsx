import React, {ReactElement} from 'react';
import {ScrollView, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../../utils/constants';
import IncentivesStyles from './styles';

interface Level {
  name: string;
  min: number;
  max: number;
  icon: string;
}

const LEVELS: Level[] = [
  {name: 'Semilla Verde', min: 0, max: 19999, icon: 'seedling'},
  {name: 'Aprendiz del Reciclaje', min: 20000, max: 59999, icon: 'leaf'},
  {name: 'Guardián del Medio Ambiente', min: 60000, max: 119999, icon: 'shield-alt'},
  {name: 'Recolector Responsable', min: 120000, max: 199999, icon: 'recycle'},
  {name: 'Constructor Ecológico', min: 200000, max: 299999, icon: 'hammer'},
  {name: 'Héroe Verde', min: 300000, max: 449999, icon: 'star'},
  {name: 'Embajador del Reciclaje', min: 450000, max: 649999, icon: 'medal'},
  {name: 'Defensor Planetario', min: 650000, max: 899999, icon: 'globe-americas'},
  {name: 'Maestro Eco-Sabio', min: 900000, max: 1199999, icon: 'crown'},
  {name: 'Leyenda del Reciclaje', min: 1200000, max: 999999999, icon: 'trophy'},
];

const CURRENT_POINTS = 84500;

const formatPoints = (value: number) => value.toLocaleString('es-CO');

const formatRange = (level: Level, isLast: boolean) => {
  if (isLast) {
    return `Desde ${formatPoints(level.min)} pts`;
  }
  return `${formatPoints(level.min)} – ${formatPoints(level.max)} pts`;
};

/**
 * @component Incentives
 * @return {ReactElement} - React component
 */
export const Incentives = (): ReactElement => {
  const currentIndex = LEVELS.findIndex(
    level => CURRENT_POINTS >= level.min && CURRENT_POINTS <= level.max,
  );
  const currentLevel = LEVELS[currentIndex] ?? LEVELS[0];
  const nextLevel = LEVELS[currentIndex + 1];
  const pointsToNext = nextLevel ? nextLevel.min - CURRENT_POINTS : 0;
  const progress = nextLevel ? Math.min(CURRENT_POINTS / nextLevel.min, 1) : 1;

  return (
    <View style={IncentivesStyles.container}>
      <ScrollView
        style={IncentivesStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={IncentivesStyles.scrollContent}>
        <Text style={IncentivesStyles.screenTitle}>Niveles</Text>
        <Text style={IncentivesStyles.screenSubtitle}>
          Suma puntos reciclando y sube de nivel
        </Text>

        <View style={IncentivesStyles.currentCard}>
          <View style={IncentivesStyles.currentIcon}>
            <Icon name={currentLevel.icon} size={22} color={colors.white} />
          </View>
          <Text style={IncentivesStyles.currentLabel}>Estás en</Text>
          <Text style={IncentivesStyles.currentName}>{currentLevel.name}</Text>
          <Text style={IncentivesStyles.currentPoints}>
            {formatPoints(CURRENT_POINTS)} pts
          </Text>

          <View style={IncentivesStyles.progressTrack}>
            <View style={[IncentivesStyles.progressFill, {width: `${progress * 100}%`}]} />
          </View>

          {nextLevel ? (
            <Text style={IncentivesStyles.progressHint}>
              Te faltan {formatPoints(pointsToNext)} pts para {nextLevel.name}
            </Text>
          ) : (
            <Text style={IncentivesStyles.progressHint}>Alcanzaste el nivel más alto</Text>
          )}
        </View>

        <Text style={IncentivesStyles.sectionTitle}>El camino</Text>

        {LEVELS.map((level, index) => {
          const isCurrent = index === currentIndex;
          const isUnlocked = index < currentIndex;
          const isLast = index === LEVELS.length - 1;

          return (
            <View key={level.name} style={IncentivesStyles.levelRow}>
              <View style={IncentivesStyles.track}>
                <View
                  style={[
                    IncentivesStyles.dot,
                    isUnlocked && IncentivesStyles.dotUnlocked,
                    isCurrent && IncentivesStyles.dotCurrent,
                  ]}>
                  <Icon
                    name={isUnlocked ? 'check' : level.icon}
                    size={isCurrent ? 14 : 12}
                    color={isUnlocked || isCurrent ? colors.white : colors.gray}
                  />
                </View>
                {!isLast && (
                  <View
                    style={[
                      IncentivesStyles.line,
                      isUnlocked && IncentivesStyles.lineUnlocked,
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  IncentivesStyles.levelCard,
                  isCurrent && IncentivesStyles.levelCardCurrent,
                  !isCurrent && !isUnlocked && IncentivesStyles.levelCardLocked,
                ]}>
                <View style={IncentivesStyles.levelHeader}>
                  <Text
                    style={[
                      IncentivesStyles.levelName,
                      !isCurrent && !isUnlocked && IncentivesStyles.levelNameLocked,
                    ]}>
                    {level.name}
                  </Text>
                  {isCurrent && (
                    <View style={IncentivesStyles.hereBadge}>
                      <Text style={IncentivesStyles.hereBadgeText}>Actual</Text>
                    </View>
                  )}
                  {index === currentIndex + 1 && (
                    <View style={IncentivesStyles.nextBadge}>
                      <Text style={IncentivesStyles.nextBadgeText}>Siguiente</Text>
                    </View>
                  )}
                </View>
                <Text style={IncentivesStyles.levelRange}>{formatRange(level, isLast)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Incentives;
