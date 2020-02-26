import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Text,
  Image,
} from 'react-native';

import Button from '../components/Button';
import I18n from '../../../resources/languages/I18n';
import {SCREEN_HEIGHT} from '../../constants/Common';
const closeIcon = require('../../../resources/img/closeIcon.png');

const height80 = SCREEN_HEIGHT * 0.8;
const height20 = SCREEN_HEIGHT * 0.2;

const TransactionDetail = ({
  visible,
  sendExhibitionData,
  closeDetail,
  detailSubmit,
  contractData,
  imgUrl,
  transFee,
}) => {
  let contract = [];
  let sendExhibition = [];
  if (contractData) {
    contractData.forEach((cData, index) => {
      contract.push(
        <View
          style={{width: '100%', paddingHorizontal: 13, marginBottom: 20}}
          key={index}>
          <View style={styles.detail}>
            <Text style={styles.title}>chainName</Text>
            <Text style={styles.value}>{cData.chainName}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>contract</Text>
            <Text style={styles.value}>{cData.contract}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>action</Text>
            <Text style={styles.value}>{cData.action}</Text>
          </View>
          <View style={styles.detailDec}>
            <Text style={styles.title}>data</Text>
            <Text style={styles.value}>{JSON.stringify(cData.data)}</Text>
          </View>
        </View>,
      );
    });
  }
  if (sendExhibitionData) {
    sendExhibitionData.forEach((sendData, index) => {
      sendExhibition.push(
        <View
          style={{width: '100%', paddingHorizontal: 13, marginBottom: 20}}
          key={index}>
          <View style={styles.numBox}>
            <Text style={styles.num}>{sendData.amount}</Text>
            <Text style={styles.unit}>{sendData.unit}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>{I18n.t('page.transactionType')}</Text>
            <Text style={styles.value}>{sendData.action}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>{I18n.t('page.payingAccount')}</Text>
            <Text style={styles.value}>{sendData.accountName}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.title}>{I18n.t('page.receivingAccount')}</Text>
            <Text style={styles.value}>{sendData.toName}</Text>
          </View>
          {sendData.currency && sendData.currency.chain.name == 'ultrainio' && (
            <View style={styles.detail}>
              <Text style={styles.title}>{I18n.t('page.fee')}</Text>
              <Text style={styles.value}>{transFee}</Text>
            </View>
          )}
          <View style={styles.detail}>
            <Text style={styles.title}>{I18n.t('page.memo')}</Text>
            <Text style={styles.value}>{sendData.memo}</Text>
          </View>
        </View>,
      );
    });
  }

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
          onPress={() => closeDetail()}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 24,
                top: 25,
              }}
              activeOpacity={0.8}
              onPress={() => closeDetail()}>
              <Image
                source={closeIcon}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {I18n.t('page.transactionDetail')}
            </Text>
            {!!imgUrl && (
              <Image
                source={{uri: imgUrl}}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  right: 24,
                  top: 12,
                  width: 40,
                  height: 40,
                }}
              />
            )}
          </View>
          <ScrollView style={styles.scrollBody}>
            <View style={styles.body}>
              {contractData ? contract : sendExhibition}
              <Button
                containerStyle={[styles.btn]}
                style={[styles.btnText]}
                text={I18n.t('btn.confirm')}
                onPress={() => detailSubmit()}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

TransactionDetail.defaultProps = {};

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
    height: height20,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: height80,
  },
  header: {
    position: 'relative',
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  headerText: {
    fontSize: 20,
    color: '#000',
  },
  scrollBody: {
    height: height80 - 70,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 26,
    paddingBottom: 29,
    // minHeight: height80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numBox: {
    marginBottom: 19,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  num: {
    fontSize: 40,
    color: '#000',
    fontWeight: '600',
  },
  unit: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    transform: [{translateX: 6}, {translateY: -6}],
  },
  detail: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  title: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  value: {
    maxWidth: '60%',
    fontSize: 12,
    color: '#333',
  },
  detailDec: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  btn: {
    width: '100%',
    height: 57,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
    marginTop: 40,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default TransactionDetail;
