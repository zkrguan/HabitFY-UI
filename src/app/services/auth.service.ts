import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isRegistered: boolean | undefined;
  constructor() { }
  // retrieves authenticated current user's username
  async getCognitoUserId(): Promise<string> {
    try {
      // gets authenticated current user's data from AWS Cognito
      const user = await Auth.currentAuthenticatedUser();
      console.log("Username:", user.username);
      return user.username; // returning current user's username
    } catch (error) { // catches error while performing this function operation
      throw new Error('Unable to get username.'); // throwing error if code goes to this catch block
    }
  }

  // retrieve authenticated current user's email
  async getCognitoUserEmail(): Promise<string> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const email = user.attributes.email; // obtaining authenticated current user's email
      console.log("Email:", email);
      return email; // returning obtained email
    } catch (error) {
      throw new Error('Unable to get user email.');
    }
  }

  // helps to know if user is authenticated or not at Amazon service
  async userAuthenticationVerification(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true; // returns true if user is authenticated
    } catch (error) {
      return false; // returns false if user is not authenticated
    }
  }

  // retrieves AWS's custom attributes value
  // this function is being used to check if logged in user has registered their profile or not
  async getUserParametersFromCognito() {
    if (this.isRegistered === true) {
      return this.isRegistered;
    }
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userParameters = await Auth.userAttributes(user); // getting current user's attributes
      // look for custom attribute named firstLogin and retrieve it's value
      const isFirstLogin = userParameters.find(user => user.Name === 'custom:firstLogin');
      console.log("Check if user logged in for the first time ", isFirstLogin);
      // assigns true if user has already set up their profile, if not then false
      // value of this custom attribute is being changed when user register for their profile
      const returnValue = isFirstLogin ? isFirstLogin.Value === 'false' : false;
      console.log("Check user return value whether user already created profile: ", returnValue);
      // update the flag value so that we do not need to perform this logic if user is already logged in
      this.isRegistered = returnValue;
      return returnValue; // returned boolean value based custom attribute
    } catch (err) {
      console.error('Unable to retrieve current user parameters:', err);
      throw err;
    }
  }
}
