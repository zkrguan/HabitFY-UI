import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { ProgressRecord } from 'src/app/interfaces/progress-record';
import { AuthService } from 'src/app/services/auth.service';
import { GoalService } from 'src/app/services/goal.service';
import { ProgressRecordService } from 'src/app/services/progress-record.service';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import SimpleBar from 'simplebar';

const notyf = new Notyf();

@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrls: ['./home-page-card.component.css'],
})

export class HomePageCardComponent implements AfterViewChecked {
  // to retrieve a DOM element directly from the Angular component.
  @ViewChild('simplebarForScroll') simplebarScroll!: ElementRef;

  isSimpleBarInitialized = false;

  userId: string = '';

  goalData: Goal[] = [];

  goalDataById: Goal = {};

  goalSelected: string | null = null;

  isGoalFound: boolean = false;

  progressRecordByGoalId: ProgressRecord = {
    notes: null,
    completedValue: null,
    createdTime: null
  };

  selectedDate: string = '';
  upToDateSelection: string = '';
  receivedProgressRecord: ProgressRecord[] = [];

  constructor(private authService: AuthService,
    private goalService: GoalService,
    private router: Router, private progressRecordService: ProgressRecordService) { }

  async ngOnInit() {
    // loading user goal when this component initializes
    await this.loadUserGoals();
    // logic to get current date
    const currentDate = new Date();
    this.selectedDate = this.splitToIncludeDateOnly(currentDate);
    this.upToDateSelection = this.selectedDate;
    // end of logic to get current date
    console.log("on init date value: ", this.selectedDate);
  }

  ngAfterViewChecked(): void {
    // checking to see if there are progress record and if simple bar has been initialized or not
    if (this.receivedProgressRecord.length && !this.isSimpleBarInitialized) {
      // initializing simple bar scroll
      new SimpleBar(this.simplebarScroll.nativeElement);
      // to prevent re-initialization
      this.isSimpleBarInitialized = true;
    }
  }

  // to load all user goals
  async loadUserGoals() {
    try {
      // getting user id from the AWS Cognito service
      this.userId = await this.authService.getCognitoUserId();
      // invoking method in goal service to get all the current user goals
      const userGoals = await this.goalService.getUserGoals(
        this.userId
      );
      console.log('User goals:', userGoals);
      // checking if server responded with goals
      if (!userGoals || userGoals.length === 0) {
        console.log('No goals found');
      } else {
        console.log('User goals:', userGoals);
        // updating component state with the received goals
        this.goalData = userGoals;
        console.log(
          'User goals after getting from get route:',
          this.goalData
        );
        // flag to check if goal is found or not
        // this is being used in HTML code as a flag
        this.isGoalFound = true;
      }
    } catch (error) {
      // catches any thrown error while getting user's all goals
      // logging error
      console.error('Error loading user goal:', error);
    }
  }

  // logic to get goal information by id based on selection
  // invokes method at the goal service for this 
  async onGoalSelection(goalSelected: any) {
    // logic for clicking user specific goal
    // if same goal is clicked twice then this.goalSelected becomes null, if not then, assigning selected goal id to it
    this.goalSelected = this.goalSelected === goalSelected.id ? null : goalSelected.id;
    let progressRecord;
    try {
      // getting user goal by id
      const userGoal = await this.goalService.getUserGoalById(
        goalSelected.id
      );
      console.log('User goalByGoalId:', userGoal);
      // if user selected goal then get progress record based on selected goal and date
      if (this.goalSelected != null)
        progressRecord = await this.progressRecordService.getProgressRecordByGoalId(this.goalSelected, this.selectedDate);
      console.log('Progress Record by goal id:', progressRecord);
      // notifying user if no goal is found from the GET route
      if (!userGoal) {
        console.log('No goal found');
        notyf.error('No goal found!');
      } else {
        // updating the component state based on received user goal from the route
        this.goalDataById = userGoal;
        this.isSimpleBarInitialized = false; // helps to initialize simple bar again after switching the goal selection
        console.log(
          'User goal after getting from getById route:',
          this.goalDataById
        );
        // checking if progress record is received from the GET route
        if (!progressRecord) {
          // to refresh the component state value if progress record is not found 
          this.receivedProgressRecord = [];
          console.log('No progress record found')
          // following condition helps not to notify when user de-selects the goal
          if (this.goalSelected != null)
            console.log('Progress record unavailable.')
        } else {
          // update component state with updated data received from the route
          this.receivedProgressRecord = progressRecord;
          console.log(
            'Progress record after getting from byGoalId route:',
            this.receivedProgressRecord
          );
        }
      }
    } catch (error) {
      // handles errors and notify error message to the user
      console.error('Error loading user goalByGoalId:', error);
      notyf.error('Unable to fetch goal and progress record information.');
    }
  }

  // logic to activate and deactivate goal
  // invokes method at the goal service for this 
  async activateOrDeactivate() {
    try {
      // checking if goal id is in number or not
      // cancels the operation if it is not in number
      if (typeof this.goalDataById.id !== 'number') {
        console.error('Error! goal id should be number data type.');
        return;
      }
      // calling method defined in goal service to activate ot deactivate goal
      await this.goalService.activateOrDeactivateGoal(
        !this.goalDataById.isActivated, this.goalDataById.id
      );
      console.log('User goalByGoalId current activation state: ' + this.goalDataById.isActivated + ' requested state: ' + !this.goalDataById.isActivated);
      // after changing activation state of goal, we need to update its state in UI as well
      // so, getting goal by id again
      const userGoal = await this.goalService.getUserGoalById(
        this.goalDataById.id
      );
      // assigning new activation state to the local state
      this.goalDataById.isActivated = userGoal?.isActivated;
      // notifying goal state based on its state (activation or deactivation)
      if (this.goalDataById.isActivated === true)
        notyf.success('Activation successful!');
      else
        notyf.success('Deactivation successful!');
    } catch (err) {
      // catch block to handle errors
      console.error('Error:', err);
      // notify error to the user using notyf library
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
    // checking if form is valid
    if (progressRecordForm.valid) {
      try {
        // construction of request payload by including goal id
        const reqProgressRecordData = {
          ...progressRecordForm.value,
          goalId: this.goalSelected,
        };
        console.log('Progress Record Form:', reqProgressRecordData);
        // calling the method defined in progress record service
        // this helps to call POST method to register progress record
        const res = await this.progressRecordService.postProgressRecordData(
          reqProgressRecordData
        );
        console.log('Server response:', res);
        // using Swal library to show success message
        Swal.fire({
          title: 'Success!',
          text: 'Logging your today\'s goal successful!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // after registering new progress record, resetting the input box
        progressRecordForm.resetForm();
        await this.basedOnSelectedDate();
      } catch (err) {
        // handling any thrown error here
        console.error('Error:', err);
        // showing dialogue box error message to user
        Swal.fire({
          title: 'Failed!',
          text: 'Logging your today\'s goal unsuccessful!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }

  async basedOnSelectedDate() {
    console.log("Based on Date selection: ", this.selectedDate);
    // checking if a goal is selected or not before getting the progress records.
    if (this.goalSelected == null) {
      console.log('No goal selected at basedOnSelectedDate function');
      notyf.error('Please select a goal first.');
      return; // terminate fetching progress record if goal is not selected
    }
    try {
      const progressRecord = await this.progressRecordService.getProgressRecordByGoalId(this.goalSelected, this.selectedDate);
      if (!progressRecord || progressRecord.length === 0) {
        this.receivedProgressRecord = [];
        console.log('No progress record found at basedOnSelectedDate function');
        notyf.error('Progress record unavailable.');
      } else {
        // assign the received progress record to  this.receivedProgressRecord.
        this.receivedProgressRecord = progressRecord;
        this.isSimpleBarInitialized = false; // helps to initialize simple bar again after fetching progress record based on date
        console.log('Progress record after getting from byGoalId route:', this.receivedProgressRecord);
      }
    } catch (error) {
      console.error('Error fetching progress records:', error);
      notyf.error('An error occurred while fetching progress records.');
    }
  }

  // only get date by excluding time
  // also helps to match the user location's date after splitting
  splitToIncludeDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // adds leading 0 to make date format in YYYY-MM-DD
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}`;
  }
}
