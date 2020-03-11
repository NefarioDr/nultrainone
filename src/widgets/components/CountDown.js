import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, AppState, StyleSheet} from 'react-native';
import I18n from '../../../resources/languages/I18n';

function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

export default class CountDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      countdown: -1,
      disabled: false,
    };
    this.backgroundTime = 0;
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  UNSAFE_componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.interval && clearInterval(this.interval);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      this.backgroundTime = new Date().getTime() / 1000;
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.backgroundTime = fomatFloat(
        new Date().getTime() / 1000 - this.backgroundTime,
        0,
      );
    }
    this.setState({appState: nextAppState});
  };

  async setCountdown(countdown) {
    this.setButtonClickDisable(true);
    const {onPressHandler} = this.props;
    let valid = await onPressHandler();
    if (valid) {
      this.setState({
        countdown: countdown,
      });
      this.startCountDown();
    } else {
      this.setButtonClickDisable(false);
    }
  }

  getCountdown() {
    return this.state.countdown;
  }

  startCountDown() {
    this.interval = setInterval(() => {
      if (this.backgroundTime < this.getCountdown()) {
        this.setState(
          {
            countdown: this.getCountdown() - this.backgroundTime - 1,
          },
          () => {
            this.backgroundTime = 0;
            if (this.getCountdown() < 0) {
              this.interval && clearInterval(this.interval);
            }
            if (this.getCountdown() >= 0) {
              this.setButtonClickDisable(true);
            } else {
              this.setButtonClickDisable(false);
            }
          },
        );
      } else {
        // this.setCountdown(-1);
        this.setState({
          countdown: -1,
        });
        this.setButtonClickDisable(false);
        this.interval && clearInterval(this.interval);
      }
    }, 1000);
    this.setButtonClickDisable(true);
  }

  setButtonClickDisable(enable) {
    this.setState({
      disabled: enable,
    });
  }

  onPress = async () => {
    this.setCountdown(60);
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={this.state.disabled}
        onPress={this.onPress}
        style={[styles.vcode]}>
        {this.state.countdown >= 0 ? (
          <Text style={styles.vcodeText}>{`${this.state.countdown}`}S</Text>
        ) : (
          <Text
            style={[
              styles.vcodeText,
              this.state.disabled ? styles.vcodeDisabled : '',
            ]}>
            {/* {I18n.t("login.Get")} */}
            {I18n.t('login.acquireCode')}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  vcode: {
    height: 33,
    position: 'absolute',
    right: 16,
    bottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vcodeDisabled: {
    color: '#ccc',
  },
  vcodeText: {
    color: '#00AEEF',
    fontSize: 12,
    fontWeight: '500',
  },
});
