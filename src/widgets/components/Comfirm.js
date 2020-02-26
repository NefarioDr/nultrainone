import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Dialog from './DialogView';
import I18n from '../../../resources/languages/I18n';

const Comfirm = ({visible, item, submitComfirm, cancelComfirm}) => {
  return (
    <Dialog
      visible={visible}
      dialogSubmitText={I18n.t('btn.confirm')}
      dialogCancelText={I18n.t('btn.cancel')}
      submitBtnAction={() => submitComfirm(item)}
      cancelBtnAction={cancelComfirm}>
      <View style={styles.container}>
        <Text style={styles.comfirmH1}>
          {I18n.t('page.toThirdDapp', {
            dAppUrl: item.title
              ? item.title
              : I18n.locale == 'en'
              ? item.nameEn
              : item.name,
          })}
        </Text>
        <Text style={styles.comfirmH2}>
          {I18n.t('page.thirdPrivacyPolicy', {
            dAppUrl: item.title
              ? item.title
              : I18n.locale == 'en'
              ? item.nameEn
              : item.name,
          })}
        </Text>
      </View>
    </Dialog>
  );
};
Comfirm.defaultProps = {
  visible: false,
  item: {
    name: '',
  },
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comfirmH1: {
    color: '#3A424C',
    marginBottom: 10,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
  },
  comfirmH2: {
    color: '#000',
    fontSize: 15,
    lineHeight: 21,
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
export default Comfirm;
