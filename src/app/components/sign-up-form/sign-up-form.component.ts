import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectModule,
} from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserServiceService } from '../../servies/user-service.service';
import { User } from '../../common/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    NgSelectModule,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css',
  providers: [MessageService],
})
export class SignUpFormComponent implements OnInit {
  signUpFromGroup!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private messageService:MessageService,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.signUpFromGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      }),
    });
  }
  getFormGroup(name: string): FormGroup {
    return this.signUpFromGroup.get(name) as FormGroup;
  }
  isFieldInvalid(group: string, field: string): any {
    const control = this.getFormGroup(group).get(field);

    return control?.invalid && (control.touched || control.dirty);
  }
  onSubmit(): void {
    this.signUpFromGroup.markAllAsTouched();
    if (this.signUpFromGroup.valid) {
    try {
      const newUser = this.signUpFromGroup.get('user')?.value as User;
      this.userService.UserSignUp(newUser).subscribe(
        (response) => {
          if (response.error) {
            console.error('Error User Sign Up', response.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Submission Error',
              detail: response.error,
            });
          } else {
            console.log('User Sign Up successfully', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'SigNup submitted successfully!',
            });
            this.router.navigate(['/']);
          }});
      console.log(this.userService.UserSignUp(newUser))
    } catch (error:any) {
      this.errorMessage =error.error;
      console.error('Error during form User  Sign Up:', error);
    }
  }else {
    console.log('Form has errors');
  }
}
goToLogin(){
  this.router.navigate(['/login']);
}
}
