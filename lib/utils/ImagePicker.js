import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Permissions from './Permissions';

const options = {
  quality: 0.8,
  noData: true,
  skipProcessing: true,
  selectionLimit: 3
};

export default {
  // function to launchCamera and return image
  launchCamera: types =>
    new Promise(async (resolve, reject) => {
      // ask permission for camera usage
      await Permissions.requestPermissions('camera');
      launchCamera({ ...options, mediaType: types }, (response) => {
        if (response.error) {
          reject(response.error);
        } else if (!response.customButton && !response.didCancel) {
          resolve(response.assets);
        }
      });
    }),

  // function to launchGallery and return image
  launchLibrary: types =>
    new Promise(async (resolve, reject) => {
      // ask permission for library usage
      await Permissions.requestPermissions('library');
      launchImageLibrary({ ...options, mediaType: types }, async (response) => {
        if (response.error) {
          reject(response.error);
        } else if (!response.customButton && !response.didCancel) {
          resolve(response.assets);
        }
      });
    })
};
