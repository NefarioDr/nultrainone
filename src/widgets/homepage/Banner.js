import React from 'react';
import {
  ListView,
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {BaseUrl, ImageUrl} from '../../constants/Urls';
import LoadingDecView from '../components/LoadingDecView';
import {Dimensions} from 'react-native';

import * as readService from '../../../services/read';
import {NavigationActions} from 'react-navigation';

class Banner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loading: true,
      refreshing: true,
      list: [],
      _data: [],
    };
  }

  componentWillMount() {
    this._fetchData();
  }

  _fetchData = () => {
    readService
      .getContentsByCategoryUrl({
        current: 1,
        pageSize: 3,
        categoryUrl: 'app/newsCarousel',
        model: 'simple',
      })
      .then(result => {
        if (result.state === 'success') {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result.docs),
            list: result.docs,
            loading: false,
            refreshing: false,
            _data: result.docs,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  onPressHandler = article => {
    console.log(article);
    const {navigate} = this.props.navigation;
    if (this.state.isLoading) {
      return <LoadingDecView loading={this.state.isLoading} />;
    }
    if (!article.outlink || article.outlink === 'notLink') {
      navigate('Web', {article});
    } else {
      const navigateAction = NavigationActions.navigate({
        routeName: 'WebView',
        params: {url: article.outlink, shareUrl: article.outlink},
      });
      this.props.navigation.dispatch(navigateAction);
    }
  };

  renderBanner = () => {
    let imgs = [];
    this.state.list.map(item => {
      imgs.push(
        <View key={item.id}>
          <TouchableHighlight onPress={() => this.onPressHandler(item)}>
            <Image
              source={{uri: ImageUrl + item.sImg[0].url}}
              style={styles.bannerImg}
            />
          </TouchableHighlight>
        </View>,
      );
    });
    return imgs;
  };

  render() {
    const isEmpty = this.state._data.length === 0;

    if (!isEmpty) {
      return (
        <View style={styles.swiperWrap}>
          <Swiper
            key={this.state.list.length}
            style={styles.swiper} //样式
            height={220} //组件高度
            loop={true} //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
            autoplay={true} //自动轮播
            autoplayTimeout={4} //每隔4秒切换
            horizontal={true} //水平方向，为false可设置为竖直方向
            paginationStyle={{bottom: 10}} //小圆点的位置：距离底部10px
            showsButtons={false} //为false时不显示控制按钮
            showsPagination={true} //为false不显示下方圆点
            dot={
              <View
                style={{
                  //未选中的圆点样式
                  backgroundColor: 'rgba(255,255,255,.3)',
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  //选中的圆点样式
                  backgroundColor: '#fff',
                  width: 10,
                  height: 5,
                  borderRadius: 2.5,
                  marginLeft: 2.5,
                  marginRight: 2.5,
                }}
              />
            }>
            {this.renderBanner()}
          </Swiper>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
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
    width: Dimensions.width,
    height: 200,
    backgroundColor: '#000',
  },
  bannerImg: {
    width: Dimensions.width,
    height: '100%',
  },
});

export default Banner;
