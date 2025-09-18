import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {

  private _secret = 'KMGTripleDES';

  constructor() {
    
   }

  Encrypt(text: string) {
 
    let key = CryptoJS.enc.Utf16LE.parse(this._secret);
    key = CryptoJS.MD5(key)
    key.words.push(key.words[0], key.words[1]);
    var options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
    var textWordArray = CryptoJS.enc.Utf16LE.parse(text);
    var encrypted = CryptoJS.TripleDES.encrypt(textWordArray, key, options);
    var base64String = encrypted.toString()    

    return base64String;
   
  }

  Decrypt(encryptedText: string) {   

    let key = CryptoJS.enc.Utf16LE.parse(this._secret);
    key = CryptoJS.MD5(key)
    key['words'].push(key['words'][0], key['words'][1]);

    var options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
    var decrypted = CryptoJS.TripleDES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
    }, key, options);
    
    return decrypted.toString(CryptoJS.enc.Utf16LE);
  }

}
