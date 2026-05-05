import React, {ReactElement, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconFont from 'react-native-vector-icons/FontAwesome5';
import {Calendar, DateData} from 'react-native-calendars';
import {colors, fontFamily, shadows} from '../../utils/constants';

const {width} = Dimensions.get('window');

import useWasteTypeStore from '../../store/wasteTypeStore';
import useOrderStore from '../../store/orderStore';
import { WasteType } from '../../types/wasteType.types';

interface AddedWasteItem {
  id: string;
  wasteType: WasteType;
  weight: number;
}

/**
 * @component WastePickup
 * @return {ReactElement} - React component
 */
const WastePickupScreen = (): ReactElement => {
  const { wasteTypes, error: wasteTypesError, getWasteTypes } = useWasteTypeStore();
  const { loading: orderLoading, submitOrder } = useOrderStore();

  useEffect(() => {
    getWasteTypes();
  }, [getWasteTypes]);

  const [weight, setWeight] = useState<number>(0);
  const [addedWasteItems, setAddedWasteItems] = useState<AddedWasteItem[]>([]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const toggleWasteType = (id: string) => {
    // Usar el store para actualizar el estado localmente
    useWasteTypeStore.setState(state => ({
      wasteTypes: state.wasteTypes.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    }));
  };

  const incrementWeight = () => {
    if (weight < 5) {
      setWeight(prev => prev + 1);
    } else {
      Alert.alert(
        'Peso máximo alcanzado',
        'Si piensa que es más de 5 se colocará más de cinco',
      );
    }
  };

  const decrementWeight = () => {
    if (weight > 0) {
      setWeight(prev => prev - 1);
    }
  };

  const addWasteItem = () => {
    const selectedTypes = wasteTypes.filter(item => item.selected);
    if (selectedTypes.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un tipo de residuo');
      return;
    }
    if (weight === 0) {
      Alert.alert('Error', 'Selecciona el peso de los residuos');
      return;
    }

    // Agregar cada tipo seleccionado como un elemento separado
    const newItems: AddedWasteItem[] = selectedTypes.map(wasteType => ({
      id: `${Date.now()}-${wasteType.id}`,
      wasteType,
      weight,
    }));

    setAddedWasteItems(prev => [...prev, ...newItems]);
    // Reset selections después de agregar
    useWasteTypeStore.setState(state => ({
      wasteTypes: state.wasteTypes.map(item => ({ ...item, selected: false }))
    }));
    setWeight(0);
  };

  const removeWasteItem = (id: string) => {
    setAddedWasteItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    if (addedWasteItems.length === 0) {
      Alert.alert('Residuos requeridos', 'Agrega al menos un tipo de residuo a la lista antes de continuar.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Fecha requerida', 'Selecciona una fecha de recogida en el calendario antes de continuar.');
      return;
    }

    const orderPayload = {
      latitude: 0,
      longitude: 0,
      date: selectedDate
        ? `${selectedDate} 00:00:00`
        : new Date().toISOString().slice(0, 19).replace('T', ' '),
      state_id: 1,
    };

    const items = addedWasteItems.map(item => ({
      type_waste_id: Number(item.wasteType.id),
      weight: item.weight,
      points: item.wasteType.points * item.weight,
    }));

    const success = await submitOrder(orderPayload, items);

    if (success) {
      const totalWeight = addedWasteItems.reduce((sum, item) => sum + item.weight, 0);
      const itemsList = addedWasteItems.map(item => `${item.wasteType.name}: ${item.weight} kg`).join('\n');
      Alert.alert(
        'Solicitud guardada',
        `Se ha guardado la solicitud de recogida:\n\n${itemsList}\n\nPeso total: ${totalWeight} kg`,
        [{
          text: 'OK',
          onPress: () => {
            setAddedWasteItems([]);
            setSelectedDate('');
            useWasteTypeStore.setState(state => ({
              wasteTypes: state.wasteTypes.map((w: WasteType) => ({ ...w, selected: false })),
            }));
            setWeight(0);
          },
        }],
      );
    } else {
      Alert.alert('Error', 'No se pudo guardar la solicitud. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!orderLoading}
        pointerEvents={orderLoading ? 'none' : 'auto'}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitud de Recogida</Text>
        <Text style={styles.subtitle}>
          Completa los detalles para programar la recogida de residuos
        </Text>
      </View>

      {/* Waste Types Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona los tipos de residuos:</Text>
        {wasteTypesError ? (
          <Text style={{ color: colors.error, marginBottom: 12 }}>{wasteTypesError}</Text>
        ) : (
          <View style={styles.wasteTypesContainer}>
            {wasteTypes.map(waste => (
              <TouchableOpacity
                key={waste.id}
                style={[
                  styles.wasteTypeCard,
                  waste.selected && styles.wasteTypeCardSelected,
                ]}
                onPress={() => toggleWasteType(waste.id)}>
                <Icon
                  name={waste.icon}
                  size={24}
                  color={waste.selected ? colors.white : colors.primary}
                />
                <Text
                  style={[
                    styles.wasteTypeName,
                    waste.selected && styles.wasteTypeNameSelected,
                  ]}>
                  {waste.name}
                </Text>
                {waste.selected && (
                  <View style={styles.checkmark}>
                    <Icon name="check" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Weight Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Selecciona el peso (0-5 kg):
        </Text>
        <View style={styles.weightContainer}>
          <TouchableOpacity
            style={styles.weightButton}
            onPress={decrementWeight}>
            <Icon name="minus" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.weightDisplay}>
            <Text style={styles.weightNumber}>{weight}</Text>
            <Text style={styles.weightUnit}>kg</Text>
          </View>
          <TouchableOpacity style={styles.weightButton} onPress={incrementWeight}>
            <Icon name="plus" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        {/* Add Item Button */}
        <TouchableOpacity style={styles.addItemButton} onPress={addWasteItem}>
          <IconFont name="plus-circle" size={20} color={colors.white} />
          <Text style={styles.addItemButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Added Items List */}
      {addedWasteItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elementos agregados:</Text>
          {addedWasteItems.map(item => (
            <View key={item.id} style={styles.addedItemCard}>
              <View style={styles.addedItemInfo}>
                <Icon
                  name={item.wasteType.icon}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.addedItemName}>{item.wasteType.name}</Text>
                <Text style={styles.addedItemWeight}>{item.weight} kg</Text>
              </View>
              <TouchableOpacity
                style={styles.removeItemButton}
                onPress={() => removeWasteItem(item.id)}>
                <Icon name="trash" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.totalWeightContainer}>
            <Text style={styles.totalWeightText}>
              Peso total: {addedWasteItems.reduce((sum, item) => sum + item.weight, 0)} kg
            </Text>
          </View>
        </View>
      )}

      {/* Additional Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información adicional</Text>
        <Text style={styles.description}>
          Los puntos se calculan dependiendo de los residuos seleccionados
        </Text>
        <Text style={styles.note}>
          Estos puntos pueden variar cuando sean confirmados por el recolector
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setShowCalendar(!showCalendar)}>
          <Icon name="calendar-alt" size={20} color={colors.primary} />
          <Text style={styles.calendarButtonText}>
            {selectedDate ? `Fecha: ${selectedDate}` : 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={
                selectedDate
                  ? {[selectedDate]: {selected: true, selectedColor: colors.primary}}
                  : {}
              }
              minDate={new Date().toISOString().slice(0, 10)}
              theme={{
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                textDayFontFamily: fontFamily.fontFamilyRegular,
                textMonthFontFamily: fontFamily.fontFamilySemiBold,
                textDayHeaderFontFamily: fontFamily.fontFamilyMedium,
              }}
            />
          </View>
        )}
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={orderLoading}>
          <Icon name={orderLoading ? 'spinner' : 'save'} size={20} color={colors.white} />
          <Text style={styles.submitButtonText}>{orderLoading ? 'Guardando...' : 'Guardar Solicitud'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Loading Overlay */}
      {orderLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Guardando solicitud...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50, // Add top padding for status bar
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  wasteTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wasteTypeCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
    position: 'relative',
    ...shadows.medium,
  },
  wasteTypeCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  wasteTypeName: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  wasteTypeNameSelected: {
    color: colors.white,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 8,
    ...shadows.medium,
  },
  weightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  weightDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    minWidth: 80,
  },
  weightNumber: {
    fontSize: 32,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
  },
  weightUnit: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.gray,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.small,
  },
  calendarButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.primary,
    marginLeft: 8,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.medium,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    ...shadows.medium,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
    marginLeft: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    ...shadows.small,
  },
  addItemButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.white,
    marginLeft: 8,
  },
  addedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.small,
  },
  addedItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addedItemName: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  addedItemWeight: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
    marginRight: 12,
  },
  removeItemButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  totalWeightContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  totalWeightText: {
    fontSize: 18,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.primary,
  },
  bottomSpacing: {
    height: 120, // Space for the tab bar
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  loadingBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 16,
    ...shadows.medium,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fontFamily.fontFamilySemiBold,
    color: colors.text,
    marginTop: 8,
  },
});

export const WastePickup = WastePickupScreen;
