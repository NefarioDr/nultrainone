import crypto from 'react-native-crypto';

const encrypt = (data, key) => {
  let cipher = crypto.createCipher('aes-128-ctr', key);
  let newPsd = '';
  newPsd += cipher.update(data, 'utf8', 'hex');
  newPsd += cipher.final('hex');
  return newPsd;
};

const decrypt = (data, key) => {
  let decipher = crypto.createDecipher('aes-128-ctr', key);
  let oldPsd = '';
  oldPsd += decipher.update(data, 'hex', 'utf8');
  oldPsd += decipher.final('utf8');
  return oldPsd;
};

export default {
  encrypt,
  decrypt,
};
