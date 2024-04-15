import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserDailyStatService } from 'src/app/services/user-daily-stat.service';
import { RegisterProfileService } from 'src/app/services/register-profile.service';
import { Register } from 'src/app/interfaces/register';
import { Notyf } from 'notyf';
import { UserDailyStat } from 'src/app/interfaces/user-daily-stat';

const notyf = new Notyf();
@Component({
  selector: 'app-home-user-profile',
  templateUrl: './home-user-profile.component.html',
  styleUrls: ['./home-user-profile.component.css']
})
export class HomeUserProfileComponent {
  userId: string = '';
  registerData: Register = {};
  userDailyStatistics: UserDailyStat = {
    userId: null,
    data: {
      planedToFinishGoalCount: null,
      actualFinishedGoalCount: null,
      reachedGoalStreak: 0,
      beatingCompetitorPercentage: null,
      totalUserCountInPostalCode: null,
      samePerformanceUsersCount: null,
    },
    postalCode: null,
  };
  quotes: any[] = [];

  currentQuote: any = {};

  progress: any[] = [];

  progress_2: any[] = [];

  ranks: any[] = [];

  // constructor
  constructor(private authService: AuthService, private userDailyStat: UserDailyStatService, private registerProfileService: RegisterProfileService, private dataService: DataService) {
    this.quotes = this.dataService.getQuotes(); // fetching motivational quotes
    this.progress = this.userDailyStat.getProgress(); // fetching data for progress bar
    this.progress_2 = this.userDailyStat.getProgress_2();
    this.ranks = this.userDailyStat.getRanks(); // fetching different level of ranks
    this.toChangeMotivation(); // helps to change motivation on click
  }

  async ngOnInit() {
    // to load information on progress bar after certain time
    setTimeout(() => {
      this.progress.forEach(progress => progress.load = true);
    }, 500);
    setTimeout(() => {
      this.progress_2.forEach(progress => progress.load = true);
    }, 500);
    await this.loadUserData();
    await this.loadUserDailyStatistics();
    this.updateProgressPercentages();
  }

  // fetching user profile information
  async loadUserData() {
    try {
      // get user name from AWS cognito
      this.userId = await this.authService.getCognitoUserId();
      // calling method on register-profile service to retrieve user's registration information
      const userData = await this.registerProfileService.getUserData(
        this.userId
      );
      console.log('User data:', userData);
      if (!userData) {
        console.log('No user data found for analytic report.');
      } else {
        console.log('User data:', userData);
        // using spread operator to perform shallow copy of retrieved user registration information
        this.registerData = { ...userData };
        console.log(
          'Register data after getting data from get route for analytic report:',
          this.registerData
        );
      }
    } catch (error) { // handles thrown error while fetching user registration information
      console.error('Error loading user data for analytic report:', error);
    }
  }

  // to get user's performance statistic report from the database
  async loadUserDailyStatistics() {
    // assign null if postal code is not available
    let postalCode = this.registerData.postalCode ? this.registerData.postalCode : null;
    try {
      if (postalCode) {
        // to remove whitespace
        postalCode = postalCode.replace(/\s+/g, '');
      }
      // invoking method in user daily stat service to retrieve user performance report
      const dailyStat = await this.userDailyStat.getUserDailyStat(this.userId, postalCode);
      if (dailyStat) {
        this.userDailyStatistics = dailyStat;
        console.log("User daily stat response from the server: ", this.userDailyStatistics);
      } else {
        // resetting user daily stat report if it is not found in the database
        this.userDailyStatistics = {
          userId: null,
          data: {
            planedToFinishGoalCount: null,
            actualFinishedGoalCount: null,
            reachedGoalStreak: null,
            beatingCompetitorPercentage: null,
            totalUserCountInPostalCode: null,
            samePerformanceUsersCount: null,
          },
          postalCode: null,
        };
      }
    } catch (error) {
      console.error("Failed to load user daily stats:", error);
    }
  }

  // to get random motivation quote
  toChangeMotivation() {
    // generates random number
    const index = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[index];
  }

  // to calculate the goals completion rate by the user in percentage
  getGoalCompletedPercentage(): number {
    // returns right hand operand if left hand operand is null or undefined because of ??
    const plannedGoal = this.userDailyStatistics.data.planedToFinishGoalCount ?? 0;
    const actualFinishedGoal = this.userDailyStatistics.data.actualFinishedGoalCount ?? 0;
    if (plannedGoal > 0 && plannedGoal > actualFinishedGoal) {
      // calculating goal completion in percentage and in whole number
      return Math.round((actualFinishedGoal / plannedGoal) * 100);
    }
    else if (actualFinishedGoal > plannedGoal) {
      return 100;
    } else {
      return 0; // no need to calculate if planned goal is 0
    }
  }

  // to calculate the percentage of users bested by the current user in the same area
  getBeatingCompetitorPercentage(): number {
    const beating = this.userDailyStatistics.data.beatingCompetitorPercentage ?? 0;
    const totalUser = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 0;
    if (beating > 0 && totalUser > 0) {
      return Math.round((beating / totalUser) * 100);
    } else {
      return 0;
    }
  }

  // to calculate the percentage of users who are in the same level of performance as the current user in the same area
  getUsersAtSameLevel(): number {
    const sameLevelUsers = this.userDailyStatistics.data.samePerformanceUsersCount ?? 0;
    const totalUser = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 0;
    if (sameLevelUsers > 0 && totalUser > 0) {
      return Math.round((sameLevelUsers / totalUser) * 100);
    } else {
      return 0;
    }
  }

  // to calculate the uniqueness of users achievements
  // higher the percentage means user achievement is unique
  // may not show data as expected during the early launch of the application 
  getUserRankScore(): number {
    const sameCount = this.userDailyStatistics.data.samePerformanceUsersCount ?? 0;
    const totalCount = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 1;
    if (sameCount === 0 && totalCount === 1) {
      return 0;
    }
    return Math.round((1 - (sameCount / totalCount)) * 100);
  }

  // updates the progress bars by calling the methods
  updateProgressPercentages(): void {
    this.progress[0].percentage = this.getGoalCompletedPercentage();
    // if no goals were planned then, no need to calculate for completed goal percentage
    if ((this.userDailyStatistics?.data?.planedToFinishGoalCount ?? 0) > 0)
      this.progress[1].percentage = 100 - this.getGoalCompletedPercentage();
    else
      this.progress[1].percentage = 0;
    this.progress_2[0].percentage = this.getBeatingCompetitorPercentage();
    this.progress_2[1].percentage = this.getUsersAtSameLevel();
    this.progress_2[2].percentage = this.getUserRankScore();
    console.log("Checking percentage of calculation (goal completed): ", this.getGoalCompletedPercentage());
    console.log("Checking percentage of calculation (goal remaining): ", 100 - this.getGoalCompletedPercentage());
    console.log("Checking percentage of calculation (beating competitor percentage): ", this.getBeatingCompetitorPercentage());
    console.log("Checking percentage of calculation (users at same level): ", this.getUsersAtSameLevel());
    console.log("Checking percentage of calculation (user rank percentile): ", this.getUserRankScore());
    // changing the flag to true to load the progress bar with the calculated data
    this.progress.forEach(p => p.load = true);
  }
}
