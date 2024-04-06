import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { UserDailyStat } from '../interfaces/user-daily-stat';

@Injectable({
  providedIn: 'root'
})
export class UserDailyStatService {
  progress = [
    { name: 'Goals Completed', color: '#035710', load: false, percentage: 0 },
    { name: 'Goals Remaining', color: '#070357', load: false, percentage: 0 }
  ];

  ranks = [
    { name: 'Dreamer' },
    { name: 'King\'s Guard' },
    { name: 'Gladiator' },
    { name: 'Terminator' }
  ];

  progress_2 = [
    {
      name: 'Competitive Edge',
      color: '#570303',
      load: false, percentage: 0, info: 'This percentage shows the percentage of users you bested in your area.'
    },
    { name: 'Same Level Users', color: '#035710', load: false, percentage: 0, info: 'This percentage shows the total number of users with same level of performance in your area.' },
    { name: 'Ranking Score', color: '#070357', load: false, percentage: 0, info: 'Your ranking against every users in your area. Higher percentage means your achievements are unique.' }
  ];

  constructor(private http: HttpClient) { }

  // to get user daily statistics from the database
  async getUserDailyStat(id: string | null, postalCode: string | null): Promise<UserDailyStat | null | undefined> {
    try {
      const session = await Auth.currentSession(); // get current authenticated session from AWS Cognito
      const accessToken = session.getAccessToken().getJwtToken(); // get JWT access token based on the retrieved session
      // setting up headers with access token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      // also, setting up the url by adding username and postal code as the params
      const url = `${environment.url}/api/v1/UserDailyStat/byUserId/${id}/${postalCode}`;
      // mapping with <UserDailyStat> interface, and using set headers to invoke GET request
      // UserDailyStat interface contains JSON object similar to GET route's response data
      return await this.http.get<UserDailyStat>(url, { headers }).toPromise();
    } catch (err) {
      // catch block to catch any errors while invoking GET route
      if (err instanceof HttpErrorResponse) {
        // 404 status code signifies the data not being found
        if (err.status === 404) {
          return null; // return null if response has error status of 404
        }
        console.error('Error fetching user daily stat:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      // throwing error if code goes to the catch block
      throw new Error('Failed to fetch user daily stat');
    }
  }

  // returning data to set up first two progress bars
  getProgress() {
    return this.progress;
  }

  // returning data to set up last three progress bars
  getProgress_2() {
    return this.progress_2;
  }

  // returning different ranks name information
  getRanks() {
    return this.ranks;
  }
}
