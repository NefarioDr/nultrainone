import RNFetchBlob from 'react-native-fetch-blob';
import I18n from '../../resources/languages/I18n';
import {
  CameraRoll as CameraRollIOS,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import CameraRollAndroid from 'react-native-camera-roll-android';

var CameraRoll;
if (Platform.OS === 'android') {
  CameraRoll = CameraRollAndroid;
} else {
  CameraRoll = CameraRollIOS;
}

/**
 * 保存网络图片到相册
 * @param imageUrl 图片url
 */
const saveImageAlbum = imageUrl => {
  if (imageUrl.length > 0) {
    return new Promise((resolve, reject) => {
      return RNFetchBlob.config({
        // add this option that makes response Data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        appendExt: 'png',
      })
        .fetch('GET', imageUrl, {
          //some headers ..
        })
        .then(async res => {
          // the temp file path
          let url = '';
          if (Platform.OS === 'ios') {
            url = imageUrl;

            CameraRoll.saveToCameraRoll(url)
              .then(() => {
                resolve('success');
                deleteCacheImage(res.path());
              })
              .catch(err => {
                console.warn(err.toString());
                reject(err);
                deleteCacheImage(res.path());
              });
          } else {
            url = res.path();

            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: I18n.t('page.storagePermissionTitle'),
                message: I18n.t('page.storagePermissionMessage'),
                buttonNeutral: I18n.t('page.storagePermissionLater'),
                buttonNegative: I18n.t('btn.cancel'),
                buttonPositive: I18n.t('btn.ok'),
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the camera');
              CameraRoll.saveToCameraRoll(url)
                .then(() => {
                  resolve('success');
                  deleteCacheImage(res.path());
                })
                .catch(err => {
                  console.warn(err.toString());
                  reject(err);
                  deleteCacheImage(res.path());
                });
            } else {
              console.log('Camera permission denied');
            }
          }
        })
        .catch(error => {
          console.log('get():Error Stack: ' + error.stack);
          reject(error);
        });
    });
  }
};

/**
 * 保存本地图片到相册
 */
const saveLocalImageAlbum = async localUrl => {
  if (localUrl.length > 0) {
    if (Platform.OS === 'ios') {
      CameraRoll.saveToCameraRoll(localUrl)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.warn(err.toString());
        });
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: I18n.t('page.storagePermissionTitle'),
          message: I18n.t('page.storagePermissionMessage'),
          buttonNeutral: I18n.t('page.storagePermissionLater'),
          buttonNegative: I18n.t('btn.cancel'),
          buttonPositive: I18n.t('btn.ok'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        CameraRoll.saveToCameraRoll(localUrl)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.warn(err.toString());
          });
      } else {
        console.log('Camera permission denied');
      }
    }
  }
};

/**
 * 删除缓存图片
 * @param path
 */
const deleteCacheImage = path => {
  RNFetchBlob.fs.unlink(path).then(() => {
    // console.warn('Deleted successfully')
  });
};

export default {
  saveImageAlbum,
  deleteCacheImage,
  saveLocalImageAlbum,
};
