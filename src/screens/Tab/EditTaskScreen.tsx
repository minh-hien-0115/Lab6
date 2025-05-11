import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfig';

const EditTaskScreen = ({ route, navigation }: any) => {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [completed, setCompleted] = useState(task.completed);

  const updateTask = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .update({
          title,
          description,
          completed,
        });
      navigation.goBack();  // Quay lại màn hình trước sau khi cập nhật thành công
    } catch (error) {
      console.error('Lỗi khi cập nhật công việc:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sửa công việc</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Tiêu đề"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả"
      />
      <Button
        title={completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu đã hoàn thành"}
        onPress={() => setCompleted(!completed)}
      />
      <Button title="Cập nhật" onPress={updateTask} />
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 8,
  },
});