import { toCamelCase } from '../utils/transformCase.js';

import camelCase from 'lodash/camelCase.js';

const first = camelCase('tmp_REGISTER_REQUEST');
console.log(first);
console.log('C2S' + first.slice(3));
console.log(camelCase('CREATE_ROOM_RESPONSE'));
