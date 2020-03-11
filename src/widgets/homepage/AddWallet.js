import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
} from 'react-native';

import I18n from '../../../resources/languages/I18n';
import Button from '../components/Button';
import NavigationUtil from '../../commons/NavigationUtil';
import { HSRouter } from '../../homescreen/HSRouter';

const closeIcon = require('../../../resources/img/closeIconB.png');

const AddWallet = ({ visible, closeModel, closeWallet, goBack, props }) => {
  handleCreatClick = () => {
    closeModel();
    if (closeWallet) {
      setTimeout(() => {
        closeWallet();
      }, 50);
    }
    setTimeout(() => {
      const { loggedIn } = props;
      if (loggedIn) {
        NavigationUtil.go(props.navigation, HSRouter.CREATE_WALLET, { goBack });
      } else {
        NavigationUtil.reset(props.navigation, HSRouter.LOGIN_SCREEN);
      }
    }, 1000);
  };
  handleImportClick = () => {
    closeModel();
    if (closeWallet) {
      setTimeout(() => {
        closeWallet();
      }, 0);
    }
    setTimeout(() => {
      const { loggedIn } = props;
      if (loggedIn) {
        NavigationUtil.go(props.navigation, HSRouter.IMPORT_WALLET, { goBack });
      } else {
        NavigationUtil.reset(props.navigation, HSRouter.LOGIN_SCREEN);
      }
    }, 1000);
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeModel()}>
      <View style={styles.addWallet}>
        <TouchableOpacity
          style={styles.closeModels}
          activeOpacity={0.8}
          onPress={() => closeModel()}
        />
        <View style={styles.walletBox}>
          <Text style={styles.walletTitle}>
            {I18n.t('wallet.chooseCreate')}
          </Text>
          <Text style={styles.walletDecs}>
            {I18n.t('wallet.bundledPerLess5')}
          </Text>
          <View style={styles.btnBox}>
            <Button
              containerStyle={[styles.btnStyle, styles.createBtn]}
              style={[styles.btnText]}
              text={I18n.t('page.createWallet')}
              onPress={handleCreatClick}
            />
            <Button
              containerStyle={[styles.btnStyle, styles.importBtn]}
              style={[styles.btnText]}
              text={I18n.t('page.importWallet')}
              onPress={handleImportClick}
            />
          </View>
          <TouchableOpacity
            style={styles.closIcon}
            activeOpacity={0.8}
            onPress={() => closeModel()}>
            <Image style={[{ width: 17, height: 17 }]} source={closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

AddWallet.defaultProps = {
  selectWallet: () => { },
  selectionWallet: 'TestNet',
};

const styles = StyleSheet.create({
  addWallet: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeModels: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: Dimensions.get('window').height - 175,
  },
  closIcon: {
    position: 'absolute',
    top: 24,
    right: 22,
    width: 17,
    height: 17,
  },
  walletBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 175,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    elevation: 8,
  },
  walletTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
  },
  walletDecs: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: '47%',
    borderRadius: 5,
    marginTop: 20,
  },
  createBtn: {
    backgroundColor: '#0FBD97',
  },
  importBtn: {
    backgroundColor: '#426DFE',
  },
  btnText: {
    fontSize: 15,
    color: '#FFF',
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(AddWallet);
export default AddWallet;
