import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

const AddScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [undoVisible, setUndoVisible] = useState(false);
  const [deletedField, setDeletedField] = useState<'title' | 'description' | null>(null);
  const [backupText, setBackupText] = useState('');
  const [titleError, setTitleError] = useState(false); // Trạng thái lỗi cho tiêu đề

  const handleAddTask = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId || !title.trim()) {
      setTitleError(true); // Nếu tiêu đề trống, đặt trạng thái lỗi thành true
      Alert.alert('Lỗi', 'Tiêu đề không được để trống');
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .add({
          title,
          description,
          completed: false,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Thành công', 'Đã thêm công việc mới');
      setTitle('');
      setDescription('');
      navigation.goBack();
    } catch (error: any) {
      console.error('Add task error:', error.message);
      Alert.alert('Lỗi', 'Không thể thêm công việc');
    }
  };

  const handleClear = (field: 'title' | 'description') => {
    const prev = field === 'title' ? title : description;
    setBackupText(prev);
    setDeletedField(field);
    if (field === 'title') setTitle('');
    if (field === 'description') setDescription('');
    setUndoVisible(true);

    setTimeout(() => setUndoVisible(false), 10000);
  };

  const handleUndo = () => {
    if (!deletedField) return;
    if (deletedField === 'title') setTitle(backupText);
    if (deletedField === 'description') setDescription(backupText);
    setUndoVisible(false);
    setDeletedField(null);
    setBackupText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thêm công việc mới</Text>

      {/* Tiêu đề */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            { borderColor: title.trim().length <= 0 ? 'red' : 'green' }, // Thay đổi màu viền dựa trên chiều dài tiêu đề
          ]}
          placeholder="Tiêu đề công việc"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            // Kiểm tra và cập nhật trạng thái lỗi mỗi khi thay đổi tiêu đề
            if (text.trim().length > 0) {
              setTitleError(false);
            } else {
              setTitleError(true); // Nếu tiêu đề rỗng, hiện lỗi
            }
          }}
        />
        {title.length > 0 && (
          <TouchableOpacity onPress={() => handleClear('title')}>
            <Icon name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Mô tả */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Mô tả chi tiết"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {description.length > 0 && (
          <TouchableOpacity onPress={() => handleClear('description')}>
            <Icon name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Nút thêm */}
      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Thêm công việc </Text>
          <Icon name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
        </View>
      </TouchableOpacity>

      {/* Thanh hoàn tác */}
      {undoVisible && (
        <TouchableOpacity style={styles.undoBar} onPress={handleUndo}>
          <View style={styles.undoContent}>
            <Text style={styles.undoText}>Đã xóa nội dung - Nhấn để hoàn tác</Text>
            <Icon name="arrow-undo" size={18} color="#856404" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  undoBar: {
    marginTop: 20,
    backgroundColor: '#ffeeba',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  undoText: {
    color: '#856404',
    fontWeight: 'bold',
  },
  undoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});