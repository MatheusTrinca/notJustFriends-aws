import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FeedPost from '../components/FeedPost';
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';
import { Auth, DataStore } from 'aws-amplify';
import { User, Post } from '../models';
import { useEffect, useState } from 'react';

const dummy_img =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png';
const bg = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg';

const profilePictureWidth = Dimensions.get('window').width * 0.4;

const ProfileScreenHeader = ({ user, isMe = false, route }) => {
  const navigation = useNavigation();

  const signOut = async () => {
    await Auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: bg }} style={styles.bg} />
      <Image source={{ uri: user?.image || dummy_img }} style={styles.image} />

      <Text style={styles.name}>{user.name}</Text>

      {isMe && (
        <>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: 'royalblue' }]}
            >
              <AntDesign name="pluscircle" size={16} color="white" />
              <Text style={[styles.buttonText, { color: 'white' }]}>
                Add to Story
              </Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('UpdateProfile')}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="black" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
            <Pressable
              onPress={signOut}
              style={[styles.button, { flex: 0, width: 50 }]}
            >
              <MaterialIcons name="logout" size={16} color="black" />
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.textLine}>
        <Entypo
          name="graduation-cap"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>Graduated university</Text>
      </View>

      <View style={styles.textLine}>
        <Ionicons name="time" size={18} color="gray" style={{ width: 25 }} />
        <Text>Joined on October 2013</Text>
      </View>

      <View style={styles.textLine}>
        <Entypo
          name="location-pin"
          size={18}
          color="gray"
          style={{ width: 25 }}
        />
        <Text>From Everywhere</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const route = useRoute();

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = route?.params?.id;
      if (!userId) return;
      const userDb = await DataStore.query(User, userId);
      setUser(userDb);
      const dbPosts = await DataStore.query(Post, p =>
        p.postUserId('eq', userId)
      );
      setPosts(dbPosts);
    };
    fetchData();
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  console.log(user);

  console.warn('User: ', route?.params?.id);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedPost post={item} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <>
          <ProfileScreenHeader user={user} isMe={true} />
          <Text style={styles.sectionTitle}>Posts</Text>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 10,
  },
  bg: {
    width: '100%',
    height: 200,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: -profilePictureWidth / 2,
  },
  image: {
    width: profilePictureWidth,
    aspectRatio: 1,
    borderRadius: 500,
    borderWidth: 5,
    borderColor: 'white',
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    marginVertical: 5,
  },
  buttonsContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: 'gainsboro',
    margin: 5,
    padding: 7,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    marginHorizontal: 5,
    fontWeight: '500',
  },
  textLine: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row',
  },
  sectionTitle: {
    marginLeft: 10,
    marginVertical: 5,
    fontWeight: '500',
    fontSize: 18,
  },
});

export default ProfileScreen;
