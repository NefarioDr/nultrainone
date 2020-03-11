import Toast from 'react-native-root-toast';
import {Alert} from 'react-native';
import I18n from '../../resources/languages/I18n';

export function ToastLong(message) {
  Toast.show(message, {
    duration: Toast.durations.LONG, // toast显示时长
    position: Toast.positions.CENTER, // toast位置
    shadow: true, // toast是否出现阴影
    animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
    hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
    delay: 0, // toast显示的延时
    onShow: () => {
      // toast出现回调（动画开始时）
    },
    onShown: () => {
      // toast出现回调（动画结束时）
    },
    onHide: () => {
      // toast隐藏回调（动画开始时）
    },
    onHidden: () => {
      // toast隐藏回调（动画结束时）
    },
  });
}

export function ToastShort(message) {
  Toast.show(message, {
    duration: Toast.durations.SHORT, // toast显示时长
    position: Toast.positions.CENTER, // toast位置
    shadow: true, // toast是否出现阴影
    animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
    hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
    delay: 0, // toast显示的延时
    onShow: () => {
      // toast出现回调（动画开始时）
    },
    onShown: () => {
      // toast出现回调（动画结束时）
    },
    onHide: () => {
      // toast隐藏回调（动画开始时）
    },
    onHidden: () => {
      // toast隐藏回调（动画结束时）
    },
  });
}

export function OkButtonAlert(title, message, onOkPress) {
  Alert.alert(
    title,
    message,
    [
      {
        text: I18n.t('btn.ok'),
        onPress: () => {
          if (onOkPress) {
            onOkPress();
          }
        },
      },
    ],
    {cancelable: false},
  );
}

export function OkCancelButtonAlert(title, message, onOkPress, onCancelPress) {
  Alert.alert(
    title,
    message,
    [
      {
        text: I18n.t('btn.cancel'),
        onPress: () => {
          if (onCancelPress) {
            onCancelPress();
          }
        },
      },
      {
        text: I18n.t('btn.ok'),
        onPress: () => {
          if (onOkPress) {
            onOkPress();
          }
        },
      },
    ],
    {cancelable: false},
  );
}
