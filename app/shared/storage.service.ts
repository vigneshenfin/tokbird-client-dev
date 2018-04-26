import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReplaySubject } from "rxjs/ReplaySubject";
export class StorageService {
    public static scope;
    public static getScope():any {
        return StorageService.scope;
    }
 
    public static setScope(scope): void {
        StorageService.scope = scope;
    }
    public static setRememberMe(userName,password){
           let rememberData:any = {};
           rememberData.userName = userName;
           rememberData.password = password;
           localStorage.setItem('rememberData', JSON.stringify(rememberData));
    }
    public static getRememberMe(){
        if (localStorage.getItem('rememberData')) {
            return JSON.parse(localStorage.getItem('rememberData'));
        }else{
           return false;
        }
    }
}