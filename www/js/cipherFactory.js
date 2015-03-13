/**
 * Created by ashishpandey on 11/03/15.
 */
'use strict'

angular.module('passwordApp').factory('cipherFactory', function () {

  return {
    /*
     * Encrypt a message with a passphrase or password
     *
     * @param    string message
     * @param    string password
     * @return   object
     */
    encrypt: function (message, password) {
      var salt = forge.random.getBytesSync(128);
      var key = forge.pkcs5.pbkdf2(password, salt, 4, 16);
      var iv = forge.random.getBytesSync(16);
      var cipher = forge.cipher.createCipher('AES-CBC', key);

      cipher.start({iv: iv});
      cipher.update(forge.util.createBuffer(message));
      cipher.finish();

      var cipherText = forge.util.encode64(cipher.output.getBytes());

      return {
        cipher_text: cipherText,
        salt: forge.util.encode64(salt),
        iv: forge.util.encode64(iv)
      };
    },
    /*
     * Decrypt cipher text using a password or passphrase and a corresponding salt and iv
     *
     * @param    string (Base64) cipherText
     * @param    string password
     * @param    string (Base64) salt
     * @param    string (Base64) iv
     * @return   string
     */
    decrypt: function (cipherText, password, salt, iv, options) {
      var key = forge.pkcs5.pbkdf2(password, forge.util.decode64(salt), 4, 16);
      var decipher = forge.cipher.createDecipher('AES-CBC', key);

      decipher.start({iv: forge.util.decode64(iv)});
      decipher.update(forge.util.createBuffer(forge.util.decode64(cipherText)));
      decipher.finish();

      if(options !== undefined && options.hasOwnProperty('output') && options.output === 'hex') {
        return decipher.output.toHex();
      }else {
        return decipher.output.toString();
      }
    }
  }
});