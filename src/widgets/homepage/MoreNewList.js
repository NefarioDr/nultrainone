import React from 'react';
import {
  ScrollView,
  ListView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Dimensions} from 'react-native';
import ItemCell from './ItemCell';
import ItemListView from './ItemListView';
import EmptyView from '../ItemDetail/EmptyView';
import LoadingDecView from '../components/LoadingDecView';
import {NavigationActions} from 'react-navigation';
import * as readService from '../../../services/read';
import {PAGE_SIZE_10} from '../../constants/Common';
import I18n from '../../../resources/languages/I18n';
import CacheUtil from '../../constants/commons/CacheUtil';

import * as Images from '../../../resources/img/Images';

class MoreNewList extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: I18n.t('title.news'),
    headerStyle: {
      backgroundColor: '#1B1B20',
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      margin: 5,
    },
    headerTintColor: '#fff',
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
  });

  constructor(props) {
    super(props);
    this.state = {
      keyWord: '',

      dataSource: null,
      isLoading: true,
      isLoadingMore: false,
      refreshing: true,
      totalItems: 0,
      _data: [],
      _page: 1,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this._fetchData();
  }
  _onScroll = e => {
    var windowHeight = Dimensions.get('window').height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;
    console.log(
      'windowHeight:' +
        windowHeight +
        ', offset:' +
        offset +
        ', height:' +
        height +
        ': ' +
        (windowHeight + offset >= height),
    );
    if (windowHeight + offset >= height) {
      this._fetchMore();
    }
  };

  _fetchData = () => {
    readService
      .getContentsByCategoryUrl({
        current: 1,
        pageSize: PAGE_SIZE_10,
        categoryUrl: 'app/topContent',
        model: 'simple',
      })
      .then(result => {
        if (result.state === 'success') {
          // console.log(result);

          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
          });
          const data = result.docs;
          this.setState({
            dataSource: ds.cloneWithRows(data),
            isLoading: false,
            refreshing: false,
            totalItems: result.pageInfo.totalItems,
            _data: data,
            _page: 1,
          });

          //异步更新已读状态
          for (var i in data) {
            let index = i;
            CacheUtil.getItem('article_' + data[index].id, (err, result) => {
              data[index].isRead = Boolean(result);
            });
          }
          setTimeout(() => {
            this.setState({
              _data: data,
              dataSource: ds.cloneWithRows(data),
            });
          }, 50);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  _fetchMore = keyWord => {
    keyWord = keyWord === undefined ? '' : keyWord;
    this.setState({
      isLoadingMore: true,
      keyWord: keyWord,
    });
    readService
      .getContentsByCategoryUrl({
        current: this.state._page + 1,
        pageSize: PAGE_SIZE_10,
        categoryUrl: 'app/topContent',
        model: 'simple',
      })
      .then(result => {
        if (result.state === 'success') {
          //console.log(result);

          //如果重复请求,则不再拼接
          if (result.pageInfo.current === this.state._page) {
            return false;
          }

          const data = this.state._data.concat(result.docs);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isLoadingMore: false,
            totalItems: result.pageInfo.totalItems,
            refreshing: false,
            _data: data,
            _page: result.pageInfo.current,
          });

          //异步更新已读状态
          for (var i in data) {
            let index = i;
            CacheUtil.getItem('article_' + data[index].id, (err, result) => {
              data[index].isRead = Boolean(result);
            });
          }
          setTimeout(() => {
            let ds = new ListView.DataSource({
              rowHasChanged: (r1, r2) => r1 !== r2,
            });
            this.setState({
              _data: data,
              dataSource: this.state.dataSource.cloneWithRows(data),
            });
          }, 50);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  // 下拉刷新
  _onRefresh = () => {
    this.setState({refreshing: true});
    this._fetchData();
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

  renderItem = article => {
    return (
      <ItemCell
        article={article}
        onPressHandler={article => {
          const {navigate} = this.props.navigation;
          if (this.state.isLoading) {
            return <LoadingDecView loading={this.state.isLoading} />;
          }
          //如果文章详情页已打开,则设置为已读,并存入缓存
          CacheUtil.saveItem('article_' + article.id, true);

          const navigateAction = NavigationActions.navigate({
            routeName: 'Web',
            params: {callbackRoute: 'MainContent', article: article},
          });
          this.props.navigation.dispatch(navigateAction);
        }}
      />
    );
  };

  render() {
    const {params} = this.props.navigation.state;
    if (this.state.isLoading) {
      return <LoadingDecView loading={this.state.isLoading} />;
    }
    const isEmpty = this.state._data.length === 0;
    if (isEmpty) {
      return (
        <EmptyView
          isRefreshing={this.state.refreshing}
          onRefresh={() => this._onRefresh()}
        />
      );
    }

    {
      /* {由于container使用scrollView，这里不做滚动事件监听}*/
    }
    return (
      <ScrollView
        style={styles.container}
        onScroll={this._onScroll}
        scrollEventThrottle={4000}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent={false}
        />
        <View style={styles.moreNewList}>
          <ItemListView
            dataSource={this.state.dataSource}
            renderItem={this.renderItem}
            renderFooter={this.renderFooter}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B1B20',
    paddingLeft: 10,
    paddingLeft: 10,
  },
  moreNewList: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  drawerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerTitleContent: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#3e9ce9',
  },
  drawerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  drawerTitle: {
    fontSize: 20,
    textAlign: 'left',
    color: '#fcfcfc',
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    textAlign: 'center',
    color: 'black',
  },
  timeAgo: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 5,
  },
  refreshControlBase: {
    backgroundColor: 'transparent',
  },
  tab: {
    paddingBottom: 0,
  },
  tabText: {
    fontSize: 16,
  },
  tabBarUnderline: {
    backgroundColor: '#3e9ce9',
    height: 2,
  },
  swiperWrap: {
    height: 200,
  },
  bannerImg: {
    width: Dimensions.width,
    height: '100%',
  },
  loadDataStyle: {
    marginVertical: 20,
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

export default MoreNewList;
