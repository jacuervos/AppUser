import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Calendar, DateData} from 'react-native-calendars';
import {colors, fontFamily, shadows} from '../utils/constants';

interface PickupDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

export const PickupDatePicker = ({selectedDate, onChange}: PickupDatePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setShowCalendar(current => !current)}>
        <Icon name="calendar-alt" size={20} color={colors.primary} />
        <Text style={styles.calendarButtonText}>
          {selectedDate ? `Fecha: ${selectedDate}` : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day: DateData) => {
              onChange(day.dateString);
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.medium,
  },
});
