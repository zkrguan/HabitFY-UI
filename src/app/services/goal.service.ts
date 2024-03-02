import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Goal } from '../interfaces/goal';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // post request for registering profile
  async postGoalData(goalData: any) {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/Goal`;
      console.log(url + ' | ' + goalData + ' | ' + headers);
      const res = this.http
        .post(url, goalData, { headers, responseType: 'text' })
        .toPromise();
      return res;
    } catch (err) {
      console.error('Unable to set up user goal', err);
      throw new Error('Unable to set up user goal!');
    }
  }

  // get request to get user goal
  async getUserGoals(id: string): Promise<Goal[] | null | undefined> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/Goal/byUserId/${id}`;
      // mapping with <Goal> interface to invoking get request
      return await this.http.get<Goal[]>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null;
        }
        console.error('Error fetching user goals:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch user goals');
    }
  }

  async getUserGoalById(id: Number): Promise<Goal | null | undefined> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/Goal/${id}`;
      // mapping with <Goal> interface to invoking get request
      return await this.http.get<Goal>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null;
        }
        console.error('Error fetching user goal:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch user goal');
    }
  }

  async activateOrDeactivateGoal(isActivationTrue: boolean, id:number){
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/Goal/${id}/${isActivationTrue}`;
      const res = this.http
        .patch(url, {} ,{ headers, responseType: 'text' })
        .toPromise();
      return res;
    } catch (err) {
      console.error('Unable to change the activation state of a goal', err);
      throw new Error('Unable to change the activation state of a goal!');
    }
  }

    // put request for updating goal
    async updateGoalData(updateData: any, id:Number) {
      try {
        const session = await Auth.currentSession();
        const accessToken = session.getAccessToken().getJwtToken();
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        });
        const url = `${environment.url}/api/v1/Goal/${id}`;
        console.log('Update URL:', url, '| Goal Data:', updateData);
        const res = await this.http
          .put(url, updateData, { headers, responseType: 'text' })
          .toPromise();
        return res;
      } catch (err) {
        console.error('Unable to update user goal:', err);
        throw new Error('Unable to update user goal!');
      }
    }
}
