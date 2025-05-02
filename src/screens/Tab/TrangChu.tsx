import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const dummyPosts = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '2 giờ trước',
    content: 'Hôm nay thời tiết thật đẹp 😍',
    image: 'https://source.unsplash.com/random/300x200?weather',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    time: '5 giờ trước',
    content: 'Đi chơi cuối tuần với bạn bè ✨',
    image: 'https://source.unsplash.com/random/300x200?friends',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    time: '1 ngày trước',
    content: 'Mình vừa mới học xong React Native 🧑‍💻',
    image: 'https://source.unsplash.com/random/300x200?coding',
  },
];

const PostItem = ({item}: {item: any}) => (
  <View style={styles.postContainer}>
    <View style={styles.header}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
    <Text style={styles.content}>{item.content}</Text>
    {item.image ? (
      <Image source={{uri: item.image}} style={styles.postImage} />
    ) : null}
    <View style={styles.actions}>
      <TouchableOpacity>
        <Text style={styles.actionText}>👍 Thích</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.actionText}>💬 Bình luận</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.actionText}>↪️ Chia sẻ</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const TrangChu = () => {
  return (
    <FlatList
      data={dummyPosts}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => <PostItem item={item} />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TrangChu;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f2f5',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
});