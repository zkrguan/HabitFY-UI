import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isRegistered: boolean | undefined;
  constructor() { }
  // retrieves current user's username
  async getCognitoUserId(): Promise<string> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log("Username:", user.username);
      return user.username;
    } catch (error) {
      throw new Error('Unable to get username.');
    }
  }

  async getCognitoUserEmail(): Promise<string> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const email = user.attributes.email;
      console.log("Email:", email);
      return email;
    } catch (error) {
      throw new Error('Unable to get user email.');
    }
  }
  

  // retrieves AWS's custom attributes value
  async getUserParametersFromCognito() {
    if (this.isRegistered === true) {
      return this.isRegistered;
    }
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userParameters = await Auth.userAttributes(user);
      const isFirstLogin = userParameters.find(user => user.Name === 'custom:firstLogin');
      console.log("Check if user logged in for the first time ", isFirstLogin);
      const returnValue = isFirstLogin ? isFirstLogin.Value === 'false' : false;
      console.log("Check user return value whether user already created profile: ", returnValue);
      this.isRegistered = returnValue;
      return returnValue;
    } catch (err) {
      console.error('Unable to retrieve current user parameters:', err);
      throw err;
    }
  }
}
