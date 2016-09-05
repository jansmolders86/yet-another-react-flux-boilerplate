import alt from '../core/alt';
import generateWithAsyncActions from '../utils/GenerateWithAsyncActions';

export default generateWithAsyncActions(alt, [
  'fetchMessages',
  'fetchLocales'
]);
