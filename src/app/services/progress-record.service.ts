import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { ProgressRecord } from '../interfaces/progress-record';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressRecordService {

  constructor(private http: HttpClient) { }

   // get progress record by goal id
   async getProgressRecordByGoalId(id: Number): Promise<ProgressRecord[] | null | undefined> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/ProgressRecord/byGoalId/${id}`;
      // mapping with <progress-record> interface for invoking get request
      return await this.http.get<ProgressRecord[]>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null;
        }
        console.error('Error fetching progress record by goal id:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch progress record by goal id');
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
