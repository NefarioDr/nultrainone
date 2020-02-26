import React from 'react';
import {ListView, StyleSheet} from 'react-native';

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
