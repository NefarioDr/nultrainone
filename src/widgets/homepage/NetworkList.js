import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';

// import {connect} from 'react-redux';

const selectionIcon = require('../../../resources/img/selectionIcon.png');

const NetworkList = ({visible, selectNetwork, selectionNetwork}) => {
  const selectFun = select => {
    selectNetwork(select);
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        visible = false;
      }}>
      <View style={styles.networkList}>
        <TouchableOpacity
          style={styles.closeModel}
          activeOpacity={0.8}
          onPress={() => selectFun(selectionNetwork)}
        />
        <ScrollView style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectFun('TestNet')}>
            <View style={styles.networkLi}>
              <Text style={styles.networkText}>TestNet</Text>
              {selectionNetwork == 'TestNet' && (
                <Image
                  resizeMode="contain"
                  style={{width: 23}}
                  source={selectionIcon}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectFun('MainNet')}>
            <View style={styles.networkLi}>
              <Text style={styles.networkText}>MainNet</Text>
              {selectionNetwork == 'MainNet' && (
                <Image
                  resizeMode="contain"
                  style={{width: 23}}
                  source={selectionIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

NetworkList.defaultProps = {
  selectNetwork: () => {},
  selectionNetwork: 'TestNet',
};

const styles = StyleSheet.create({
  networkList: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeModel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40%',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    padding: 20,
  },
  networkLi: {
    height: 77,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  networkText: {
    fontSize: 18,
    color: '#666',
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(NetworkList);
export default NetworkList;
