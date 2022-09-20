import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../models';
import { Auth, DataStore, Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { S3Image } from 'aws-amplify-react-native';

const dummy_img =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png';

const CreatePostScreen = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const onSubmit = async () => {
    const userData = await Auth.currentAuthenticatedUser();

    const newPost = {
      description,
      //image,
      numberOfLikes: 0,
      numberOfShares: 0,
      postUserId: userData.attributes.sub,
      _version: 1,
    };

    if (image) {
      newPost.image = await uploadFile(image);
    }

    await DataStore.save(new Post(newPost));

    setDescription('');
    setImage(null);
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadFile = async fileUri => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;
      await Storage.put(key, blob, {
        contentType: 'image/png', // contentType is optional
      });
      return key;
    } catch (err) {
      console.log('Error uploading file:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { marginBottom: insets.bottom }]}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={120}
    >
      <View style={styles.header}>
        {user?.image ? (
          <S3Image imgKey={user.image} style={styles.profileImage} />
        ) : (
          <Image source={{ uri: dummy_img }} style={styles.profileImage} />
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Entypo
          onPress={pickImage}
          name="images"
          size={24}
          color="limegreen"
          style={styles.icon}
        />
      </View>
      <TextInput
        placeholder="What is in your mind?"
        multiline
        onChangeText={setDescription}
        value={description}
      />

      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.buttonContainer}>
        <Button title="Post" onPress={onSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: '400',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  icon: {
    marginLeft: 'auto',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
});
