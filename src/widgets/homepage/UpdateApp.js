import React from 'react';
import {StyleSheet, View, Modal, Text, Linking} from 'react-native';

import Button from '../components/Button';
import I18n from '../../../resources/languages/I18n';

class UpdateApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateApp = () => {
    const {updateUrl} = this.props;
    //Linking.openUrl('https://itunes.apple.com/us/app/expo-client/id982107779?mt=8')
    //Linking.openURL('itms-apps://itunes.apple.com/app/id1407704761')
    Linking.openURL(updateUrl);
  };

  changeLogBox = () => {
    const {changeLog} = this.props;
    let changeLogBox = [];
    changeLog.map((item, index) => {
      changeLogBox.push(
        <Text key={index} style={{paddingVertical: 5, width: '100%'}}>
          {index + 1}.{item}
        </Text>,
      );
    });
    return changeLogBox;
  };

  render() {
    const {visible} = this.props;
    return (
      <Modal
        onRequestClose={() => {}}
        visible={visible}
        transparent={true}
        animationType="fade">
        <View style={styles.updateAppBox}>
          <View style={styles.updateApp}>
            <Text style={{fontSize: 20, marginBottom: 10, textAlign: 'center'}}>
              {I18n.t('page.updatePrompt')}
            </Text>
            <Text style={{paddingVertical: 5, width: '100%'}}>
              {I18n.t('page.versionUpdated')}
            </Text>
            {this.changeLogBox()}
            <View style={styles.btnGroup}>
              <Button
                containerStyle={[styles.btn, styles.grayBtn]}
                style={[styles.btnText, styles.grayBtnText]}
                text={I18n.t('page.UpdateLater')}
                onPress={() => this.props.closeUpdateApp()}
              />
              <Button
                containerStyle={[styles.btn]}
                style={[styles.btnText]}
                text={I18n.t('page.Updated')}
                onPress={() => this.updateApp()}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  updateAppBox: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  updateApp: {
    width: '80%',
    minHeight: 140,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  btnGroup: {
    flex: 0.1,
    flexDirection: 'row',
  },
  btn: {
    height: 30,
    marginTop: 15,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
  },
  btnText: {
    fontSize: 12,
    color: '#fff',
  },
  grayBtn: {
    height: 30,
    marginTop: 15,
    paddingHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bdbdbd',
    marginRight: 25,
  },
  grayBtnText: {
    fontSize: 12,
    color: '#fff',
  },
});

export default UpdateApp;
