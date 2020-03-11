import AsyncStorage from '@react-native-community/async-storage';

export class Chain {
  constructor() {
    this.key = 'MainNet';
    this.id = '';
  }
}

async function saveChain(chain) {
  try {
    await AsyncStorage.setItem('@MySuperStore:key', chain);
  } catch (error) {
    // Error saving data
  }
}

async function loadChain() {
  try {
    return await AsyncStorage.getItem('selectNetwork');
  } catch (err) {}
}

export {saveChain, loadChain};
