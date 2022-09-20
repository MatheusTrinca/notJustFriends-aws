import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import {
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import LikeImage from '../../../assets/images/like.png';
import { useNavigation } from '@react-navigation/native';

const FeedPost = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const navigation = useNavigation();

  const dummy_img =
    'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png';

  return (
    <View style={styles.post}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate('Profile', { id: post.postUserId })}
      >
        <Image
          source={{ uri: post.User?.image || dummy_img }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{post.User?.name}</Text>
          <Text style={styles.subtitle}>{post.createdAt}</Text>
        </View>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color="gray"
          style={styles.icon}
        />
      </Pressable>
      <Text style={styles.description}>{post.description}</Text>
      {post.image && (
        <Image
          style={styles.image}
          source={{ uri: post.image }}
          resizeMode="cover"
        />
      )}
      <View style={styles.footer}>
        {/* Status Row */}
        <View style={styles.statsRow}>
          <Image source={LikeImage} style={styles.likedIcon} />
          <Text style={styles.likedBy}>
            Elon Musk and {post.numberOfShares} others
          </Text>
          <Text style={styles.numberOfShares}>
            {post.numberOfShares} shares
          </Text>
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <AntDesign
              name="like2"
              size={18}
              color={isLiked ? 'royalblue' : 'gray'}
            />
            <Text
              style={[
                styles.iconButtonText,
                { color: isLiked ? 'royalblue' : 'gray' },
              ]}
            >
              Like
            </Text>
          </Pressable>

          {/* Comment button */}
          <View style={styles.iconButton}>
            <FontAwesome5 name="comment-alt" size={16} color="gray" />
            <Text style={styles.iconButtonText}>Comment</Text>
          </View>

          {/* Share button */}
          <View style={styles.iconButton}>
            <MaterialCommunityIcons
              name="share-outline"
              size={18}
              color="gray"
            />
            <Text style={styles.iconButtonText}>Share</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: '500',
  },
  subtitle: {
    color: 'gray',
  },
  icon: {
    marginLeft: 'auto',
  },

  // Body
  description: {
    lineHeight: 20,
    padding: 10,
    letterSpacing: 0.3,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginTop: 10,
  },

  // Footer
  footer: {
    paddingHorizontal: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  likedIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },

  likedBy: {
    color: 'gray',
  },

  numberOfLikes: {
    color: 'gray',
  },
  numberOfShares: {
    marginLeft: 'auto',
    color: 'gray',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },

  iconButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  iconButtonText: {
    color: 'gray',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default FeedPost;
