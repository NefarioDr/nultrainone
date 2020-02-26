import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Image,
} from 'react-native';

// import {connect} from 'react-redux';
import I18n from '../../../resources/languages/I18n';

const closeIcon = require('../../../resources/img/closeIcon.png');
const authorizationImg = require('../../../resources/img/authorizationImg.png');

const AuthorizationManagement = ({visible, close}) => {
  return (
    <Modal onRequestClose={() => {}} visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.management}>
          <TouchableOpacity
            style={{position: 'absolute', right: 17, top: 14}}
            onPress={() => close()}>
            <Image source={closeIcon} style={{width: 12, height: 12}} />
          </TouchableOpacity>
          <Image source={authorizationImg} style={{width: 99, height: 96}} />
          <Text style={styles.title}>
            {I18n.t('page.authorizationManagement')}
          </Text>
          <Text style={styles.dec}>{I18n.t('page.authorizationTips')}</Text>
        </View>
      </View>
    </Modal>
  );
};

AuthorizationManagement.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  management: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    width: 330,
    height: 306,
    paddingTop: 30,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    fontSize: 18,
    marginTop: 22,
  },
  dec: {
    width: 260,
    color: 'rgba(0,0,0,.7)',
    fontSize: 14,
    marginTop: 20,
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(AuthorizationManagement);
export default AuthorizationManagement;
