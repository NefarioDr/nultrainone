import {Platform, DeviceEventEmitter} from 'react-native';
import * as authService from './auth';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import AsyncStorage from '@react-native-community/async-storage';
import { Events } from './events';

export const GlobalSettings = {};

GlobalSettings.openDappModule = false;
GlobalSettings.chainInfo = null;
GlobalSettings.transFee = null;
GlobalSettings.chainName = 'MainNet';

GlobalSettings.init = async function() {
  let platform = Platform.OS === 'ios' ? 'ios' : 'android';
  // 获取信息
  const result = await authService.getDataForLaunchScreen({
    platform,
  });

  if (result.state === 'success' && result.docs) {
    RNSecureKeyStore.set(
      'bootInfo',
      JSON.stringify({bootImage: result.docs.bootImage}),
      {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY},
    );

    GlobalSettings.openDappModule = result.docs.openDappModule;
    GlobalSettings.chainInfo = result.docs.chainInfo;
    GlobalSettings.transFee = result.docs.transFee;

    await AsyncStorage.setItem('global_settings', JSON.stringify(result.docs));
    await AsyncStorage.setItem('transfer_fee', String(result.docs.transFee));
    await AsyncStorage.setItem('open_dapp_module', String(result.docs.openDappModule));

    DeviceEventEmitter.emit(Events.SYS_GLOBAL_CONFIG_UPDATED);
  }
};

GlobalSettings.config = async function() {
  const gs =  await AsyncStorage.getItem('global_settings');
  if (gs) { return JSON.parse(gs); }
  return null;
};

GlobalSettings.transFee = async function() {
  return await AsyncStorage.getItem('transfer_fee');
};

GlobalSettings.openDappModule = async function() {
  const odm = await AsyncStorage.getItem('open_dapp_module');
  return odm === 'true';
};

GlobalSettings.saveSelectNetwork = async function(sn) {
  GlobalSettings.chainName = sn.key;
  await AsyncStorage.setItem('selected_network', JSON.stringify(sn));
};
