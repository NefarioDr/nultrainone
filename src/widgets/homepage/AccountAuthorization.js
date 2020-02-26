import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  Dimensions,
} from 'react-native';

import Button from '../components/Button';
import I18n from '../../../resources/languages/I18n';
import * as authService from '../../services/auth';

const closeIcon = require('../../../resources/img/closeIcon.png');
const transform = require('../../../resources/img/transform.png');
const logo = require('../../../resources/img/logo.png');

const height80 = Dimensions.get('window').height * 0.8;
const height20 = Dimensions.get('window').height * 0.2;

export default class AccountAuthorization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
    };
  }

  submitAccountAuthorization = async () => {
    const {
      submitAccountAuthorization,
      closeAccountAuthorization,
      accountName,
      network,
    } = this.props;
    try {
      const result = await authService.checkWallet({accountName, network});
      if (result.state === 'success') {
      } else {
        setTimeout(() => {
          this.setState({
            toastVisible: true,
            dialogSubmitText: I18n.t('btn.okay'),
            submitComfirm: () => {},
            dialogTitle: I18n.t('page.prompt'),
            dialogDec: result.message,
          });
        }, 0);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    closeAccountAuthorization();
    submitAccountAuthorization();
  };

  render() {
    const {
      visible,
      closeAccountAuthorization,
      imgUrl,
      name,
      accountName,
    } = this.props;
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
            onPress={() => closeAccountAuthorization('goBack')}
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
                onPress={() => closeAccountAuthorization('goBack')}>
                <Image
                  source={closeIcon}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>
                {I18n.t('page.accountAuthorization')}
              </Text>
            </View>
            <View style={styles.body}>
              <View style={styles.authorizationBox}>
                <Text style={styles.authorizationText}>
                  {I18n.t('page.Account')}
                  {accountName}
                </Text>
                <View style={styles.imgBox}>
                  <Image
                    source={logo}
                    resizeMode="contain"
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                  <Image
                    source={transform}
                    style={{
                      width: 28,
                      height: 23,
                    }}
                  />
                  <Image
                    source={{uri: imgUrl}}
                    resizeMode="contain"
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.text}>
                    {I18n.t('page.Allow')}{' '}
                    <Text style={styles.textBold}>{name}</Text>{' '}
                    {I18n.t('page.allowRelatedInformation')}
                  </Text>
                </View>
              </View>
              <Button
                containerStyle={[styles.btn]}
                style={[styles.btnText]}
                text={I18n.t('btn.confirm')}
                onPress={() => this.submitAccountAuthorization()}
              />
            </View>
          </View>
        </View>
        <ToastUtils
          visible={this.state.toastVisible}
          dialogSubmitText={this.state.dialogSubmitText}
          submitComfirm={this.state.submitComfirm}
          dialogCancelText={this.state.dialogCancelText}
          cancelBtnAction={this.state.cancelBtnAction}
          dialogTitle={this.state.dialogTitle}
          dialogDec={this.state.dialogDec}
          closeToast={() => this.setState({toastVisible: false})}
        />
      </Modal>
    );
  }
}

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
  body: {
    paddingHorizontal: 12,
    paddingTop: 26,
    paddingBottom: 29,
    height: height80 - 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorizationBox: {
    width: 262,
    marginTop: 56,
    flexDirection: 'column',
    alignItems: 'center',
  },
  authorizationText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#333',
    marginBottom: 53,
  },
  imgBox: {
    width: '100%',
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  textBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '700',
  },
  btn: {
    width: '100%',
    height: 57,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(AccountAuthorization);
