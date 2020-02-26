import {createU3} from 'u3.js';
import RNSecureKeyStore from 'react-native-secure-key-store';

export const clearWallet = async (chainInfo, accountName, key) => {
  try {
    const u3 = createU3(chainInfo);
    const acc_info = await u3.getAccountByName(accountName);
    const public_key = acc_info.activePk;
    console.log('>>>>>' + key + '<<<<<<', '取私钥的key');
    RNSecureKeyStore.get(key).then(
      res => {
        if (res) {
          let info = JSON.parse(res);
          const publicKey = info.public_key;
          console.log(publicKey, public_key, publicKey == public_key);
          if (!!publicKey && !!public_key && publicKey != public_key) {
            RNSecureKeyStore.remove(key);
          }
        }
      },
      err => {
        console.log(err);
      },
    );
  } catch (error) {
    console.log(error);
  }
};
