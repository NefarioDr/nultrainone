import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Linking,
  Dimensions, DeviceEventEmitter
} from "react-native";
import I18n from "react-native-i18n";
const Logo = require("../img/ultrain_s.png");
const maxWidth = Dimensions.get("window").width;
import Button from './Button'

class DownloadModul extends React.Component {
  handleOpen=()=>{
    let url = 'http://developer.ultrain.info/shareSoftware?language=' + I18n.locale
    Linking.openURL(url)
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={Logo} style={{width:103,height:26}} />
        <View style={styles.lineWrap}></View>
        <View style={styles.textView}>
          <Text style={{color:'#000000',fontSize:13, lineHeight:15,}}>{I18n.t("page.ultrainLemmnTwo")}</Text>
        </View>
        <Button containerStyle={styles.btn} style={styles.btnText} text={I18n.t('btn.open')} onPress={this.handleOpen}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
      width:maxWidth,
      height:57,
      backgroundColor:'#D8D8D8',
      position:'absolute',
      bottom:0,
      left:0,
      right:0,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingHorizontal: 20,
    },
    lineWrap:{
        width:1,
        height:10,
        backgroundColor:'rgba(0,0,0,.3)',
        marginHorizontal: 10,
    },
    textView:{
      flex:1,
      paddingRight: 10,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'flex-start',
    },
    btn:{
      width:60,
      height:32,
      backgroundColor: '#4A90E2',
      borderRadius:16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText:{
        fontSize:12,
      color:'#fff',
    }
});

export default DownloadModul;
