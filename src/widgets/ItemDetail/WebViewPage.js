import React from 'react';
import {
  StyleSheet,
  BackHandler,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import WebView from 'react-native-webview-plugin';
import I18n from '../../../resources/languages/I18n';
import LoadingView from '../components/LoadingView';
const ExtraDimensions = require('react-native-extra-dimensions-android');
import {BaseUrl, ImageUrl} from '../../constants/Urls';
import * as authService from '../../services/auth';
import * as Images from '../../../resources/img/Images';
import Share from '../components/Share';
import ShadowView from '../ItemDetail/ShadowView';
import { Events } from '../../services/events';
let canGoBack = false;

const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage',
    );
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

class WebViewPage extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <View>
        <TouchableOpacity
          style={{marginLeft: 18}}
          onPress={() => navigation.state.params.handleGoBack()}>
          <Image
            source={{uri: Images.GO_BACK_BLACK}}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.mR30}
          onPress={() =>
            navigation.state.params.handleToggleLike(
              navigation.state.params.heartStatu,
            )
          }>
          <Image
            source={{
              uri:
                navigation.state.params.heartStatu === false
                  ? Images.UNLIKE_ICON
                  : Images.LIKED_ICON,
            }}
            style={
              navigation.state.params.heartStatu === false
                ? {width: 20, height: 20}
                : {width: 24, height: 24}
            }
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.state.params.handleShare()}>
          <Image
            source={{uri: Images.SHARE_ICON}}
            style={{width: 18, height: 22}}
          />
        </TouchableOpacity>
      </View>
    ),
  });
  onToggleLike = d => {
    const {loggedIn, userInfo} = this.props;
    if (loggedIn) {
      const {params} = this.props.navigation.state;
      let articleId = params.article.contentId
        ? params.article.contentId._id
        : params.article._id;
      if (articleId === '' || articleId === undefined) {
        // const navigateAction = NavigationActions.navigate({
        //   routeName: 'Landing',
        //   params: {callbackRoute: 'ActivityDetail'},
        // });
        // this.props.navigation.dispatch(navigateAction);
      } else {
        let postData = {
          id: articleId,
          userId: userInfo._id,
          addLikeNum: d === true ? -1 : 1,
        };
        authService
          .updateLikeStatu(postData)
          .then(result => {
            if (result.state === 'success') {
              this.webview.postMessage(d === true ? -1 : 1);

              this.props.navigation.setParams({heartStatu: !d});
              DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      // const navigateAction = NavigationActions.navigate({
      //   routeName: 'Landing',
      //   params: {callbackRoute: 'Web'},
      // });
      // this.props.navigation.dispatch(navigateAction);
    }
  };

  handleToGoBack = () => {
    const {getParam} = this.props.navigation;
    const callbackRoute = getParam('callbackRoute');
    if (callbackRoute === 'MyLikeArticle') {
      DeviceEventEmitter.emit('refreshLikeArticleList');
      // NavigationUtil.reset(this.props.navigation, 'MyCollect');
    }
    if (callbackRoute === 'UltrainNews') {
      DeviceEventEmitter.emit('refreshMainList');
      // NavigationUtil.reset(this.props.navigation, 'Home');
    }
    if (callbackRoute === undefined) {
      this.props.navigation.goBack();
    }
  };
  onNavigationStateChange = navState => {
    canGoBack = navState.canGoBack;
  };
  getLikeStatu = (id, userId) => {
    let params = {
      id: id,
      userId: userId,
    };
    authService
      .getLikeStatu(params)
      .then(result => {
        if (result.state === 'success') {
          this.props.navigation.setParams({heartStatu: result.status});
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  renderLoading = () => <LoadingView />;

  onActionSelected = () => {
    const {loggedIn} = this.props;
    if (loggedIn) {
      this.refs.shareComponent.wrappedInstance.setShareOpen();
    } else {
      // const navigateAction = NavigationActions.navigate({
      //   routeName: 'Landing',
      //   params: {callbackRoute: 'Web'},
      // });
      // this.props.navigation.dispatch(navigateAction);
    }
  };

  constructor(props) {
    super(props);
    this.shareComponent = React.createRef();
    this.props.navigation.setParams({heartStatu: false});
    this.props.navigation.setParams({handleGoBack: this.handleToGoBack});
    this.state = {
      isShareModal: false,
      webViewData: '',
      loading: true,
    };

    this.data = 0;
    this.sendMessage = this.sendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  sendMessage() {
    this.webview.postMessage(++this.data);
  }

  handleMessage(e) {
    this.setState({webViewData: e.nativeEvent.data});
  }

  componentDidMount() {
    this.props.navigation.setParams({handleShare: this.onActionSelected});
    this.props.navigation.setParams({handleToggleLike: this.onToggleLike});

    const {loggedIn, registered, userInfo} = this.props;
    const {params} = this.props.navigation.state;

    //未登录，可以浏览文章详情（注意上方的点赞标志就是静态的）
    if (loggedIn) {
      this.getLikeStatu(
        params.article.contentId
          ? params.article.contentId._id
          : params.article._id,
        userInfo._id,
      );
    }

    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    if (this.state.isShareModal) {
      this.setState({
        isShareModal: false,
      });
      return true;
    } else if (canGoBack) {
      this.webview.goBack();
      return true;
    }
    return false;
  };

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  render() {
    const {params} = this.props.navigation.state;
    const articleId = params.article.contentId
      ? params.article.contentId._id
      : params.article._id;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1E1E24" translucent={false} />

        <ScrollView
          ref="full"
          style={{flex: 1}}
          scrollEnabled={false}
          nestedScrollEnabled={false}>
          <WebView
            webviewRef={ref => {
              this.webview = ref;
            }}
            automaticallyAdjustContentInsets={false}
            style={styles.webView}
            source={{
              uri: params.article.contentId
                ? ImageUrl +
                  '/content?id=' +
                  params.article.contentId._id +
                  '&language=' +
                  I18n.locale
                : ImageUrl +
                  '/content?id=' +
                  params.article._id +
                  '&language=' +
                  I18n.locale,
            }}
            bounces={false}
            javaScriptEnabled={true}
            decelerationRate="normal"
            onShouldStartLoadWithRequest={() => {
              const shouldStartLoad = true;
              return shouldStartLoad;
            }}
            onNavigationStateChange={this.onNavigationStateChange}
            // renderLoading={this.renderLoading}
            onLoadEnd={() => {
              this.setState({loading: false});
            }}
            injectedJavaScript={patchPostMessageJsCode}
            onMessage={this.handleMessage}
          />
        </ScrollView>

        {this.state.loading && <LoadingView />}
        {Platform.OS === 'android' ? <ShadowView /> : null}
        <Share
          onSnapshot={a => this.refs[a]}
          ref="shareComponent"
          shareOptions={{
            title: params.article.title,
            message: params.article.discription,
            url:
              ImageUrl +
              '/content?id=' +
              articleId +
              '&language=' +
              I18n.locale +
              '&share=true',
            id: params.article.id,
            subject: params.article.title,
            type: 'article',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    paddingRight: 25,
    alignItems: 'center',
  },
  mR30: {
    marginRight: 30,
  },
  base: {
    flex: 1,
  },
  webView: {
    flex: 1,
    height:
      Platform.OS === 'ios'
        ? Dimensions.get('window').height - 50
        : ExtraDimensions.get('REAL_WINDOW_HEIGHT') -
          ExtraDimensions.get('STATUS_BAR_HEIGHT') -
          60,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#FFF',
    position: 'relative',
    paddingBottom: 0,
  },
  containerWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  containerTop: {
    marginVertical: 20,
    paddingHorizontal: 18,
  },
  topInfo: {
    flexDirection: 'row',
    marginTop: 5,
  },
  topInfoItem: {
    fontSize: 12,
    color: '#BFBFBF',
    marginRight: 10,
  },
  title: {
    textAlign: 'left',
    lineHeight: 34,
    fontSize: 24,
    color: '#3A424C',
    fontWeight: '700',
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  spinnerContent: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * (7 / 10),
    height: Dimensions.get('window').width * (7 / 10) * 0.68,
    backgroundColor: '#fcfcfc',
    padding: 20,
    borderRadius: 5,
  },
  spinnerTitle: {
    fontSize: 18,
    color: '#313131',
    textAlign: 'center',
    marginTop: 5,
  },
  shareParent: {
    flexDirection: 'row',
    marginTop: 20,
  },
  shareContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    width: 40,
    height: 40,
  },
});
// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(WebViewPage);
export default WebViewPage;
