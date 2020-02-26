import {Alert, ToastAndroid, Platform} from 'react-native';
import I18n from '../../resources/languages/I18n';
const showShort = (content, isAlert) => {
  if (!content) {
    return;
  }
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(I18n.t('page.prompt'), content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.SHORT);
  }
};

const showLong = (content, isAlert) => {
  if (isAlert || Platform.OS === 'ios') {
    Alert.alert(I18n.t('page.prompt'), content.toString());
  } else {
    ToastAndroid.show(content.toString(), ToastAndroid.LONG);
  }
};

export default {
  showShort,
  showLong,
};
