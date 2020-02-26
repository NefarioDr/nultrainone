import React from 'react';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Clipboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {BaseUrl, ImageUrl} from '../../constants/Urls';
// import Toast, {DURATION} from 'react-native-easy-toast';
import * as Images from '../../../resources/img/Images';
import Button from '../components/Button';
import {getWalletInfo} from '../../constants/commons/WalletUtil';
import * as authService from '../../../services/auth';

import SaveImageAlbum from '../../constants/commons/SaveImageAlbum';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TOASTTOP = SCREEN_HEIGHT / 2 - 180;
const SEMBOLD = '700';

import CacheUtils from '../../constants/commons/CacheUtil';

const revceiveBg = require('../../../resources/img/revceiveBg.png');
const copyIcon = require('../../../resources/img/copyIcon.png');

class Revceive extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: I18n.t('page.revceive'),
    headerLeft: (
      <View>
        <TouchableOpacity
          style={{marginLeft: 18}}
          onPress={() => navigation.goBack()}>
          <Image
            source={{uri: Images.GO_BACK_BLACK}}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#1E1E24',
      borderBottomWidth: 0.5,
      borderBottomColor: '#1E1E24',
    },
    headerTintColor: '#fff',
  });

  constructor(props) {
    super(props);
    this.state = {
      walletInfo: {},
      QRcode: '',
    };
  }

  getWalletInfo = async () => {
    const {userInfo} = this.props;
    const walletInfo = await getWalletInfo(this.state.network, userInfo);
    this.setState({
      walletInfo: walletInfo,
    });
  };

  copyToClipboard = () => {
    Clipboard.setString(this.state.walletInfo.accountName);
    this.refs.toast.show(I18n.t('page.successfulCopy'), DURATION.LENGTH_SHORT);
  };

  exportQrCode = async () => {
    const {userInfo} = this.props;
    const params = {
      accountName: this.state.walletInfo.accountName,
      userId: userInfo.id,
    };

    // 二维码
    await authService
      .exportQrCode(params)
      .then(result => {
        if (result.state === 'success') {
          this.setState({
            QRcode: ImageUrl + result.qr,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  async componentDidMount() {
    await CacheUtils.getItem('selectNetwork', (err, ret) => {
      if (err) {
        console.log(err);
        return;
      }
      if (ret) {
        ret = JSON.parse(ret);
        this.setState({
          network: ret.key,
        });
      }
    });
    await this.getWalletInfo();
    await this.exportQrCode();
  }

  saveImage = () => {
    // 需要保存的二维码
    const {userInfo} = this.props;
    const params = {
      accountName: this.state.walletInfo.accountName,
      userId: userInfo.id,
      lang: I18n.locale == 'en' ? 'en' : 'cn',
    };
    authService
      .exportQrCodeWithBg(params)
      .then(result => {
        if (result.state === 'success') {
          const imgUrl = ImageUrl + result.qr;
          SaveImageAlbum.saveImageAlbum(imgUrl)
            .then(response => {
              console.log('Save Image:', response);
              this.refs.toast.show(
                I18n.t('page.SuccessfullySaved'),
                DURATION.LENGTH_SHORT,
              );
            })
            .catch(error => {
              console.log('Save Image:', error);
              this.refs.toast.show(
                I18n.t('page.SaveFailed'),
                DURATION.LENGTH_SHORT,
              );
            });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return (
      <ImageBackground
        resizeMode="contain"
        style={styles.container}
        source={revceiveBg}>
        <StatusBar backgroundColor="#1E1E24" translucent={false} />

        <View style={styles.QRcodeBox}>
          <View style={styles.QRcode}>
            {this.state.QRcode ? (
              <Image
                source={{uri: this.state.QRcode}}
                style={{width: 181, height: 181}}
              />
            ) : (
              <View>
                <ActivityIndicator />
                <Text style={{marginTop: 10}}>loading...</Text>
              </View>
            )}
          </View>
          <View style={styles.accounts}>
            <View style={styles.accountsText}>
              <Text style={styles.title}>{I18n.t('page.copyName')}</Text>
              <Text style={styles.name}>
                {this.state.walletInfo.accountName || ''}
              </Text>
            </View>
            <TouchableOpacity onPress={this.copyToClipboard}>
              <Image source={copyIcon} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          containerStyle={[styles.btn]}
          style={[styles.btnText]}
          text={I18n.t('page.saveImage')}
          onPress={this.saveImage}
        />
        <Toast
          ref="toast"
          style={{
            backgroundColor: 'rgba(0,0,0,.8)',
            width: 200,
            paddingHorizontal: 15,
            paddingVertical: 25,
            borderRadius: 5,
          }}
          position="top"
          positionValue={TOASTTOP}
          fadeInDuration={750}
          fadeOutDuration={1200}
          opacity={1}
          textStyle={{
            color: '#fff',
            fontSize: 12,
            lineHeight: 17,
            textAlign: 'center',
            fontWeight: SEMBOLD,
          }}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E24',
    height: '100%',
    paddingBottom: 60,
  },
  QRcodeBox: {
    width: 308,
    height: 314,
    backgroundColor: '#fff',
    marginBottom: 66,
  },
  QRcode: {
    width: '100%',
    height: 259,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    backgroundColor: '#F0EFEE',
    paddingHorizontal: 22,
  },
  accountsText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#666869',
  },
  name: {
    fontSize: 14,
    color: '#151515',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 308,
    height: 44,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 5,
  },
  btnText: {
    fontWeight: '500',
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
// export default connect(mapStateToProps)(Revceive);

export default Revceive;
