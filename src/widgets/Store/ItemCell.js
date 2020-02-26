import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import I18n from '../../../resources/languages/I18n';
import {formatStringWithHtml} from '../commons/FormatUtil';
import {BaseUrl, ImageUrl} from '../../constants/Urls';
import {fontFamilyPingFang} from '../ItemDetail/FontFamily';
import * as Images from '../../../resources/img/Images';

const maxWidth = (Dimensions.get('window').width - 55) / 2;

const ItemCell = ({article, onPressHandler}) => (
  <TouchableOpacity
    style={styles.containerWrap}
    onPress={() => onPressHandler(article.price)}>
    <View style={styles.container}>
      <View style={styles.bImg}>
        <Image
          source={{uri: ImageUrl + '/' + article.pic}}
          style={styles.pic}
          resizeMode={'stretch'}
        />
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.title]}>
        {formatStringWithHtml(article.name)}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          height: 28,
          alignItems: 'center',
          marginBottom: 3,
        }}>
        <Image
          source={{uri: Images.POINT_ICON}}
          style={{width: 28, height: 28, marginTop: 6}}
        />
        <Text style={{fontSize: 15, color: '#FFB301'}}>{article.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onPressHandler(article.link)}
        style={styles.btn}>
        <Text style={styles.btnText}>{I18n.t('page.buy')}</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerWrap: {
    width: maxWidth,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 25,
  },
  title: {
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
    height: 35,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 17,
    textAlign: 'left',
    fontFamily: fontFamilyPingFang,
  },
  bImg: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 3,
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  btn: {
    width: '100%',
    height: 30,
    backgroundColor: 'rgba(255,255,255,.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  btnText: {
    fontSize: 15,
    color: '#fff',
  },
});

export default ItemCell;
