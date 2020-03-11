import React from 'react';
import {StyleSheet} from 'react-native';
import ListView from 'deprecated-react-native-listview';
//资讯的分页有点特殊,外加scrollview,容易出现滚动一次触发多次请求的情况
const ItemListView = ({
  dataSource,
  onEndReached,
  onRefresh,
  renderItem,
  renderFooter,
}) => (
  <ListView
    initialListSize={10}
    dataSource={dataSource}
    renderRow={renderItem}
    style={styles.listView}
    removeClippedSubviews={false}
    onEndReached={onEndReached}
    scrollRenderAheadDistance={2000}
    scrollEventThrottle={5000}
    renderFooter={renderFooter}
  />
);

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#1B1B20',
  },
  refreshControlBase: {
    backgroundColor: 'transparent',
  },
});

export default ItemListView;

// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';

// //资讯的分页有点特殊,外加scrollview,容易出现滚动一次触发多次请求的情况
// const ItemListView = ({ dataSource, onEndReached, onRefresh, renderItem }) => (

//   <FlatList
//     data={dataSource}
//     renderItem={renderItem}
//     // contentContainerStyle={styles.listView}
//     // removeClippedSubviews={false}
//     // onEndReached={onEndReached}
//     // scrollRenderAheadDistance={2000}
//     // scrollEventThrottle={5000}
//   />
// );

// const styles = StyleSheet.create({
//   listView: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
// });

// export default ItemListView;
