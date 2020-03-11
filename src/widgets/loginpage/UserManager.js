import AsyncStorage from '@react-native-community/async-storage';
import { Events } from '../../services/events';
import { DeviceEventEmitter } from 'react-native';

export const UserManager = {};

UserManager.save = async function(userInfo) {
  try {
    await AsyncStorage.setItem('user_info', userInfo);
  } catch (e) {
    console.log(`UserManger.save error: ${JSON.stringify(e)}`);
  }
};

UserManager.load = async function() {
  try {
    const info = await AsyncStorage.getItem('user_info');
    return JSON.parse(info);
  } catch (e) {
    console.log(`UserManger.load error: ${JSON.stringify(e)}`);
  }
  return null;
};

UserManager.delete = async function() {
  try {
    await AsyncStorage.removeItem('user_info');
  } catch (e) {
    console.log(`UserManager.delete error: ${JSON.stringify(e)}`);
  }
};

UserManager.isLogedIn = false;

UserManager.currentUser = async function() {
  const user = await UserManager.load();
  if (user == null) { return null; }

  UserManager.isLogedIn = true;
  DeviceEventEmitter.emit(Events.USR_LOGIN, user);
  return user;
};

UserManager.setLogin = async function(userInfo) {
  await UserManager.save(userInfo);
  UserManager.isLogedIn = true;
  DeviceEventEmitter.emit(Events.USR_LOGIN, [userInfo]);
};

UserManager.setLogout = async function() {
  await UserManager.delete();
  UserManager.isLogedIn = false;
  DeviceEventEmitter.emit(Events.USR_LOGOUT);
};
