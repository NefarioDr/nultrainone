/**
 * @format
 */
/* 1START 添加下面两行解决　Cannot find reference: Buffer 以及 can not support this browser. */
import './shim';
import 'react-native-get-random-values';
/* 1END */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
