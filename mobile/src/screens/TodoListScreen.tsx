import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'TodoList'>;

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const API_URL = 'http://10.0.2.2:3000'; // Use 10.0.2.2 for Android emulator, localhost for iOS

const TodoListScreen: React.FC<Props> = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const config = await getAuthHeader();
      const response = await axios.get(`${API_URL}/api/todos`, config);
      setTodos(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', 'Failed to fetch todos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    setIsLoading(true);
    try {
      const config = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/api/todos`,
        { title: newTodo },
        config
      );
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', 'Failed to add todo');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const config = await getAuthHeader();
      await axios.put(
        `${API_URL}/api/todos/${todo._id}`,
        { completed: !todo.completed },
        config
      );
      setTodos(
        todos.map((t) =>
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', 'Failed to update todo');
      }
    }
  };

  const handleUpdateTodo = async (todo: Todo, newTitle: string) => {
    if (!newTitle.trim()) {
      setEditingTodo(null);
      return;
    }

    try {
      const config = await getAuthHeader();
      await axios.put(
        `${API_URL}/api/todos/${todo._id}`,
        { title: newTitle },
        config
      );
      setTodos(
        todos.map((t) => (t._id === todo._id ? { ...t, title: newTitle } : t))
      );
      setEditingTodo(null);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', 'Failed to update todo');
      }
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    try {
      const config = await getAuthHeader();
      await axios.delete(`${API_URL}/api/todos/${todo._id}`, config);
      setTodos(todos.filter((t) => t._id !== todo._id));
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', 'Failed to delete todo');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      {editingTodo?._id === item._id ? (
        <TextInput
          style={styles.editInput}
          value={editingTodo.title}
          onChangeText={(text) =>
            setEditingTodo({ ...editingTodo, title: text })
          }
          onBlur={() => handleUpdateTodo(item, editingTodo.title)}
          autoFocus
        />
      ) : (
        <TouchableOpacity
          style={styles.todoTextContainer}
          onPress={() => handleToggleTodo(item)}
          onLongPress={() => setEditingTodo(item)}
        >
          <Text
            style={[
              styles.todoText,
              item.completed && styles.completedTodoText,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodo(item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && todos.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTodo}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading ? '...' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={styles.list}
        refreshing={isLoading}
        onRefresh={fetchTodos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    minWidth: 60,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#000',
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    color: '#8e8e93',
  },
  editInput: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    color: '#000',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
});

export default TodoListScreen;
