import React from 'react';
import {StyleSheet, View, TouchableOpacity, Modal} from 'react-native';

// import {connect} from 'react-redux';
import AssetsList from '../Wallet/AssetsList';

const SelectCurrency = ({
  visible,
  accountName,
  network,
  currency,
  config,
  selectCurrency,
}) => {
  return (
    <Modal
      onRequestClose={() => {}}
      visible={visible}
      transparent={true}
      animationType="slide">
      <View style={styles.networkList}>
        <TouchableOpacity
          style={styles.closeModel}
          activeOpacity={0.8}
          onPress={() => selectCurrency(currency)}
        />
        <View style={styles.container}>
          <AssetsList
            isSelect={true}
            config={config}
            currency={
              currency
                ? currency.symbol == 'UGAS'
                  ? 'UGAS'
                  : currency.chain.chainId +
                    currency.tokenAccount +
                    currency.symbol
                : ''
            }
            accountName={accountName}
            network={network}
            selectCurrency={selectCurrency}
            {...this.props}
          />
        </View>
      </View>
    </Modal>
  );
};

SelectCurrency.defaultProps = {
  selectCurrency: () => {},
};

const styles = StyleSheet.create({
  networkList: {
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
    height: '40%',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(SelectCurrency);
export default SelectCurrency;
