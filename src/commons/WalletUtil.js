import AsyncStorage from '@react-native-community/async-storage';

export const getWalletInfo = async (network, userInfo) => {
  try {
    if (userInfo && userInfo.wallets && userInfo.wallets.length) {
      let str = 'walletInfo_' + userInfo.id;
      const defaultWallet =
        userInfo.wallets && userInfo.wallets.length && userInfo.wallets[0];
      let walletInfoParam = {};

      if (defaultWallet.enable && defaultWallet.network === network) {
        walletInfoParam = defaultWallet;
        walletInfoParam.walletList = userInfo.wallets;
      }
      const value = await AsyncStorage.getItem(str);
      if (value) {
        walletInfoParam = JSON.parse(value);
        let targets = userInfo.wallets.filter(w => {
          return (
            w.enable === true &&
            w.accountName === walletInfoParam.accountName &&
            w.network === network
          );
        });
        if (targets.length) {
          walletInfoParam.walletList = userInfo.wallets;
          walletInfoParam.hasTwins = targets[0].hasTwins;
        } else {
          return null;
        }
      }
      return walletInfoParam;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
    //throw error;
  }
};

export const saveWalletInfo = async (userInfo, walletInfo) => {
  if (userInfo) {
    let str = 'walletInfo_' + userInfo.id;
    await AsyncStorage.setItem(str, JSON.stringify(openInfo));
  }
};
