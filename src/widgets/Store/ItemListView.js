import React from 'react';
import {ListView, StyleSheet} from 'react-native';

//资讯的分页有点特殊,外加scrollview,容易出现滚动一次触发多次请求的情况
const ItemListView = ({dataSource, onEndReached, onRefresh, renderItem}) => (
  <ListView
    initialListSize={10}
    dataSource={dataSource}
    renderRow={renderItem}
    contentContainerStyle={styles.listView}
    removeClippedSubviews={false}
    onEndReached={onEndReached}
    scrollRenderAheadDistance={2000}
    scrollEventThrottle={5000}
  />
);

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default ItemListView;
