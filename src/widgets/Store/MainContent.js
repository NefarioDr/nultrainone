import React from 'react';
import {ListView, StyleSheet, View, DeviceEventEmitter} from 'react-native';
import ItemCell from './ItemCell';
import ItemListView from './ItemListView';
import EmptyView from '../ItemDetail/EmptyView';
import LoadingDecView from '../components/LoadingDecView';
import * as storeService from '../../services/store';
import CacheUtil from '../commons/CacheUtil';

class UltrainNews extends React.Component {
  constructor(props) {
    super(props);

    this.fetchMore = this._fetchMore.bind(this);
    this.fetchData = this._fetchData.bind(this);
    this.state = {
      keyWord: '',

      dataSource: null,
      //isLoading: true,
      isLoadingMore: false,
      refreshing: true,
      totalItems: 0,
      _data: [],
      _page: 1,
    };
  }

  UNSAFE_componentWillMount() {
    DeviceEventEmitter.removeAllListeners('refreshMainList');
  }

  componentDidMount() {
    this._fetchData();
    DeviceEventEmitter.addListener('refreshMainList', () => {
      this._fetchData();
    });
  }

  _fetchData = keyWord => {
    keyWord = keyWord === undefined ? '' : keyWord;
    this.setState({
      keyWord: keyWord,
    });
    storeService
      .getAllLists({
        type: 0,
      })
      .then(result => {
        if (result.state === 'success') {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
          });
          const data = result.docs;
          this.setState({
            dataSource: ds.cloneWithRows(data),
            isLoading: false,
            refreshing: false,
            _data: data,
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
  // 下拉刷新
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
  };
  _fetchMore = () => {
    this.setState({
      isLoadingMore: true,
    });
    storeService
      .getAllLists({
        type: 0,
      })
      .then(result => {
        if (result.state === 'success') {
          //如果重复请求,则不再拼接
          const data = result.docs;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isLoadingMore: false,
            refreshing: false,
            _data: data,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  renderItem = article => {
    return (
      <ItemCell
        style={styles.itemCell}
        article={article}
        onPressHandler={link => {
          const {loggedIn} = this.props;
          if (loggedIn) {
            this.props.onBuy(article.price);
          } else {
            NavigationUtil.reset(this.props.navigation, 'Landing');
          }
          /*const navigateAction = NavigationActions.navigate({
            routeName: "WebView",
            params: { url: link }
          });
          this.props.navigation.dispatch(navigateAction);*/
        }}
      />
    );
  };

  render() {
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
      <View style={styles.container}>
        <ItemListView
          dataSource={this.state.dataSource}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadMoreStyle: {
    width: '100%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.1)',
    borderRadius: 20,
  },
  noMoreStyle: {
    color: '#fff',
  },
  itemCell: {
    width: 160,
  },
});

export default UltrainNews;
