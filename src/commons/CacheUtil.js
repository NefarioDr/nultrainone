import AsyncStorage from '@react-native-community/async-storage';

const saveItem = async (item, selectedValue) => {
  try {
    if (_jsObject(selectedValue)) {
      let json = JSON.stringify(selectedValue);
      await AsyncStorage.setItem(item, json);
    }
    if (_isString(selectedValue)) {
      await AsyncStorage.setItem(item, selectedValue);
    }
    if (_isNumber(selectedValue)) {
      await AsyncStorage.setItem(item, String(selectedValue));
    }
    if (_isBoolean(selectedValue)) {
      await AsyncStorage.setItem(item, String(selectedValue));
    }
  } catch (error) {
    console.log(error);
    //throw error;
  }
};

const getItem = async (item, callback) => {
  try {
    await AsyncStorage.getItem(item, function(err, reusult) {
      callback && callback(err, reusult);
    });
  } catch (error) {
    console.log(error);
    //throw error;
  }
};

const removeItem = async item => {
  try {
    await AsyncStorage.removeItem(item);
  } catch (error) {
    console.log(error);
    //throw error;
  }
};

const _jsObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

const _isString = obj => {
  return Object.prototype.toString.call(obj) === '[object String]';
};

const _isNumber = obj => {
  return Object.prototype.toString.call(obj) === '[object Number]';
};

const _isBoolean = obj => {
  return Object.prototype.toString.call(obj) === '[object Boolean]';
};

export default {
  saveItem,
  getItem,
  removeItem,
};
