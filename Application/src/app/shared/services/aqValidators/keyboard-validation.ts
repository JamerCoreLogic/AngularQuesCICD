import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class KeyboardValidation {

    constructor() { }

    NaturalNumbers(event, length) {
        if ((event.target.value.length < length) || (event.target.selectionStart != event.target.selectionEnd)) {
            var unicode = event.charCode ? event.charCode : event.keyCode;
            if ((event.target.selectionStart == 0) && (unicode == 48)) {
                return false;
            }
            if (unicode != 8) {
                if (unicode < 48 || unicode > 57) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }


    WholeNumbers(event, length) {
        if ((event.target.value.length < length) || (event.target.selectionStart != event.target.selectionEnd)) {
            var unicode = event.charCode ? event.charCode : event.keyCode;

            if (unicode != 8) {
                if (unicode < 48 || unicode > 57) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    Integers(event, length) {

        var unicode = event.charCode ? event.charCode : event.keyCode;

        if (event.target.value.indexOf('-') != -1) {
            length = length + 1;
        } else if ((unicode == 45) && (event.target.selectionStart == 0) && (event.target.value.length == length)) {
            length = length + 1;
        }
        if ((event.target.value.length < length) || (event.target.selectionStart != event.target.selectionEnd)) {

            /*  if ((event.target.selectionStart == 0) && (unicode == 48)) {
                 return false;
             } */
            if (unicode != 8) {
                if (unicode < 48 || unicode > 57) {
                    if ((unicode == 45) && (event.target.selectionStart == 0)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }

    }

    key(evt) {
        var keyCode = (evt.which) ? evt.which : evt.keyCode;
        if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32 && keyCode != 39) {
            if(keyCode == 13){
                return true;
            } else {
                return false;
            }            
        } else {
            return true;
        }
    }



}

