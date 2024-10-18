/* eslint-disable import/no-extraneous-dependencies */
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { startNetworkLogging } from 'react-native-network-logger';
import App from './src/App';
import { name as appName } from './app.json';

if (__DEV__) {
	import('@/reactotron.config');
}

startNetworkLogging();
AppRegistry.registerComponent(appName, () => App);
