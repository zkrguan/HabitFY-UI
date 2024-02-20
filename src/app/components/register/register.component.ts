import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/interfaces/register';
import { Auth } from 'aws-amplify';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterProfileService } from 'src/app/services/register-profile.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errMsg: string = '';
  userId: string = '';

  // initializing it to true and changing it based on GET request response
  isFirstTimeRegistering: boolean = true;

  registerData: Register = {
    age: null,
    city: null,
    needReport: false,
    postalCode: null,
    province: null,
    sex: null,
  };

  genders = [
    { id: 'male', name: 'sex', value: 'Male' },
    { id: 'female', name: 'sex', value: 'Female' },
    { id: 'non-binary', name: 'sex', value: 'Non-Binary' },
  ];

  constructor(
    private authService: AuthService,
    private registerProfileService: RegisterProfileService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId();
    await this.loadUserData();
  }

  // this is for creating new profile when user do not checks the check box for registering
  async onGeneratingReport() {
    try {
      const reqRegisterData = {
        ...this.registerData,
        id: this.userId,
        needReport: this.registerData.needReport,
      };
      console.log('Register Form:', reqRegisterData);
      const res = await this.registerProfileService.postRegisterData(
        reqRegisterData
      );
      console.log('Server response:', res);
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error:', err);
      this.errMsg = 'Unable to register your profile!';
    }
  }

  // this is for updating profile when user changes decision not to generate report
  // decision made after creating profile to generate report
  async onUpdatingGenerationOfReport() {
    try {
      // customizing json data to include username, and needReport 
      const reqUpdateData = {
        ...this.registerData,
        id: this.userId,
        needReport: this.registerData.needReport,
      };
      console.log('Update Form:', reqUpdateData);
      const res = await this.registerProfileService.updateRegisterData(
        reqUpdateData
      );
      console.log('Server response on update route:', res);
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error:', err);
      this.errMsg = 'Unable to update your profile!';
    }
  }

  // invokes get route by calling method in register-profile service
  async loadUserData() {
    try {
      const userData = await this.registerProfileService.getUserData(
        this.userId
      );
      this.isFirstTimeRegistering = userData === null;
      console.log('User data:', userData);
      console.log('Is first time registering:', this.isFirstTimeRegistering);
      if (this.isFirstTimeRegistering) {
        console.log('No user data found');
      } else {
        console.log('User data:', userData);
        this.registerData = { ...userData };
        console.log(
          'Register data after getting data from get route:',
          this.registerData
        );
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.errMsg = 'Error! Unable to fetch user data!';
    }
  }

  // invokes post route by calling method in register-profile service
  async onRegister(registerForm: NgForm) {
    console.log(registerForm);
    if (registerForm.valid) {
      try {
        const reqRegisterData = {
          ...registerForm.value,
          id: this.userId,
          needReport: this.registerData.needReport,
        };
        console.log('Register Form:', reqRegisterData);
        const res = await this.registerProfileService.postRegisterData(
          reqRegisterData
        );
        console.log('Server response:', res);
        this.router.navigate(['/home']);
      } catch (err) {
        console.error('Error:', err);
        this.errMsg = 'Unable to register your profile!';
      }
    }
  }

  // invokes put route by calling method in register-profile service
  async onUpdate(registerForm: NgForm) {
    console.log(registerForm);
    if (registerForm.valid) {
      try {
        const reqUpdateData = {
          ...registerForm.value,
          id: this.userId,
          needReport: this.registerData.needReport,
        };
        console.log('Update Form:', reqUpdateData);
        const res = await this.registerProfileService.updateRegisterData(
          reqUpdateData
        );
        console.log('Server response on update route:', res);
        this.router.navigate(['/home']);
      } catch (err) {
        console.error('Error:', err);
        this.errMsg = 'Unable to update your profile!';
      }
    }
  }

  emptyErrMsg() {
    this.errMsg = '';
  }
}
