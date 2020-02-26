// import React from 'react';
// import {
//   Modal,
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';

// let SCREEN_WIDTH = Dimensions.get('window').width;
// let SCREEN_HEIGHT = Dimensions.get('window').height;

// const Dialog = ({
//                   visible,
//                   children,
//                   dialogCancelText,
//                   dialogSubmitText,
//                   cancelBtnAction,
//                   submitBtnAction,
//                 }) => {
//   const twoBtn = dialogCancelText && dialogSubmitText;
//   return (
//     <Modal visible={visible}
//            transparent={true}
//            onRequestClose={() => { }}>
//       <View style={styles.bg}>
//         <View style={styles.dialog}>
//           <View style={styles.dialogContent}>
//             {children}
//           </View>
//           <View style={styles.dialogBtnContainer}>
//             {dialogCancelText && (
//               <TouchableOpacity style={[styles.dialogBtn, styles.dialogCancelBtn, twoBtn && styles.twoBtnWidth]}
//                                 onPress={cancelBtnAction}>
//                 <Text style={styles.cancelBtnText}>
//                   {dialogCancelText}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             {dialogSubmitText && (
//               <TouchableOpacity style={[styles.dialogBtn, styles.dialogSubmitBtn, twoBtn && styles.twoBtnWidth]}
//                                 onPress={submitBtnAction}>
//                 <Text style={styles.submitBtnText}>
//                   {dialogSubmitText}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>

//   );
// };
// Dialog.defaultProps = {
//   visible: false,
//   children: (<View/>),
//   dialogCancelBtn: '',
//   dialogSubmitText: 'Okay',
//   cancelBtnAction: () => {
//   },
//   submitBtnAction: () => {
//   },
// };

// fanliangqin: try to define custom component

import React from 'react';
import PropTypes from 'prop-types';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';

class Dialog extends React.Component {
  static defaultProps = {
    visible: false,
    children: <View />,
    dialogCancelBtn: '',
    dialogSubmitText: 'Okay',
    cancelBtnAction: () => {},
    submitBtnAction: () => {},
  };

  static propTypes = {
    visible: PropTypes.bool,
    children: PropTypes.element,
    dialogCancelText: PropTypes.string,
    dialogSubmitText: PropTypes.string,
    cancelBtnAction: PropTypes.func,
    submitBtnAction: PropTypes.func.isRequired,
  };

  render() {
    const dialogCancelText = this.props.dialogCancelText;
    const dialogSubmitText = this.props.dialogSubmitText;
    const twoBtn = dialogCancelText && dialogSubmitText;
    const visible = this.props.visible;
    const children = this.props.children;
    const cancelBtnAction = this.props.cancelBtnAction;
    const submitBtnAction = this.props.submitBtnAction;

    return (
      <Modal visible={visible} transparent={true} onRequestClose={() => {}}>
        <View style={styles.bg}>
          <View style={styles.dialog}>
            <View style={styles.dialogContent}>{children}</View>
            <View style={styles.dialogBtnContainer}>
              {dialogCancelText && (
                <TouchableOpacity
                  style={[
                    styles.dialogBtn,
                    styles.dialogCancelBtn,
                    twoBtn && styles.twoBtnWidth,
                  ]}
                  onPress={cancelBtnAction}>
                  <Text style={styles.cancelBtnText}>{dialogCancelText}</Text>
                </TouchableOpacity>
              )}
              {dialogSubmitText && (
                <TouchableOpacity
                  style={[
                    styles.dialogBtn,
                    styles.dialogSubmitBtn,
                    twoBtn && styles.twoBtnWidth,
                  ]}
                  onPress={submitBtnAction}>
                  <Text style={styles.submitBtnText}>{dialogSubmitText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 23,
  },
  dialog: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 18,
    position: 'relative',
  },
  dialogBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  twoBtnWidth: {
    width: 140,
  },
  dialogBtn: {
    height: 57,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  dialogCancelBtn: {
    borderColor: '#BFC0BF',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#4A4B4A',
  },
  dialogSubmitBtn: {
    backgroundColor: '#00AEEF',
  },
  submitBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
});
export default Dialog;
