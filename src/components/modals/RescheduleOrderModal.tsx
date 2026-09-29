import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {PickupDatePicker} from '../PickupDatePicker';
import {colors, fontFamily, shadows} from '../../utils/constants';
import {OrderHistoryItem} from '../../types/order.types';
import useOrderStore from '../../store/orderStore';

interface RescheduleOrderModalProps {
  visible: boolean;
  order: OrderHistoryItem | null;
  onClose: () => void;
}

const toDateInput = (value?: string) => {
  if (!value) {
    return '';
  }
  return value.slice(0, 10);
};

export const RescheduleOrderModal = ({
  visible,
  order,
  onClose,
}: RescheduleOrderModalProps) => {
  const {rescheduling, rescheduleOrder, fetchMyOrders, fetchMyOrderActive} = useOrderStore();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedDate(toDateInput(order?.date));
    }
  }, [visible, order]);

  const handleConfirm = async () => {
    if (!order) {
      return;
    }

    if (!selectedDate) {
      Alert.alert(
        'Fecha requerida',
        'Selecciona una fecha de recogida en el calendario antes de continuar.',
      );
      return;
    }

    const success = await rescheduleOrder(order.id, selectedDate);
    if (success) {
      onClose();
      Toast.show({
        type: 'success',
        text1: 'Orden reprogramada',
        text2: 'Se reprogramó la orden correctamente',
      });
      await fetchMyOrderActive();
      await fetchMyOrders();
      return;
    }

    Alert.alert('Error', 'No se pudo reprogramar la orden. Intenta nuevamente.');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Reprogramar orden</Text>
          <Text style={styles.subtitle}>
            {order ? `Orden #${order.id}` : 'Selecciona una nueva fecha'}
          </Text>

          <PickupDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={rescheduling}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={rescheduling}>
              {rescheduling ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.confirmButtonText}>Guardar fecha</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    ...shadows.medium,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fontFamily.fontFamilyRegular,
    color: colors.gray,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: fontFamily.fontFamilyMedium,
    color: colors.gray,
  },
  confirmButton: {
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: fontFamily.fontFamilyBold,
    color: colors.white,
  },
});
