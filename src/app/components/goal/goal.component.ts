import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { AuthService } from 'src/app/services/auth.service';
import { GoalService } from 'src/app/services/goal.service';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
const notyf = new Notyf();
@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent {
  userId: string = '';
  minStartDate: string;
  minEndDate: string;
  goalIdFromHomePageCard: Number = -1;
  isActivated: boolean = false;
  // this value is coming from route
  // if user trying to update goal then its value is update
  // if user trying to create goal then its value is create
  mode: string = '';

  goalData: Goal = {
    description: null,
    startDate: null,
    endDate: null,
    isQuitting: false,
    goalValue: null,
    unit: null
  };

  goalDataToReset: Goal = {
    description: null,
    startDate: null,
    endDate: null,
    isQuitting: false,
    goalValue: null,
    unit: null
  };

  constructor(
    private authService: AuthService,
    private goalService: GoalService,
    private router: Router, private route: ActivatedRoute
  ) {
    const currentDate = new Date();
    // at first start date and end date is the current date
    this.minStartDate = this.minEndDate = this.splitToIncludeDateOnly(currentDate);

    this.route.data.subscribe(data => {
      this.mode = data['mode'];
    });

    // when user is trying to update goal from home page
    // id and isActivated is passed as params
    if (this.mode === 'update') {
      this.route.params.subscribe(params => {
        this.goalIdFromHomePageCard = params['id'];
        this.isActivated = params['isActivated'] === 'true'; // params are string so converting to boolean
      });
    }
  }

  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId();
    console.log("goal id at goal page: ", this.goalIdFromHomePageCard);
    console.log("goal page this.mode value: ", this.mode);
    console.log("goal page activation status: ", this.isActivated);
    // if it's about updating goal then, load goal into the form
    if (this.mode === 'update') {
      await this.loadUserGoal();
    }
  }

  // function to ensure end date is after the start date
  minEndDateBasedOnStartDate() {
    if (this.goalData.startDate) {
      const startDate = new Date(this.goalData.startDate);
      // above code gives yesterday date
      // making end date selection to be 1 day after the start date 
      this.minEndDate = this.splitToIncludeDateOnly(new Date(startDate.setDate(startDate.getDate() + 1)));
      // if user selects end date to be less than tomorrow's date then, resetting the end date value
      if (this.goalData.endDate && new Date(this.goalData.endDate) < new Date(this.minEndDate)) {
        this.goalData.endDate = '';
      }
    }
  }

  // function to clear start date if it is greater than end date
  // does not require it in current implementation
  // however, implemented it just to ensure double validation
  minStartDateBasedOnEndDate() {
    if (this.goalData.endDate) {
      if (this.goalData.startDate && new Date(this.goalData.startDate) > new Date(this.goalData.endDate)) {
        this.goalData.startDate = ''; // start date can not be after the end date so clearing it if user tries to do so
      }
    }
  }

  // as date string value includes time as well, so, only getting date value
  splitToIncludeDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // adds leading 0 to make date format in YYYY-MM-DD
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}`;
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
        Swal.fire({
          title: 'Success!',
          text: 'You successful created a new goal!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        goalForm.resetForm(this.goalDataToReset);
      } catch (err) {
        console.error('Error:', err);
        Swal.fire({
          title: 'Failed!',
          text: 'Unable to create a new goal!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }

  // loading user goal by id
  async loadUserGoal() {
    try {
      const userGoal = await this.goalService.getUserGoalById(
        this.goalIdFromHomePageCard
      );
      console.log('User goalByGoalId in goal page:', userGoal);
      if (!userGoal) {
        console.log('No goal found');
      } else {
        console.log('User goalByGoalId in goal page:', userGoal);
        this.goalData = userGoal;
        // splitting date and time, and only retrieving date
        if (this.goalData.startDate) {
          const startDate = new Date(this.goalData.startDate);
          this.goalData.startDate = this.splitToIncludeDateOnly(startDate);
        }
        if (this.goalData.endDate) {
          const endDate = new Date(this.goalData.endDate);
          this.goalData.endDate = this.splitToIncludeDateOnly(endDate);
        }
        console.log(
          'User goal after getting from getById route at goal page:',
          this.goalData
        );
      }
    } catch (error) {
      console.error('Error loading user goalByGoalId in goal page:', error);
      notyf.error('Failed to load your selected goal!');
    }
  }

  // invokes put route by calling method in goal service
  async onGoalUpdate(goalForm: NgForm) {
    if (goalForm.valid) {
      try {
        const reqUpdateGoalData = {
          ...goalForm.value,
          profileId: this.userId,
          isActivated: this.isActivated
        };
        console.log('Update goal at goal page:', reqUpdateGoalData);
        const res = await this.goalService.updateGoalData(
          reqUpdateGoalData, this.goalIdFromHomePageCard
        );
        console.log('Server response on update route at goal page:', res);
        this.router.navigate(['/home']);
        notyf.success('Successfully updated your goal!');
      } catch (err) {
        console.error('Error:', err);
        notyf.error('Failed to update your goal!');
      }
    }
  }
}
