import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Platform 
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/todos/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (error) {
      console.error('Failed to toggle todo', error);
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity 
      style={[
        styles.todoItem, 
        item.isCompleted && styles.completedTodo,
        { backgroundColor: getPriorityColor(item.priority) }
      ]}
      onPress={() => toggleTodo(item._id)}
    >
      <Text 
        style={[
          styles.todoText, 
          item.isCompleted && styles.completedText
        ]}
      >
        {item.title}
      </Text>
      {item.description && (
        <Text style={styles.todoDescription}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#feca57';
      case 'low': return '#48dbfb';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  todoItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  completedTodo: {
    opacity: 0.5,
  },
  todoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  todoDescription: {
    marginTop: 5,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default TodoList;
