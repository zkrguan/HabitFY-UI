import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Goal } from 'src/app/interfaces/goal';
import { AuthService } from 'src/app/services/auth.service';
import { GoalService } from 'src/app/services/goal.service';

@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrls: ['./home-page-card.component.css'],
})
export class HomePageCardComponent {
  errMsg: string = '';
  userId: string = '';


  goalData: Goal[] = [];

  goalDataById: Goal = {};
  
  goalSelected: string|null = null;

  isGoalFound:boolean = false;
  
constructor( private authService: AuthService,
  private goalService: GoalService,
  private router: Router){}

  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId();
    await this.loadUserGoals();
  }

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
      this.errMsg = 'Error! Unable to fetch user goals!';
    }
  }

  async onGoalSelection(goalSelected: any) {
    this.goalSelected = this.goalSelected === goalSelected.id ? null : goalSelected.id;

    try {
      const userGoal = await this.goalService.getUserGoalById(
        goalSelected.id
      );
      console.log('User goalByGoalId:', userGoal);
      if (!userGoal) {
        console.log('No goal found');
      } else {
        console.log('User goalByGoalId:', userGoal);
        this.goalDataById = userGoal;
        console.log(
          'User goal after getting from getById route:',
          this.goalDataById
        );
      }
    } catch (error) {
      console.error('Error loading user goalByGoalId:', error);
      this.errMsg = 'Error! Unable to fetch user goal!';
    }
  }

  async activateOrDeactivate(){
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
      } catch (err) {
        console.error('Error:', err);
        this.errMsg = 'Unable to register your goal!';
      }
  }

  goToGoalPage() {
    this.router.navigate(['/goal', this.goalDataById.id, this.goalDataById.isActivated]);
  }
}
