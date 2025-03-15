import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { api } from '../services/api';

export default function UploadScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append('file', blob, 'selfie.jpg');
  
      const selfieRes = await api.post('/upload_selfie', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const selfie_filename = selfieRes.data.selfie_filename;
  
      const iconic_filename = '1.jpg';
  
      // génération Flashback
      const flashbackRes = await api.post('/generate_flashback', {
        selfie_filename,
        iconic_filename,
      });
  
      const flashback_image = flashbackRes.data.flashback_image;
  
      // Passe correctement la variable ici !
      navigation.navigate('Result', { flashback_image });
  
    } catch (error) {
      console.error('Erreur complète:', error);
      if (error.response) {
        console.error('Erreur réponse API:', error.response.data);
      }
    }
  };
  
  

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Button title="Choisir un selfie" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width:200, height:200, marginTop:20 }} />}
      {imageUri && <Button title="Générer mon flashback" onPress={uploadImage} />}
    </View>
  );
}
