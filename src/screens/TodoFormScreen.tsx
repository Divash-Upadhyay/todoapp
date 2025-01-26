import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

interface TodoFormScreenProps {
  id?: string;
}
type TodoFormScreenRouteProp = RouteProp<RootStackParamList, 'TodoForm'>;

const TodoFormScreen: React.FC = () => {
  const { addTodo, updateTodo, todos } = useTodos();
  const navigation = useNavigation();
  const route = useRoute<TodoFormScreenRouteProp>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isEditing = !!route.params?.id;

  useEffect(() => {
    if (isEditing) {
      const todo = todos.find((t) => t.id === route.params?.id);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setDueDate(todo.dueDate || '');
      }
    }
  }, [route.params?.id, todos]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title is required.');
      return;
    }

    if (isEditing) {
      updateTodo(route.params!.id!, { title, description, dueDate });
    } else {
      addTodo({ title, description, dueDate, isCompleted: false });
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Task' : 'Add Task'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (optional)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title={isEditing ? 'Update Task' : 'Add Task'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default TodoFormScreen;
