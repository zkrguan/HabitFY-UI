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
      reachedGoalStreak: null,
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

  constructor(private authService: AuthService, private userDailyStat: UserDailyStatService, private registerProfileService: RegisterProfileService, private dataService: DataService) {
    this.quotes = this.dataService.getQuotes();
    this.progress = this.userDailyStat.getProgress();
    this.progress_2 = this.userDailyStat.getProgress_2();
    this.ranks = this.userDailyStat.getRanks();
    this.toChangeMotivation();
  }

  async ngOnInit() {
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

  // invokes get route by calling method in register-profile service for analytic report
  async loadUserData() {
    try {
      this.userId = await this.authService.getCognitoUserId();
      const userData = await this.registerProfileService.getUserData(
        this.userId
      );
      console.log('User data:', userData);
      if (!userData) {
        console.log('No user data found for analytic report.');
      } else {
        console.log('User data:', userData);
        this.registerData = { ...userData };
        console.log(
          'Register data after getting data from get route for analytic report:',
          this.registerData
        );
      }
    } catch (error) {
      console.error('Error loading user data for analytic report:', error);
      notyf.error('Failed to load your profile information for analytic report!');
    }
  }

  async loadUserDailyStatistics() {
    let postalCode = this.registerData.postalCode ? this.registerData.postalCode : null;
    try {
      if (postalCode) {
        postalCode = postalCode.replace(/\s+/g, '');
      }
      const dailyStat = await this.userDailyStat.getUserDailyStat(this.userId, postalCode);
      if (dailyStat) {
        this.userDailyStatistics = dailyStat;
        console.log("User daily stat response from the server: ", this.userDailyStatistics);
      } else {
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
        notyf.error('Failed to load your analytic report!');
      }
    } catch (error) {
      console.error("Failed to load user daily stats:", error);
      notyf.error('Failed to load your analytic report!');
    }
  }

  toChangeMotivation() {
    const index = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[index];
  }

  getGoalCompletedPercentage(): number {
    // returns right hand operand if left hand operand is null or undefined because of ??
    const plannedGoal = this.userDailyStatistics.data.planedToFinishGoalCount ?? 0;
    const actualFinishedGoal = this.userDailyStatistics.data.actualFinishedGoalCount ?? 0;
    console.log("planned goal: ", this.userDailyStatistics.data.planedToFinishGoalCount);
    if (plannedGoal > 0) {
      return Math.round((actualFinishedGoal / plannedGoal) * 100);
    } else {
      return 0;
    }
  }

  getBeatingCompetitorPercentage(): number {
    const beating = this.userDailyStatistics.data.beatingCompetitorPercentage ?? 0;
    const totalUser = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 0;
    if (beating > 0) {
      return Math.round((beating / totalUser) * 100);
    } else {
      return 0;
    }
  }

  getUsersAtSameLevel(): number {
    const sameLevelUsers = this.userDailyStatistics.data.samePerformanceUsersCount ?? 0;
    const totalUser = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 0;
    if (sameLevelUsers > 0) {
      return Math.round((sameLevelUsers / totalUser) * 100);
    } else {
      return 0;
    }
  }

  getUserRankPercentile(): number {
    const sameCount = this.userDailyStatistics.data.samePerformanceUsersCount ?? 0;
    const totalCount = this.userDailyStatistics.data.totalUserCountInPostalCode ?? 1;
    return Math.round((1 - (sameCount / totalCount)) * 100);
  }

  updateProgressPercentages(): void {
    this.progress[0].percentage = this.getGoalCompletedPercentage();
    this.progress[1].percentage = 100 - this.getGoalCompletedPercentage();
    this.progress_2[0].percentage = this.getBeatingCompetitorPercentage();
    this.progress_2[1].percentage = this.getUsersAtSameLevel();
    this.progress_2[2].percentage = this.getUserRankPercentile();
    console.log("Checking percentage of calculation (goal completed): ", this.getGoalCompletedPercentage());
    console.log("Checking percentage of calculation (goal remaining): ", 100 - this.getGoalCompletedPercentage());
    console.log("Checking percentage of calculation (beating competitor percentage): ", this.getBeatingCompetitorPercentage());
    console.log("Checking percentage of calculation (users at same level): ", this.getUsersAtSameLevel());
    console.log("Checking percentage of calculation (user rank percentile): ", this.getUserRankPercentile());
    this.progress.forEach(p => p.load = true);
  }
}
