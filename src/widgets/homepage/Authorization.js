import React from 'react';
import I18n from '../../../resources/languages/I18n';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ListView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as Images from '../../../resources/img/Images';
import StorageHelper from '../../commons/StorageHelper';
import AuthorizationManagement from './AuthorizationManagement';
import EmptyView from '../ItemDetail/EmptyView';
import * as dAppsService from '../services/dApps';
import {getWalletInfo} from '../../commons/WalletUtil';
import {BaseUrl, ImageUrl} from '../../constants/Urls';

const goNext = require('../../../resources/img/goNext.png');

export default class Authorization extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: I18n.t('page.authorizationText'),
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
    headerRight: (
      <View>
        <TouchableOpacity
          style={{marginRight: 18}}
          onPress={() => navigation.state.params.showManage()}>
          <Image
            source={{uri: Images.QUESTION}}
            style={{width: 17, height: 17}}
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
      showManagement: false,
      dappList: null,
      _data: [],
      totalItems: 0,
      _page: 1,
      network: 'MainNet',
    };
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.setParams({
      showManage: () => this.setState({showManagement: true}),
    });
  }

  async componentDidMount() {
    let ret = await StorageHelper.get('selectNetwork');
    this.setState({
      network: ret.key,
    });
    await this.getWalletInfo();
    this._fetchData();
  }

  getWalletInfo = async () => {
    const {userInfo} = this.props;
    const walletInfo = await getWalletInfo(this.state.network, userInfo);
    this.setState({
      walletInfo: walletInfo,
    });
  };

  _onScroll = e => {
    var windowHeight = Dimensions.get('window').height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;
    if (windowHeight + offset >= height) {
      this._fetchMore();
    }
  };

  _fetchData = () => {
    let param = {
      current: 1,
      pageSize: 10,
      accountName: this.state.walletInfo.accountName,
      network: this.state.network,
    };
    dAppsService
      .dappList(param)
      .then(result => {
        if (result.state === 'success') {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
          });
          const data = result.docs;
          if (data.length > 0) {
            this.setState({
              dappList: ds.cloneWithRows(data),
              _data: data,
              totalItems: result.pageInfo.totalItems,
              _page: result.pageInfo.current,
            });
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  _fetchMore = () => {
    this.setState({
      isLoadingMore: true,
    });
    let param = {
      current: this.state._page + 1,
      pageSize: 10,
      accountName: this.state.walletInfo.accountName,
      network: this.state.network,
    };
    dAppsService
      .dappList(param)
      .then(result => {
        if (result.state === 'success') {
          //console.log(result);
          if (result.docs.length > 0) {
            //如果重复请求,则不再拼接
            if (result.pageInfo.current === this.state._page) {
              return false;
            }
            const data = this.state._data.concat(result.docs);
            this.setState({
              // dappList:  ds.cloneWithRows(Data),
              dappList: this.state.dappList.cloneWithRows(data),
              _data: data,
              isLoadingMore: false,
              totalItems: result.pageInfo.totalItems,
              _page: result.pageInfo.current,
            });
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  goDapp = (link, accountName, chainId, name) => {
    const connector = link.includes('?') ? '&' : '?';
    this.props.navigation.navigate('WebView', {
      url: link + connector + `accountName=${accountName}&chainId=${chainId}`,
      shareUrl:
        link + connector + `accountName=${accountName}&chainId=${chainId}`,
      name: name,
    });
  };

  authorizationItem = data => {
    const dappInfo = data.dappId;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          this.goDapp(
            dappInfo.link,
            data.accountName,
            data.chainId,
            dappInfo.name,
          )
        }>
        <View style={styles.authorizationLi}>
          <View style={styles.authorizationBox}>
            <Image
              source={{uri: ImageUrl + '/' + dappInfo.icon}}
              style={{width: 42, height: 49}}
            />
            <View style={styles.textBox}>
              <Text style={styles.name}>
                {I18n.locale === 'en' ? dappInfo.nameEn : dappInfo.name}
              </Text>
              <Text style={styles.time}>
                {I18n.t('page.authorizationDate')}
                {data.authTime.substr(0, 10)}
              </Text>
            </View>
          </View>
          <Image source={goNext} style={{width: 6, height: 12}} />
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state._data.length >= this.state.totalItems) {
      return (
        <View style={styles.loadMoreStyle}>
          <Text style={styles.noMoreStyle}>{I18n.t('page.nomore')}</Text>
        </View>
      );
    }

    return (
      this.state.isLoadingMore && (
        <View style={{flex: 1, padding: 10}}>
          <ActivityIndicator size="small" />
        </View>
      )
    );
  };

  render() {
    if (!this.state.dappList) {
      return (
        <View style={{backgroundColor: '#1E1E24', height: '100%'}}>
          <StatusBar backgroundColor="#1E1E24" translucent={false}/>
          <EmptyView emptyInfo={I18n.t('page.UnauthorizedApplication')} />
          <AuthorizationManagement
            visible={this.state.showManagement}
            close={() => {
              this.webview.postMessage(JSON.stringify({canceled: true}));
              this.setState({showManagement: false});
            }}
          />
        </View>
      );
    } else {
      return (
        <ScrollView
          style={styles.container}
          onScroll={this._onScroll}
          scrollEventThrottle={4000}>
          <StatusBar backgroundColor="#1E1E24" translucent={false}/>
          <ListView
            initialListSize={10}
            dataSource={this.state.dappList}
            renderRow={this.authorizationItem}
            removeClippedSubviews={false}
            scrollRenderAheadDistance={2000}
            scrollEventThrottle={5000}
            // renderFooter={this.renderFooter}
          />
          <AuthorizationManagement
            visible={this.state.showManagement}
            close={() => {
              this.webview.postMessage(JSON.stringify({canceled: true}));
              this.setState({showManagement: false});
            }}
          />
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E24',
    height: '100%',
    padding: 25,
  },
  authorizationLi: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
  },
  authorizationBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20,
  },
  name: {
    fontSize: 17,
    color: '#FFF',
    lineHeight: 20,
  },
  time: {
    fontSize: 13,
    color: '#868686',
    lineHeight: 20,
  },
  loadMoreStyle: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  noMoreStyle: {
    color: '#aaaaaa',
  },
});
// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(Authorization);
