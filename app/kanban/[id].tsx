
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";

const KanbanDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>KanbanDetails: {id}</Text>
      <Link href="/">Go Back</Link>
    </View>
  );
};

export default KanbanDetails;

const styles = StyleSheet.create({});