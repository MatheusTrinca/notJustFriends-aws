import React, { useEffect, useState } from 'react';
import FeedPost from '../components/FeedPost';
import { FlatList, Image, Pressable, StyleSheet, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { Post } from '../models';

const FeedScreen = () => {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    DataStore.query(Post).then(setPosts);
  }, []);

  const createPost = () => {
    navigation.navigate('CreatePost');
  };

  const img =
    'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png';

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <FeedPost post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <Pressable onPress={createPost} style={styles.header}>
          <Image source={{ uri: img }} style={styles.profileImage} />
          <Text style={styles.name}>What's on your mind?</Text>
          <Entypo
            name="images"
            size={24}
            color="limegreen"
            style={styles.icon}
          />
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    color: 'gray',
  },
  icon: {
    marginLeft: 'auto',
  },
});

export default FeedScreen;
