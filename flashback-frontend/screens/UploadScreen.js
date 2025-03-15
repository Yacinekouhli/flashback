import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { api } from '../services/api';

export default function UploadScreen({ navigation, route }) {
  const [imageUri, setImageUri] = useState(null);

  // Récupère l'image iconique choisie (si on vient de l'écran "IconicSelectionScreen")
  // S'il n'y a pas de paramètre, on peut utiliser '1.jpg' en fallback ou un autre comportement
  const { iconicFilename } = route.params || {};
  console.log('Iconic filename reçu:', iconicFilename);

  const pickImage = async () => {
    // Lancement du sélecteur d'image
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    try {
      // On convertit l'URI locale en "blob" pour l'envoyer en FormData
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'selfie.jpg');

      // 1) Upload du selfie
      const selfieRes = await api.post('/upload_selfie', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const selfie_filename = selfieRes.data.selfie_filename;

      // 2) Appel du backend pour la génération du flashback
      // On transmet l'icône sélectionnée ou '1.jpg' par défaut
      const generateRes = await api.post('/generate_flashback', {
        selfie_filename,
        iconic_filename: iconicFilename || '1.jpg',
      });

      // 3) On récupère le nom de l'image finale
      const flashback_image = generateRes.data.flashback_image;

      // 4) Navigation vers l'écran de résultat
      navigation.navigate('Result', { flashback_image });
    } catch (error) {
      console.error('Erreur complète:', error);
      if (error.response) {
        console.error('Erreur réponse API:', error.response.data);
      }
      // Possibilité d’afficher une alerte ou un message d’erreur pour l’utilisateur
    }
  };

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Button title="Choisir un selfie" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}

      {imageUri && (
        <Button
          title="Générer mon flashback"
          onPress={uploadImage}
          // Tu pourrais désactiver le bouton si iconicFilename est vide, par exemple :
          // disabled={!iconicFilename}
        />
      )}
    </View>
  );
}
