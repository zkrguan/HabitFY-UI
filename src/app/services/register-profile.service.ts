import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { Register } from '../interfaces/register';

@Injectable({
  providedIn: 'root',
})
export class RegisterProfileService {
  // private isRegistered: boolean | undefined;
  constructor(private http: HttpClient) {}

  // included access token in the headers
  // may not require based on implementation of these routes in backend

  // post request for registering profile
  async postRegisterData(registerData: any) {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/UserProfile`;
      console.log(url + ' | ' + registerData + ' | ' + headers);
      const res = this.http
        .post(url, registerData, { headers, responseType: 'text' })
        .toPromise();
      return res;
    } catch (err) {
      console.error(
        'Unable to register user profile for analytical report',
        err
      );
      throw new Error('Unable to register user!');
    }
  }

  // put request for updating profile
  async updateRegisterData(updateData: any) {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/UserProfile/${updateData.id}`;
      console.log('Update URL:', url, '| Data:', updateData);
      const res = await this.http
        .put(url, updateData, { headers, responseType: 'text' })
        .toPromise();
      return res;
    } catch (err) {
      console.error('Unable to update user profile:', err);
      throw new Error('Unable to update profile!');
    }
  }

  // get request to get user data
  async getUserData(id: string): Promise<Register | null | undefined> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/UserProfile/${id}`;
      // mapping with <Register> interface to invoking get request
      // Register interface contains JSON object similar to get route's response data
      return await this.http.get<Register>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null;
        }
        console.error('Error fetching user data:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch user data');
    }
  }
}
