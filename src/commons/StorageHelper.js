import AsyncStorage from '@react-native-community/async-storage';

export default class StorageHelper {
  static Keys = {};

  static save = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  };

  static remove = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  };

  static get = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      return null;
    }
  };
}
