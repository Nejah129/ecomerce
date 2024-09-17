import { ProductService } from './../../servies/product.service';
import { ProductCategory } from './../../common/product-category';
import { UserServiceService } from './../../servies/user-service.service';
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
import { User } from '../../common/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-form',
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
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  providers: [MessageService],
})
export class LoginFormComponent implements OnInit {
  loginFromGroup!: FormGroup;
  token: string | null = localStorage.getItem('token');
  user: any = localStorage.getItem('user') || '';
  errorMessage: string | null = null;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private messageService: MessageService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.loginFromGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      }),
    });
    this.userService.token$.subscribe((token) => {
      this.token = JSON.stringify(token);
    });
    this.userService.user$.subscribe((user) => {
      this.user = JSON.stringify(user);
    });
    console.log(this.user)
  }
  getFormGroup(name: string): FormGroup {
    return this.loginFromGroup.get(name) as FormGroup;
  }
  isFieldInvalid(group: string, field: string): any {
    const control = this.getFormGroup(group).get(field);

    return control?.invalid && (control.touched || control.dirty);
  }
  onSubmit(): void {
    this.loginFromGroup.markAllAsTouched();
    if (this.loginFromGroup.valid) {
      try {
        const theUser = this.loginFromGroup.get('user')?.value as User;
        this.userService.UserLogin(theUser).subscribe((response) => {
          if (response.error) {
            console.error('Error User Login', response.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Submission Error',
              detail: response.error,
            });
          } else {
            console.log('User Login successfully', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Login submitted successfully!',
            });
            this.userService.setToken(response.token);
            this.userService.setUser(response.user);
            this.userService.getData();
            this.productService.getProductCategories();
            console.log('get service data');
            this.router.navigate(['/']);
          }
        });
        console.log(this.userService.UserLogin(theUser));
      } catch (error: any) {
        this.errorMessage = error.error;
        console.error('Error during form User  Sign Up:', error);
      }
    } else {
      console.log('Form has errors');
    }
  }
  goToSignUp() {
    this.router.navigate(['/signup']);
  }
  getData(): void {
    this.token = localStorage.getItem('token') || '';

    const userData = localStorage.getItem('user');

    try {
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.user = null;
    }

    if (this.user) {
      console.log(this.user);
      console.log(this.user.firstName);
    } else {
      console.log('User data is not available or invalid.');
    }
  }
}
