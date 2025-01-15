import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('CoachTyron', () => App);

// Load the app on web platform
if (window !== undefined) {
  AppRegistry.runApplication('CoachTyron', {
    initialProps: {},
    rootTag: document.getElementById('root')
  });
}