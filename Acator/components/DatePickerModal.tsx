import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";

interface Props {
  visible: boolean;
  value: string; // YYYY-MM-DD
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
}: Props) {
  const initial = value ? new Date(value + "T12:00:00") : new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const [selected, setSelected] = useState(value || "");

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const handleDay = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    setSelected(`${year}-${mm}-${dd}`);
  };

  const isSelected = (day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return selected === `${year}-${mm}-${dd}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Month nav */}
          <View style={styles.nav}>
            <TouchableOpacity onPress={prevMonth} hitSlop={10}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={10}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map((d) => (
              <Text key={d} style={styles.dayHeader}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.grid}>
            {cells.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.cell,
                  day && isSelected(day) && styles.cellSelected,
                  day && isToday(day) && !isSelected(day) && styles.cellToday,
                ]}
                onPress={() => day && handleDay(day)}
                activeOpacity={day ? 0.7 : 1}
              >
                {day ? (
                  <Text
                    style={[
                      styles.cellText,
                      isSelected(day) && styles.cellTextSelected,
                      isToday(day) && !isSelected(day) && styles.cellTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !selected && styles.confirmBtnDisabled,
              ]}
              onPress={() => selected && onConfirm(selected)}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const CELL = 40;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 340,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthLabel: { fontSize: 16, fontWeight: "500", color: Colors.textPrimary },
  dayHeaders: { flexDirection: "row", marginBottom: 4 },
  dayHeader: {
    width: CELL,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textTertiary,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CELL / 2,
  },
  cellSelected: { backgroundColor: Colors.teal },
  cellToday: { borderWidth: 1.5, borderColor: Colors.teal },
  cellText: { fontSize: 14, color: Colors.textPrimary },
  cellTextSelected: { color: "#fff", fontWeight: "500" },
  cellTextToday: { color: Colors.teal, fontWeight: "500" },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "500", color: Colors.textSecondary },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.teal,
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: Colors.textTertiary },
  confirmText: { fontSize: 14, fontWeight: "500", color: "#fff" },
});
