import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { AuthService } from 'src/app/services/auth.service';
import { GoalService } from 'src/app/services/goal.service';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent {
  errMsg: string = '';
  userId: string = '';
  minStartDate: string;
  minEndDate: string;

  // initializing it to true and changing it based on GET request response
  isFirstTimeRegistering: boolean = true;

  goalData: Goal = {
    description: null,
    startDate:null,
    endDate:null,
    isQuitting: false,
    goalValue: null,
  };

  constructor(
    private authService: AuthService,
    private goalService: GoalService,
    private router: Router
  ) {
    const currentDate = new Date();
    this.minStartDate = this.minEndDate = this.splitToIncludeDateOnly(currentDate);
  }

  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId();
    // await this.loadUserData();
  }

  minEndDateBasedOnStartDate() {
    if (this.goalData.startDate) {
      const startDate = new Date(this.goalData.startDate);
      this.minEndDate = this.splitToIncludeDateOnly(new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  }

  splitToIncludeDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // invokes post route by calling method in goal service
  async onGoalRegister(goalForm: NgForm) {
    console.log(this.goalData);
    if (goalForm.valid) {
      try {
        const reqGoalData = {
          ...goalForm.value,
          profileId: this.userId,
        };
        console.log('Goal Register Form:', reqGoalData);
        const res = await this.goalService.postGoalData(
          reqGoalData
        );
        console.log('Server response:', res);
        goalForm.resetForm();
      } catch (err) {
        console.error('Error:', err);
        this.errMsg = 'Unable to register your goal!';
      }
    }
  }

  // // invokes get route by calling method in register-profile service
  // async loadUserData() {
  //   try {
  //     const userData = await this.registerProfileService.getUserData(
  //       this.userId
  //     );
  //     this.isFirstTimeRegistering = userData === null;
  //     console.log('User data:', userData);
  //     console.log('Is first time registering:', this.isFirstTimeRegistering);
  //     if (this.isFirstTimeRegistering) {
  //       console.log('No user data found');
  //     } else {
  //       console.log('User data:', userData);
  //       this.registerData = { ...userData };
  //       console.log(
  //         'Register data after getting data from get route:',
  //         this.registerData
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error loading user data:', error);
  //     this.errMsg = 'Error! Unable to fetch user data!';
  //   }
  // }



  // // invokes put route by calling method in register-profile service
  // async onUpdate(registerForm: NgForm) {
  //   console.log(registerForm);
  //   if (registerForm.valid) {
  //     try {
  //       const reqUpdateData = {
  //         ...registerForm.value,
  //         id: this.userId,
  //         needReport: this.registerData.needReport,
  //       };
  //       console.log('Update Form:', reqUpdateData);
  //       const res = await this.registerProfileService.updateRegisterData(
  //         reqUpdateData
  //       );
  //       console.log('Server response on update route:', res);
  //       this.router.navigate(['/home']);
  //     } catch (err) {
  //       console.error('Error:', err);
  //       this.errMsg = 'Unable to update your profile!';
  //     }
  //   }
  // }

  emptyErrMsg() {
    this.errMsg = '';
  }
}
