import AsyncStorage from '@react-native-community/async-storage';

export const getWalletInfo = (network, userInfo) => {
  try {
    let str = 'walletInfo_' + userInfo.id;
    if (userInfo && userInfo.wallets && userInfo.wallets.length) {
      const defaultWallet =
        userInfo.wallets && userInfo.wallets.length && userInfo.wallets[0];
      let walletInfoParam = {};

      if (defaultWallet.enable && defaultWallet.network === network) {
        walletInfoParam = defaultWallet;
        walletInfoParam.walletList = userInfo.wallets;
      }
      return AsyncStorage.getItem(str)
        .then(value => {
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
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
    //throw error;
  }
};
