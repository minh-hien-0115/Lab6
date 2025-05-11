import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { firestore, auth } from '../../firebase/firebaseConfig';

const ListFinishScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (userId) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .where('completed', '==', true)
        .onSnapshot(
          (querySnapshot) => {
            const tasksData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTasks(tasksData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching tasks: ", error);
            setLoading(false);
          }
        );

      // Cleanup function when the component is unmounted
      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Công việc đã hoàn thành</Text>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>Không có công việc nào đã hoàn thành</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  task: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 10,
  },
  taskTitle: { fontWeight: 'bold', fontSize: 16 }, // Title style remains as it is
  taskDescription: { fontSize: 14, marginTop: 4 }, // Adjusted to smaller font size
  emptyText: { textAlign: 'center', marginTop: 16, fontSize: 14 }, // Adjusted to smaller font size
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ListFinishScreen;