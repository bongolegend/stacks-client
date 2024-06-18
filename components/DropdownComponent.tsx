// DropdownComponent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useQuery } from '@tanstack/react-query';
import { fetchGoals } from './api';
import { useUser } from './UserContext';

const DropdownComponent: React.FC<{ selectedGoal: string | null, setSelectedGoal: (value: string | null) => void }> = ({ selectedGoal, setSelectedGoal }) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Array<{ label: string; value: string }>>([]);

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => fetchGoals(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (goals) {
      const formattedGoals = goals.map((goal: { id: string; description: string }) => ({
        label: goal.description,
        value: goal.id,
      }));
      setItems(formattedGoals);
    }
  }, [goals]);

  return (
    <View style={styles.inputContainer}>
      {goalsLoading ? (
        <Text>Loading goals...</Text>
      ) : (
        <DropDownPicker
          open={open}
          value={selectedGoal}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedGoal}
          setItems={setItems}
          placeholder="Select a goal"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 16,
  },
  dropdown: {
    marginBottom: 16,
  },
  dropdownContainer: {
    marginTop: 16,
  },
});

export default DropdownComponent;
