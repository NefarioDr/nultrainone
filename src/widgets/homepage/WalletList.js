import React from 'react';
import I18n from '../../../resources/languages/I18n';

import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';

const selectionIcon = require('../../../resources/img/selectionIcon.png');
const walletIcon = require('../../../resources/img/walletIcon.png');

const WalletList = ({
  visible,
  selectWallet,
  selectionWallet,
  goWalletMessage,
  closeWallet,
  walletList,
  onlySelect,
}) => {
  const selectFun = select => {
    selectWallet(select);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => closeWallet()}>
      <View style={styles.walletList}>
        <TouchableOpacity
          style={styles.closeModel}
          activeOpacity={0.8}
          onPress={() => closeWallet()}
        />
        <ScrollView style={styles.container}>
          {walletList &&
            walletList.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => selectFun(item)}
                  key={index}>
                  <View style={styles.walletLi}>
                    <View>
                      <Text style={styles.walletText}>{item.accountName}</Text>
                      {!onlySelect && (
                        <Text style={styles.walletNum}>
                          {item.ugasNum || '0 UGAS'}
                        </Text>
                      )}
                    </View>
                    {selectionWallet == item.accountName && (
                      <Image
                        resizeMode="contain"
                        style={{width: 23}}
                        source={selectionIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          <View style={{height: 95}} />
        </ScrollView>
        {!onlySelect && (
          <TouchableOpacity
            style={styles.addWallet}
            activeOpacity={0.8}
            onPress={() => goWalletMessage()}>
            <Image
              resizeMode="contain"
              style={{width: 20, height: 15}}
              source={walletIcon}
            />
            <Text style={styles.addWalletText}>
              {I18n.t('wallet.addAndChangeWallet')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

WalletList.defaultProps = {
  selectWallet: () => {},
  selectionWallet: 'TestNet',
};

const styles = StyleSheet.create({
  walletList: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeModel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '25%',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    padding: 20,
  },
  walletLi: {
    height: 77,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  walletText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginBottom: 10,
  },
  walletNum: {
    fontSize: 15,
    color: '#666',
  },
  addWallet: {
    position: 'absolute',
    bottom: 18,
    right: '5%',
    width: '90%',
    height: 67,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#00AEEF',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
  addWalletText: {
    fontSize: 15,
    color: '#00AEEF',
    marginLeft: 17,
  },
});

export default WalletList;
