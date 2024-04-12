import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/interfaces/register';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterProfileService } from 'src/app/services/register-profile.service';
import { Auth } from 'aws-amplify';
import { Notyf } from 'notyf';

const notyf = new Notyf(); // initializing new instance of Notyf

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userId: string = '';
  userEmail: string = '';

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
  ) { }

  // gets invoked after this component is initialized
  async ngOnInit() {
    this.userId = await this.authService.getCognitoUserId(); // gets current user username
    this.userEmail = await this.authService.getCognitoUserEmail(); // gets current user email address
    await this.loadUserData();
  }

  // this is for creating new profile when user do not checks the check box for registering
  // check box of asking if user wants to generate analytical report
  async onGeneratingReport() {
    try {
      // building registration data based on the requirement of the back end code
      const reqRegisterData = {
        ...this.registerData,
        id: this.userId,
        needReport: this.registerData.needReport,
        emailAddress: this.userEmail
      };
      console.log('Register Form:', reqRegisterData);
      // invokes POST request to register user information by calling function at the register-profile service
      const res = await this.registerProfileService.postRegisterData(
        reqRegisterData
      );
      console.log('Server response:', res);
      // after registering user profile, updating AWS custom attribute to indicate that user has already registered for the profile
      await this.updateUserFirstLoginStatus();
      this.router.navigate(['/home']); // directing towards home page after successful registration
      notyf.success('Successfully registered your profile!');
    } catch (err) { // catches any thrown error while performing POST request in this function
      console.error('Error:', err);
      notyf.error('Failed to register your profile!'); // show error message to the user using Notyf library
    }
  }

  // this is for updating profile when user changes decision not to generate report
  // decision made after creating profile to generate report
  // logic are similar to the onGeneratingReport()
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
      notyf.success('Successfully updated your profile!');
    } catch (err) {
      console.error('Error:', err);
      notyf.error('Failed to update your profile!');
    }
  }

  // invokes get route by calling method in register-profile service
  // this is to load current user registered data
  async loadUserData() {
    try {
      const userData = await this.registerProfileService.getUserData(
        this.userId
      );
      // response is null if user has not registered
      this.isFirstTimeRegistering = userData === null;
      console.log('User data:', userData);
      console.log('Is first time registering:', this.isFirstTimeRegistering);
      if (this.isFirstTimeRegistering) {
        // if this statement is true then current user have not registered their profile
        console.log('No user data found');
      } else {
        console.log('User data:', userData);
        // using spread operator to update component state
        // this does shallow copy
        this.registerData = { ...userData };
        console.log(
          'Register data after getting data from get route:',
          this.registerData
        );
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      notyf.error('Failed to load your profile information!');
    }
  }

  // invokes post route by calling method in register-profile service
  // this function logic is similar to onGeneratingReport()
  // however, this registration logic is for those users who chooses to generate analytical report
  async onRegister(registerForm: NgForm) {
    console.log(registerForm);
    if (registerForm.valid) {
      try {
        const reqRegisterData = {
          ...registerForm.value,
          id: this.userId,
          needReport: this.registerData.needReport,
          emailAddress: this.userEmail
        };
        console.log('Register Form:', reqRegisterData);
        const res = await this.registerProfileService.postRegisterData(
          reqRegisterData
        );
        console.log('Server response:', res);
        // after registering user profile, updating AWS custom attribute
        await this.updateUserFirstLoginStatus();
        this.router.navigate(['/home']);
        notyf.success('Successfully registered your profile!');
      } catch (err) {
        console.error('Error:', err);
        notyf.error('Failed to register your profile!');
      }
    }
  }

  // invokes put route by calling method in register-profile service
  // this function's logic is similar to onUpdatingGenerationOfReport()
  // however this logic for those user's who chooses to generate analytical report
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
        notyf.success('Successfully updated your profile!');
      } catch (err) {
        console.error('Error:', err);
        notyf.error('Failed to update your profile!');
      }
    }
  }

  // updates custom attribute at the AWS
  async updateUserFirstLoginStatus() {
    try {
      const user = await Auth.currentAuthenticatedUser(); // getting current user's information from AWS Cognito
      // changes custom attribute (firstLogin) to false 
      await Auth.updateUserAttributes(user, {
        'custom:firstLogin': 'false',
      });
      // to force a refresh so that we get updated current user's information
      await Auth.currentAuthenticatedUser({ bypassCache: true });
    } catch (error) {
      console.error('Error updating user attributes:', error);
    }
  }
}
