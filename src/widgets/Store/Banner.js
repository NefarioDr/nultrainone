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
import {Dimensions} from 'react-native';
import * as storeService from '../../services/store';
import NavigationUtil from '../commons/NavigationUtil';

class Banner extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this._fetchData.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loading: true,
      refreshing: true,
      bannerList: [],
      _data: [],
    };
  }

  // 下拉刷新
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData();
  };

  componentDidMount() {
    this._fetchData();
  }
  _fetchData = () => {
    let parames = {
      type: 1,
    };
    storeService
      .getAllLists(parames)
      .then(result => {
        if (result.state === 'success') {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(result.docs),
            bannerList: result.docs,
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

  handleBuy = () => {
    const {loggedIn} = this.props;
    if (loggedIn) {
      this.props.onBuy(4800);
    } else {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    }
  };
  renderBanner = () => {
    let imgs = [];
    this.state.bannerList.map(item => {
      imgs.push(
        <View key={item.rank}>
          <TouchableHighlight onPress={this.handleBuy}>
            <Image
              source={{uri: ImageUrl + '/' + item.pic}}
              style={styles.bannerImg}
              resizeMode={'stretch'}
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
            key={this.state.bannerList.length}
            style={styles.swiper} //样式
            height={375} //组件高度
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
  swiperWrap: {
    width: Dimensions.width,
    height: 375,
    position: 'relative',
  },
  bannerImg: {
    width: Dimensions.width,
    height: '100%',
  },
});
// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(
//   mapStateToProps,
//   null,
//   null,
//   {withRef: true},
// )(Banner);
export default Banner;
