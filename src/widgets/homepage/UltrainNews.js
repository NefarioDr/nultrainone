import React from 'react';
import {StyleSheet, View, DeviceEventEmitter} from 'react-native';
import {Dimensions} from 'react-native';
import ItemCell from './ItemCell';
import ItemListView from './ItemListView';
// import {NavigationActions} from 'react-navigation';
import I18n from '../../../resources/languages/I18n';
import CardContainer from '../components/CardContainer';
import ListView from 'deprecated-react-native-listview';
class UltrainNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '',
      dataSource: null,
      refreshing: true,
      totalItems: 0,
      _data: [],
      _page: 1,
    };
  }

  UNSAFE_componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('refreshMainList');
  }

  componentDidMount() {}
  // 下拉刷新
  _onRefresh = () => {};

  // 列表每条
  renderItem = article => {
    return (
      <ItemCell
        article={article}
        onPressHandler={article => {
          // TODO(liangqin) navigate to web view
          // const navigateAction = NavigationActions.navigate({
          //   routeName: 'Web',
          //   params: {callbackRoute: 'UltrainNews', article: article},
          // });
          // this.props.navigation.dispatch(navigateAction);
        }}
      />
    );
  };

  // 跳转到更多列表
  moreList = moreUrl => {
    const {navigate} = this.props.navigation;
    navigate(moreUrl);
  };

  render() {
    const {topContent} = this.props;
    if (!topContent) {
      return null;
    }
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const data = topContent;
    // console.log(`FFFFF: data = ${JSON.stringify(data)}`);
    const dataSource = ds.cloneWithRows(data);
    return (
      <CardContainer
        title={I18n.t('title.topNews')}
        show={true}
        noTopBorder={true}
        style={{marginHorizontal: 20}}
        goMore={() => this.moreList('MoreNewList')}>
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

export default UltrainNews;
