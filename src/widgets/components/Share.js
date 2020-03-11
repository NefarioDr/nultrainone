import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Clipboard,
  Linking,
  Image,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Share, {ShareSheet, Button} from 'react-native-share';
import {connect} from 'react-redux';
import ToastUtil from '../utils/ToastUtil';
import * as WeChat from 'react-native-wechat1';
import * as Images from '../constants/Images';
import * as shareService from '../services/share';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modal';
import {captureRef, captureScreen} from 'react-native-view-shot';
import SaveImageAlbum from '../utils/SaveImageAlbum';
import Toast from 'react-native-root-toast';
import {Events} from '../../services/events';

class SharePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,

      res: null,
      value: {
        format: 'png',
        quality: 0.9,
        result: 'tmpfile',
        snapshotContentContainer: true,
      },
    };
  }

  setShareCancel = () => {
    this.setState({visible: false});
  };

  setShareOpen = () => {
    this.setState({visible: true});
  };

  shareArticleSource = params => {
    shareService
      .saveShareArticleRecord(params)
      .then(result => {
        if (result.state === 'success') {
          DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
        } else {
          ToastUtil.showShort(result.message, true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  shareActivitySource = params => {
    shareService
      .saveShareActivityRecord(params)
      .then(result => {
        if (result.state === 'success') {
          //console.log("分享成功");
        } else {
          ToastUtil.showShort(result.message, true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  handleShareToSession = async () => {
    const {shareImage} = this.props;
    const imageUrl = await this.snapshot('full', false);

    WeChat.isWXAppInstalled().then(isInstalled => {
      if (isInstalled) {
        this.setShareCancel();

        WeChat.shareToSession(
          shareImage
            ? {
                title: this.props.shareOptions.title,
                description: this.props.shareOptions.message,
                type: 'imageFile',
                mediaTagName: 'image',
                messageAction: undefined,
                messageExt: undefined,
                imageUrl: 'file://' + imageUrl,
              }
            : {
                title: this.props.shareOptions.title,
                description: this.props.shareOptions.message,
                type: 'news',
                webpageUrl: this.props.shareOptions.url,
              },
        ).catch(error => {
          ToastUtil.showShort(error.message, true);
        });
        const {userInfo} = this.props;
        let params = {
          userId: userInfo.id,
          id: this.props.shareOptions.id,
          source: 'wechat',
        };
        if (this.props.shareOptions.type === 'article') {
          this.shareArticleSource(params);
        } else if (this.props.shareOptions.type === 'activity') {
          this.shareActivitySource(params);
        }
        //TODO 记录分享软件行为
        else {
        }
      } else {
        ToastUtil.showShort(I18n.t('page.nowechat'), true);
      }
    });
  };

  handleShareToTimeline = async () => {
    const {shareImage} = this.props;
    const imageUrl = await this.snapshot('full', false);

    WeChat.isWXAppInstalled().then(isInstalled => {
      if (isInstalled) {
        this.setShareCancel();

        WeChat.shareToTimeline(
          shareImage
            ? {
                title: this.props.shareOptions.title,
                description: this.props.shareOptions.message,
                type: 'imageFile',
                mediaTagName: 'image',
                messageAction: undefined,
                messageExt: undefined,
                imageUrl: 'file://' + imageUrl,
              }
            : {
                title: this.props.shareOptions.title,
                type: 'news',
                description: this.props.shareOptions.message,
                webpageUrl: this.props.shareOptions.url,
              },
        ).catch(error => {
          ToastUtil.showShort(error.message, true);
        });
        const {userInfo} = this.props;
        let params = {
          userId: userInfo.id,
          id: this.props.shareOptions.id,
          source: 'timeline',
        };
        if (this.props.shareOptions.type === 'article') {
          this.shareArticleSource(params);
        } else if (this.props.shareOptions.type === 'activity') {
          this.shareActivitySource(params);
        }
        //TODO 记录分享软件行为
        else {
        }
      } else {
        ToastUtil.showShort(I18n.t('page.nowechat'), true);
      }
    });
  };

  handleSnapshortAndDownload = () => {
    this.snapshot('full');
    this.setShareCancel();
  };

  handleShareToClipboard = () => {
    setTimeout(() => {
      if (typeof this.props.shareOptions.url !== undefined) {
        Clipboard.setString(this.props.shareOptions.url);
        this.setShareCancel();
        const {userInfo} = this.props;
        let params = {
          userId: userInfo.id,
          id: this.props.shareOptions.id,
          source: 'clipboard',
        };
        if (this.props.shareOptions.type === 'article') {
          this.shareArticleSource(params);
        } else if (this.props.shareOptions.type === 'activity') {
          this.shareActivitySource(params);
        }
      }
    }, 300);

    setTimeout(() => {
      ToastUtil.showShort(I18n.t('page.CopiedToClipboard'), true);
    }, 1000);
  };

  handleShareToWeb = () => {
    Linking.openURL(this.props.shareOptions.url);
  };

  handleShareToMore = () => {
    this.setShareCancel();

    setTimeout(() => {
      Share.open(this.props.shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
      const {userInfo} = this.props;
      let params = {
        userId: userInfo.id,
        id: this.props.shareOptions.id,
        source: 'more',
      };
      if (this.props.shareOptions.type === 'article') {
        this.shareArticleSource(params);
      } else if (this.props.shareOptions.type === 'activity') {
        this.shareActivitySource(params);
      }
      //TODO 记录分享软件行为
      else {
      }
    }, 500);
  };

  handleShare = social => {
    this.setShareCancel();

    setTimeout(() => {
      Share.shareSingle(
        Object.assign({}, this.props.shareOptions, {
          social,
        }),
      );

      // 保存至数据库
      const {userInfo} = this.props;
      let params = {
        userId: userInfo.id,
        id: this.props.shareOptions.id,
        source: social,
      };
      if (this.props.shareOptions.type === 'article') {
        this.shareArticleSource(params);
      } else if (this.props.shareOptions.type === 'activity') {
        this.shareActivitySource(params);
      }
      //TODO 记录分享软件行为
      else {
      }
    }, 300);
  };

  snapshot = async (refname, toast = true) => {
    if (this.props.onSnapshot) {
      const ref = this.props.onSnapshot(refname);
      const res = refname
        ? await captureRef(ref, this.state.value)
        : await captureScreen(this.state.value);
      const uri =
        this.state.value.result === 'base64'
          ? 'data:image/' + this.state.value.format + ';base64,' + res
          : res;

      return SaveImageAlbum.saveLocalImageAlbum(uri)
        .then(response => {
          if (toast) {
            Toast.show(I18n.t('page.SuccessfullySaved'), {
              duration: Toast.durations.LONG,
              position: Toast.positions.CENTER,
              shadow: false,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }
          return uri;
        })
        .catch(error => {
          Toast.show(I18n.t('page.SaveFailed'), {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        });
    }
  };

  render() {
    return (
      <View>
        <Modal onRequestClose={() => {}} isVisible={this.state.visible}>
          <View style={styles.container}>
            <View style={styles.listWrap}>
              <TouchableOpacity
                onPress={() => this.handleShareToSession()}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.SHARE_WEIXIN}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleShareToTimeline()}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.SHARE_PENGYOUQUAN}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleShare('facebook');
                }}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.SHARE_FACEBOOK}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleShare('twitter');
                }}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.SHARE_TWITTER}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.listWrap2}>
              <TouchableOpacity
                onPress={() => {
                  this.handleSnapshortAndDownload();
                }}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.SNAPSHORT_ICON}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleShareToClipboard();
                }}
                style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.CLIPBOARD_ICON}}
                  />
                </View>
              </TouchableOpacity>
              {/*<TouchableOpacity
                onPress={() => {
                  this.handleShareToWeb();
                }} style={styles.shareParent}>
                <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={{ uri: Images.OUTWEB_ICON }}/>
                </View>
              </TouchableOpacity>*/}
              <TouchableOpacity
                onPress={() => {
                  this.handleShareToMore();
                }}
                style={styles.shareParent}>
                <View style={[styles.shareContent]}>
                  <Image
                    style={styles.shareIcon}
                    source={{uri: Images.MORE_ICON}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.closeWrap}>
              <TouchableOpacity
                onPress={() => {
                  this.setShareCancel();
                }}>
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareCloseIcon}
                    source={{uri: Images.SAHRE_CLOSE}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 268,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 18,
    flexDirection: 'column',
  },
  shareWrap: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    margin: 0,
  },
  listWrap: {
    width: '88%',
    height: 54,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '6%',
    marginTop: 40,
    marginBottom: 35,
  },
  listWrap2: {
    width: '88%',
    height: 54,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 40,
    marginLeft: '6%',
  },
  closeWrap: {
    height: 45,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  shareParent: {
    width: '25%',
  },
  shareContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    width: 54,
    height: 54,
  },
  shareCloseIcon: {
    width: 25,
    height: 25,
  },
  ML18: {
    marginLeft: -18,
  },
});
const mapStateToProps = state => {
  return {
    userInfo: state.auth.userInfo,
    loggedIn: state.auth.loggedIn,
    registered: state.auth.registered,
  };
};

SharePage.propTypes = {
  shareImage: PropTypes.bool,
};
SharePage.defaultProps = {
  shareImage: false,
};

export default connect(
  mapStateToProps,
  null,
  null,
  {withRef: true},
)(SharePage);
