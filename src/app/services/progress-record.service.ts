import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { ProgressRecord } from '../interfaces/progress-record';

@Injectable({
  providedIn: 'root'
})
export class ProgressRecordService {

  constructor(private http: HttpClient) { }

  // get progress record by goal id
  async getProgressRecordByGoalId(id: string | null, selectedDate: string): Promise<ProgressRecord[] | null | undefined> {
    try {
      const session = await Auth.currentSession(); // get current authenticated session from AWS Cognito
      const accessToken = session.getAccessToken().getJwtToken(); // get JWT access token based on the retrieved session
      // building headers with authorized access token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      // setting up URL with user name and selected date as params
      const url = `${environment.url}/api/v1/ProgressRecord/byGoalId/${id}/${selectedDate}`;
      // mapping with <progress-record> interface, using built headers for invoking get request
      // we expect similar response as the data structure in progress-record interface
      return await this.http.get<ProgressRecord[]>(url, { headers }).toPromise();
    } catch (err) { // catches thrown error while performing this GET request 
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null; // return null if no data is found
        }
        console.error('Error fetching progress record by goal id:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch progress record by goal id'); // throw error if code goes to this catch block
    }
  }

  // post request for registering profile
  async postProgressRecordData(progressRecordData: any) {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/ProgressRecord`;
      console.log(url + ' | ' + progressRecordData + ' | ' + headers);
      // response type indicates that the expected response data will be in text/plain 
      const res = this.http
        .post(url, progressRecordData, { headers, responseType: 'text' })
        .toPromise();
      return res;
    } catch (err) {
      console.error('Unable to log progress record', err);
      throw new Error('Unable to log progress record!');
    }
  }
}
