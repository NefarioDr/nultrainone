import React from 'react';
import {ListView, StyleSheet, View, DeviceEventEmitter} from 'react-native';
import ItemCell from '../Store/ItemCell';
import ItemListView from '../Store/ItemListView';
import CardContainer from '../Store/components/CardContainer';
import CacheUtils from '../../constants/commons/CacheUtil';
import I18n from '../../../resources/languages/I18n';

class StoreContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyWord: '',
      dataSource: null,
      totalItems: 0,
      _data: [],
      _page: 1,
      network: 'MainNet',
    };
  }

  componentWillUnmount() {}

  componentWillMount() {
    // 获取当前选中的网络
    CacheUtils.getItem('selectNetwork', (err, ret) => {
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
  }

  async componentDidMount() {
    // 监听网络变动
    DeviceEventEmitter.addListener('selectNetwork', network => {
      this.setState({
        network,
      });
    });
  }

  // 下拉刷新
  _onRefresh = () => {};

  // 列表每条
  renderItem = article => {
    return (
      <ItemCell
        style={styles.itemCell}
        article={article}
        onPressHandler={link => {
          this.props.onBuy(article.price);
        }}
      />
    );
  };

  // 跳转到更多商品
  moreList = moreUrl => {
    const {navigate} = this.props.navigation;
    navigate(moreUrl);
  };

  render() {
    const {store} = this.props;

    if (!store) {
      return null;
    }
    /* {由于container使用scrollView，这里不做滚动事件监听}*/
    if (this.state.network === 'MainNet') {
      return null;
    }
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const data = store;
    const dataSource = ds.cloneWithRows(data);
    return (
      <CardContainer
        title={I18n.t('title.store')}
        noTopBorder={true}
        show={true}
        style={{marginHorizontal: 20}}
        goMore={() => this.moreList('Store')}>
        <View style={styles.container}>
          <ItemListView dataSource={dataSource} renderItem={this.renderItem} />
        </View>
      </CardContainer>
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

export default StoreContent;
