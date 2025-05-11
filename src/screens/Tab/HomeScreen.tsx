import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfig';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  description?: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);  // Trạng thái để biết modal có ở chế độ chỉnh sửa không

  const fetchTasks = () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    return firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot && snapshot.docs) {
            const data: Task[] = snapshot.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as Omit<Task, 'id'>),
            }));
            setTasks(data);
          }
        },
        error => {
          console.error('Error fetching tasks:', error);
        }
      );
  };

  const toggleComplete = async (task: Task) => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(task.id)
      .update({ completed: !task.completed });
  };

  const deleteTask = (task: Task) => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc muốn xoá công việc này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(task.id)
                .delete();
              setLastDeletedTask(task);

              const timeout = setTimeout(() => {
                setLastDeletedTask(null);
              }, 10000);

              setUndoTimeout(timeout);
            } catch (error) {
              console.error('Lỗi khi xoá công việc:', error);
            }
          },
        },
      ]
    );
  };

  const undoDelete = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId || !lastDeletedTask) return;

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(lastDeletedTask.id)
        .set({
          title: lastDeletedTask.title,
          completed: lastDeletedTask.completed,
          createdAt: lastDeletedTask.createdAt,
        });
      if (undoTimeout) clearTimeout(undoTimeout);
      setLastDeletedTask(null);
    } catch (error) {
      console.error('Lỗi khi hoàn tác:', error);
    }
  };

  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || '');
    Alert.alert(
      'Chi tiết công việc',
      `Tiêu đề: ${task.title}\nMô tả: ${task.description || 'Chưa có mô tả'}`,
      [
        {
          text: 'Hủy',
          onPress: () => {
            setIsModalVisible(false);
            setIsEditing(false);  // Đảm bảo trạng thái là không chỉnh sửa
            setNewTitle(task.title);  // Đảm bảo tiêu đề không bị thay đổi
            setNewDescription(task.description || '');  // Đảm bảo mô tả không bị thay đổi
          },
        },
        {
          text: 'Sửa',
          onPress: () => {
            setIsModalVisible(true);
            setIsEditing(true);  // Chuyển modal sang chế độ chỉnh sửa
          },
        },
      ]
    );
  };

  const handleSaveEdit = async () => {
    if (!selectedTask) return;

    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(selectedTask.id)
        .update({
          title: newTitle,
          description: newDescription,
        });

      setIsModalVisible(false);  // Đóng modal sau khi lưu
      setIsEditing(false);  // Đảm bảo modal không còn ở chế độ chỉnh sửa
    } catch (error) {
      console.error('Lỗi khi cập nhật công việc:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchTasks();
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách công việc</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onLongPress={() => deleteTask(item)}
            onPress={() => showTaskDetails(item)}  // Hiển thị chi tiết công việc khi nhấn vào
          >
            <Text
              style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}
            >
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Icon
                name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={item.completed ? 'green' : 'gray'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 16 }}>Chưa có công việc nào</Text>
        }
      />

      {lastDeletedTask && (
        <View style={styles.undoContainer}>
          <Text>Đã xoá “{lastDeletedTask.title}”</Text>
          <TouchableOpacity onPress={undoDelete}>
            <Text style={styles.undoText}>HOÀN TÁC</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal để chỉnh sửa công việc */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.header}>
            {isEditing ? 'Chỉnh sửa công việc' : 'Chi tiết công việc'}
          </Text>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="Tiêu đề công việc"
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Mô tả công việc"
                multiline
              />
              <View style={styles.modalButtonsContainer}>
                <Button title="Hủy" onPress={() => {
                  setIsModalVisible(false);
                  setIsEditing(false);
                  setNewTitle(selectedTask?.title || '');  // Reset title
                  setNewDescription(selectedTask?.description || '');  // Reset description
                }} />
                <View style={styles.buttonSpacer} />
                <Button title="Lưu" onPress={handleSaveEdit} />
              </View>
            </>
          ) : (
            <View>
              <Text style={styles.taskText}>Tiêu đề: {selectedTask?.title}</Text>
              <Text style={styles.taskText}>
                Mô tả: {selectedTask?.description || 'Chưa có mô tả'}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  undoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffeeba',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  undoText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonSpacer: {
    width: 10,
  },
});




// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { auth, firestore } from '../../firebase/firebaseConfig';
// import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// interface Task {
//   id: string;
//   title: string;
//   completed: boolean;
//   createdAt: FirebaseFirestoreTypes.Timestamp;
//   description?: string;  // Thêm mô tả công việc nếu cần
// }

// const HomeScreen = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
//   const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

//   const fetchTasks = () => {
//     const userId = auth().currentUser?.uid;
//     if (!userId) return;

//     return firestore()
//       .collection('users')
//       .doc(userId)
//       .collection('tasks')
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(
//         snapshot => {
//           if (snapshot && snapshot.docs) {
//             const data: Task[] = snapshot.docs.map(doc => ({
//               id: doc.id,
//               ...(doc.data() as Omit<Task, 'id'>),
//             }));
//             setTasks(data);
//           }
//         },
//         error => {
//           console.error('Error fetching tasks:', error);
//         }
//       );
//   };

//   const toggleComplete = async (task: Task) => {
//     const userId = auth().currentUser?.uid;
//     if (!userId) return;

//     await firestore()
//       .collection('users')
//       .doc(userId)
//       .collection('tasks')
//       .doc(task.id)
//       .update({ completed: !task.completed });
//   };

//   const deleteTask = (task: Task) => {
//     const userId = auth().currentUser?.uid;
//     if (!userId) return;

//     Alert.alert(
//       'Xác nhận xoá',
//       'Bạn có chắc muốn xoá công việc này?',
//       [
//         { text: 'Huỷ', style: 'cancel' },
//         {
//           text: 'Xoá',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await firestore()
//                 .collection('users')
//                 .doc(userId)
//                 .collection('tasks')
//                 .doc(task.id)
//                 .delete();
//               setLastDeletedTask(task);

//               const timeout = setTimeout(() => {
//                 setLastDeletedTask(null);
//               }, 10000);

//               setUndoTimeout(timeout);
//             } catch (error) {
//               console.error('Lỗi khi xoá công việc:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const undoDelete = async () => {
//     const userId = auth().currentUser?.uid;
//     if (!userId || !lastDeletedTask) return;

//     try {
//       await firestore()
//         .collection('users')
//         .doc(userId)
//         .collection('tasks')
//         .doc(lastDeletedTask.id)
//         .set({
//           title: lastDeletedTask.title,
//           completed: lastDeletedTask.completed,
//           createdAt: lastDeletedTask.createdAt,
//         });
//       if (undoTimeout) clearTimeout(undoTimeout);
//       setLastDeletedTask(null);
//     } catch (error) {
//       console.error('Lỗi khi hoàn tác:', error);
//     }
//   };

//   const showTaskDetails = (task: Task) => {
//     Alert.alert(
//       'Chi tiết công việc',
//       `Tiêu đề: ${task.title}\nMô tả: ${task.description || 'Không có mô tả'}\nTrạng thái: ${task.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`,
//       [{ text: 'OK', style: 'cancel' }]
//     );
//   };

//   useEffect(() => {
//     const unsubscribe = fetchTasks();
//     return () => unsubscribe && unsubscribe();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Danh sách công việc</Text>

//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.taskItem}
//             onLongPress={() => deleteTask(item)}
//             onPress={() => showTaskDetails(item)}  // Hiển thị chi tiết công việc khi nhấn vào
//           >
//             <Text
//               style={[
//                 styles.taskText,
//                 { textDecorationLine: item.completed ? 'line-through' : 'none' },
//               ]}
//             >
//               {item.title}
//             </Text>
//             <TouchableOpacity onPress={() => toggleComplete(item)}>
//               <Icon
//                 name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
//                 size={24}
//                 color={item.completed ? 'green' : 'gray'}
//               />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', marginTop: 16 }}>
//             Chưa có công việc nào
//           </Text>
//         }
//       />

//       {lastDeletedTask && (
//         <View style={styles.undoContainer}>
//           <Text>Đã xoá “{lastDeletedTask.title}”</Text>
//           <TouchableOpacity onPress={undoDelete}>
//             <Text style={styles.undoText}>HOÀN TÁC</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   taskItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   taskText: {
//     marginLeft: 10,
//     fontSize: 16,
//     flex: 1,
//   },
//   undoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffeeba',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   undoText: {
//     color: '#007bff',
//     fontWeight: 'bold',
//   },
// });