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
    { name: 'Goals Remaining', color: '#070357', load: false, percentage: 0}
  ];

  ranks = [
    {name:'Dreamer'},
    {name:'King\'s Guard'},
    {name:'Gladiator'},
    {name:'Terminator'}
  ];

  progress_2 = [
    {
      name: 'Competitive Edge',
      color: '#570303',
      load: false, percentage: 0, info: 'This percentage shows your performance as compared to other users from your area.'
    },
    { name: 'Same Level Users', color: '#035710', load: false, percentage: 0, info: 'This percentage shows the total number of users with same level of performance in your area.'},
    { name: 'Ranking Score', color: '#070357', load: false, percentage: 0, info: 'Your ranking against every users in your area. Higher percentage means you are unique in your achievements.'}
  ];

  constructor(private http: HttpClient) { }

  async getUserDailyStat(id: string|null, postalCode: string|null): Promise<UserDailyStat | null | undefined> {
    try {
      const session = await Auth.currentSession();
      const accessToken = session.getAccessToken().getJwtToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const url = `${environment.url}/api/v1/UserDailyStat/byUserId/${id}/${postalCode}`;
      // mapping with <UserDailyStat> interface to invoking get request
      // UserDailyStat interface contains JSON object similar to get route's response data
      return await this.http.get<UserDailyStat>(url, { headers }).toPromise();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          return null;
        }
        console.error('Error fetching user daily stat:', err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
      throw new Error('Failed to fetch user daily stat');
    }
  }

  getProgress() {
    return this.progress;
  }

  getProgress_2() {
    return this.progress_2;
  }

  getRanks() {
    return this.ranks;
  }
}
