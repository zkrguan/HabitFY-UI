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
  constructor(private http: HttpClient) { }

  // included access token in the headers
  // may not require based on implementation of these routes in backend

  // post request for registering profile
  async postRegisterData(registerData: any) {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      // setting up headers to invoke POST route to register user profile data
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/UserProfile`; // setting up URL
      console.log(url + ' | ' + registerData + ' | ' + headers);
      // requesting POST request based on the built URL, registration data, and headers
      // also, stating that the response data from this route will be in text/plain format
      const res = this.http
        .post(url, registerData, { headers, responseType: 'text' })
        .toPromise();
      return res; // returning the responded data
    } catch (err) { // catches error while performing POST request in this function
      console.error(
        'Unable to register user profile for analytical report',
        err
      );
      // throwing error if code goes to this catch block
      throw new Error('Unable to register user!');
    }
  }

  // put request for updating profile
  // logic is similar to the registering user profile
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
      // mapping with <Register> interface, and using built headers to invoke get request
      // Register interface contains JSON object similar to get route's response data
      // this means we are expecting data similar to the Register interface's data structure
      return await this.http.get<Register>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        // 404 status code tells us that data was not found
        // return null if no data is found from the GET route
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
