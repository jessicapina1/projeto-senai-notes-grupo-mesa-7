import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-new-user-screen',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule 
  ],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css',
})

export class NewUserScreen {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

 
  onLogin() {
    this.clearMessages();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    
  }


  onSignUp() {
    this.clearMessages();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }

    const { email, password } = this.loginForm.value;
    const nome = email.split('@')[0]; 

    this.http.post('https://senai-gpt-api.azurewebsites.net/users', { nome, email, password }).subscribe({
      next: () => {
        this.successMessage = 'Usuário criado com sucesso!';
      },
      error: () => {
        this.errorMessage = 'Erro ao criar usuário. Tente novamente.';
      },
    });
  }

 
  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
