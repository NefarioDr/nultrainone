import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import I18nn from '../../../resources/languages/I18n';
import {formatStringWithHtml} from '../../commons/FormatUtil';
import {ImageUrl} from '../../constants/Urls';
import {formatDateSpliceDay} from '../../commons/FormatUtil';
import PreloadImage from '../components/PreloadImage';

const smallDefault = require('../../../resources/img/newsBaseImg.png');
const largeDefault = require('../../../resources/img/largeDefault.png');

const ItemCell = ({article, onPressHandler}) => (
  console.log(`ItemCell: ${JSON.stringify(article)}`),

  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.container}
    onPress={() => onPressHandler(article)}>
    {/*1张小图 */}
    <View
      style={[
        styles.containerItem,
        article.sImg.length === 1 && article.isMaxImg === false
          ? styles.show
          : styles.hide,
      ]}>
      <View style={[styles.itemContent]}>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={[styles.title, styles.titleS]}>
          {formatStringWithHtml(article.title)}
        </Text>
        <View style={[styles.itemRightBottom, styles.itemRightBottomP]}>
          <View style={styles.leftInfo}>
            <Text style={styles.itemText}>{I18nn.t('page.ultrainTrends')}</Text>
            <Text style={styles.itemText}>
              {formatDateSpliceDay(article.updateDate, I18nn.locale)}
            </Text>
          </View>
          {/* <Text style={styles.itemText}>{article.likeNum}{I18nn.t("page.Like")}</Text> */}
        </View>
      </View>
      <View style={styles.sImg}>
        <PreloadImage
          source={
            article.sImg != null && article.sImg.length > 0
              ? {
                  uri: ImageUrl + article.sImg[0].url,
                }
              : smallDefault
          }
          defaultSource={smallDefault}
          height={97}
          width="100%"
          style={{flex: 1, alignItems: 'stretch'}}
        />
      </View>
    </View>

    {/*大于1张图*/}
    <View
      style={[
        styles.containerItem,
        styles.containerMore,
        article.sImg.length > 1 ? styles.show : styles.hide,
      ]}>
      <View style={[styles.itemMoreContent]}>
        <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.title]}>
          {formatStringWithHtml(article.title)}
        </Text>
      </View>
      <View style={styles.imgWrap}>
        {article.sImg &&
          article.sImg.map((d, index) => {
            return (
              <PreloadImage
                key={index}
                source={
                  article.sImg != null && article.sImg.length > 0
                    ? {
                        uri: ImageUrl + article.sImg[index].url,
                      }
                    : smallDefault
                }
                defaultSource={smallDefault}
                height={97}
                width="33%"
                style={{flex: 1, alignItems: 'stretch'}}
              />
            );
          })}
      </View>
      <View style={styles.itemRightBottom}>
        <View style={styles.leftInfo}>
          <Text style={styles.itemText}>{I18nn.t('page.ultrainTrends')}</Text>
          <Text style={styles.itemText}>
            {formatDateSpliceDay(article.updateDate, I18nn.locale)}
          </Text>
        </View>
        {/* <Text style={styles.itemText}>{article.likeNum}{I18nn.t("page.Like")}</Text> */}
      </View>
    </View>

    {/*1张大图*/}
    <View
      style={[
        styles.containerItem,
        styles.containerMore,
        article.sImg.length === 1 && article.isMaxImg === true
          ? styles.show
          : styles.hide,
      ]}>
      <View style={[styles.itemMoreContent]}>
        <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.title]}>
          {formatStringWithHtml(article.title)}
        </Text>
      </View>
      <View style={styles.bImg}>
        <PreloadImage
          source={
            article.sImg != null && article.sImg.length > 0
              ? {
                  uri: ImageUrl + article.sImg[0].url,
                }
              : largeDefault
          }
          defaultSource={largeDefault}
          height={200}
          width="100%"
          style={{flex: 1, alignItems: 'stretch'}}
        />
      </View>
      <View style={styles.itemRightBottom}>
        <View style={styles.leftInfo}>
          <Text style={styles.itemText}>{I18nn.t('page.ultrainTrends')}</Text>
          <Text style={styles.itemText}>
            {formatDateSpliceDay(article.updateDate, I18nn.locale)}
          </Text>
        </View>
        {/* <Text style={styles.itemText}>{article.likeNum}{I18nn.t("page.Like")}</Text> */}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  container: {
    // paddingHorizontal: 12,
    backgroundColor: '#1B1B20',
  },
  containerItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B20',
    borderBottomColor: '#2C2C31',
    borderBottomWidth: 0.5,
  },
  containerMore: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    textAlign: 'left',
    color: '#fff',
    lineHeight: 18,
    fontFamily: '.SFUIDisplay',
  },
  titleRead: {
    color: 'rgba(255,255,255,0.5)',
  },
  titleS: {
    paddingTop: 4,
  },
  sImg: {
    flex: 1,
    maxWidth: 117,
    height: 97,
    borderRadius: 3,
    overflow: 'hidden',
    borderColor: 'transparent',
  },
  itemImg: {
    width: '100%',
    height: '100%',
  },

  imgWrap: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,
    overflow: 'hidden',
  },
  imgItemWrap: {
    flex: 1,
    height: 97,
  },
  imgItemWrapItem: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 2,
    height: 97,
    flexDirection: 'column',
    position: 'relative',
    marginRight: 10,
  },
  itemMoreContent: {
    width: '100%',
    marginBottom: 10,
    height: 'auto',
    alignItems: 'flex-start',
  },
  bImg: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    overflow: 'hidden',
    height: 200,
    borderRadius: 3,
    borderColor: 'transparent',
  },
  bigItemImg: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  itemRightBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRightBottomP: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  leftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 12,
    color: '#BFBFBF',
  },
});

export default ItemCell;
