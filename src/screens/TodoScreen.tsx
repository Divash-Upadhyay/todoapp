import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTodos } from "../context/TodoContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton, Menu } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const TodoScreen: React.FC = () => {
  const { todos, deleteTodo, toggleComplete } = useTodos();
  console.log("todos", todos);
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [sortBy, setSortBy] = useState<
    "dueDate" | "title" | "createdAt" | null
  >(null);
  const [filterBy, setFilterBy] = useState<"all" | "completed" | "pending">(
    "all"
  );

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filterBy === "completed") {
        return todo.isCompleted;
      } else if (filterBy === "pending") {
        return !todo.isCompleted;
      }
      return true; // 'all' shows all todos
    });
  }, [todos, filterBy]);

  // Sorting Todos (sorted after filtering)
  const sortedTodos = useMemo(() => {
    return filteredTodos.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          const dueA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dueB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dueA - dueB;
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
            const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return createdAtA - createdAtB;

        default:
          return 0;
      }
    });
  }, [filteredTodos, sortBy]);

  const handleLogout = async () => {
    logout(); // log the user out
    // navigation.navigate('Login');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.todoItem}>
      <View>
        <Text style={item.isCompleted ? styles.completedText : styles.todoText}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
      <View style={styles.actions}>
        {/* <Button
          title={item.isCompleted ? 'Undo' : 'Complete'}
          onPress={() => toggleComplete(item.id)}
        />
        <Button
          title="Edit"
          onPress={() => navigation.navigate('TodoForm', { id: item.id })}
        />
        <Button title="Delete" onPress={() => deleteTodo(item.id)} /> */}

        <TouchableOpacity onPress={() => toggleComplete(item.id)}>
          <Icon
            name={item.isCompleted ? "undo" : "check-circle"}
            size={24}
            color={item.isCompleted ? "gray" : "green"}
          />
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("TodoForm", { id: item.id })}
        >
          <Icon name="edit" size={24} color="#007bff" />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo Lists</Text>
     
      <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
        <View style={styles.sortContainer}>
          <Text>Sort By:</Text>
          <TouchableOpacity
            onPress={() => setSortBy("dueDate")}
            style={[styles.button, sortBy === "dueDate" && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                sortBy === "dueDate" && styles.activeText,
              ]}
            >
              Due Date
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("title")}
            style={[styles.button, sortBy === "title" && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                sortBy === "title" && styles.activeText,
              ]}
            >
              Title
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("createdAt")}
            style={[
              styles.button,
              sortBy === "createdAt" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                sortBy === "createdAt" && styles.activeText,
              ]}
            >
              created at
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <Text>Filter by:</Text>
          <Picker
            selectedValue={filterBy}
            onValueChange={(itemValue) => setFilterBy(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet!</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("TodoForm", { id: undefined })}
      >
        <Text style={styles.addButtonText}>+ Add Todos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f8ff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#f0f0f0", // Default button background color
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#007bff", // Active button background color
  },
  buttonText: {
    fontSize: 16,
    color: "#333", // Default text color
  },
  activeText: {
    color: "#fff", // Text color when the button is active
  },
  todoItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: { fontSize: 16 },
  completedText: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
  },
  description: { fontSize: 14, color: "gray" },
  actions: { flexDirection: "row", gap: 10 },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  picker: {
    width: "10%", // Ensure picker is wide enough to show options
    height: 50,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButtonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});

export default TodoScreen;
