import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { ProgressRecord } from 'src/app/interfaces/progress-record';
import { AuthService } from 'src/app/services/auth.service';
import { GoalService } from 'src/app/services/goal.service';
import { ProgressRecordService } from 'src/app/services/progress-record.service';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
const notyf = new Notyf();
@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrls: ['./home-page-card.component.css'],
})

export class HomePageCardComponent {
  userId: string = '';


  goalData: Goal[] = [];

  goalDataById: Goal = {};

  goalSelected: string | null = null;

  isGoalFound: boolean = false;

  progressRecordByGoalId: ProgressRecord = {
    notes: null,
    completedValue: null
  };

  receivedProgressRecord: ProgressRecord[] = [];

  constructor(private authService: AuthService,
    private goalService: GoalService,
    private router: Router, private progressRecordService: ProgressRecordService) { }

  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId();
    await this.loadUserGoals();
  }

  // to load all user goals
  async loadUserGoals() {
    try {
      const userGoals = await this.goalService.getUserGoals(
        this.userId
      );
      console.log('User goals:', userGoals);
      if (!userGoals || userGoals.length === 0) {
        console.log('No goals found');
      } else {
        console.log('User goals:', userGoals);
        this.goalData = userGoals;
        console.log(
          'User goals after getting from get route:',
          this.goalData
        );
        this.isGoalFound = true;
      }
    } catch (error) {
      console.error('Error loading user goal:', error);
    }
  }

  // logic to get goal information by id based on selection
  // invokes method at the goal service for this 
  async onGoalSelection(goalSelected: any) {
    // logic for clicking user specific goal
    // if same goal is clicked twice then this.goalSelected becomes null, if not then, assigning selected goal id to it
    this.goalSelected = this.goalSelected === goalSelected.id ? null : goalSelected.id;
    try {
      const userGoal = await this.goalService.getUserGoalById(
        goalSelected.id
      );
      console.log('User goalByGoalId:', userGoal);
      const progressRecord = await this.progressRecordService.getProgressRecordByGoalId(goalSelected.id);
      console.log('Progress Record by goal id:', progressRecord);
      if (!userGoal) {
        console.log('No goal found');
        notyf.error('No goal found!');
      } else {
        this.goalDataById = userGoal;
        console.log(
          'User goal after getting from getById route:',
          this.goalDataById
        );

        if (!progressRecord) {
          this.receivedProgressRecord = [];
          console.log('No progress record found')
          notyf.error('Progress record unavailable.');
        } else {
          this.receivedProgressRecord = progressRecord;
          console.log(
            'Progress record after getting from byGoalId route:',
            this.receivedProgressRecord
          );
        }
      }
    } catch (error) {
      console.error('Error loading user goalByGoalId:', error);
      notyf.error('Unable to fetch goal and progress record information.');
    }
  }

  // logic to activate and deactivate goal
  // invokes method at the goal service for this 
  async activateOrDeactivate() {
    try {
      if (typeof this.goalDataById.id !== 'number') {
        console.error('Error! goal id should be number data type.');
        return;
      }
      await this.goalService.activateOrDeactivateGoal(
        !this.goalDataById.isActivated, this.goalDataById.id
      );
      console.log('User goalByGoalId current activation state: ' + this.goalDataById.isActivated + ' requested state: ' + !this.goalDataById.isActivated);
      const userGoal = await this.goalService.getUserGoalById(
        this.goalDataById.id
      );
      this.goalDataById.isActivated = userGoal?.isActivated;
      if (this.goalDataById.isActivated === true)
        notyf.success('Activation successful!');
      else
        notyf.success('Deactivation successful!');
    } catch (err) {
      console.error('Error:', err);
      if (this.goalDataById.isActivated === true)
        notyf.error('Activation Failed!');
      else
        notyf.error('Deactivation Failed!');
    }
  }

  // when user chooses to update goal, then, redirecting page to goal page with selected goal id and activation state as params.
  goToGoalPage() {
    this.router.navigate(['/goal', this.goalDataById.id, this.goalDataById.isActivated]);
  }

  // saving user logged value
  async onProgressRecordRegister(progressRecordForm: NgForm) {
    console.log("Selected Goal at onProgressRecord: ", this.goalSelected);
    if (progressRecordForm.valid) {
      try {
        const reqProgressRecordData = {
          ...progressRecordForm.value,
          goalId: this.goalSelected,
        };
        console.log('Progress Record Form:', reqProgressRecordData);
        const res = await this.progressRecordService.postProgressRecordData(
          reqProgressRecordData
        );
        console.log('Server response:', res);
        Swal.fire({
          title: 'Success!',
          text: 'Logging your today\'s goal successful!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        notyf.success('Logging your today\'s goal successful');
        progressRecordForm.resetForm();
      } catch (err) {
        console.error('Error:', err);
        Swal.fire({
          title: 'Failed!',
          text: 'Logging your today\'s goal unsuccessful!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }
}
