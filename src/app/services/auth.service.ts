import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  async getCognitoUserId(): Promise<string> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log("Username:", user.username);
      return user.username;
    } catch (error) {
      throw new Error('Failed to retrieve user ID.');
    }
  }
}
