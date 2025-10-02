import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  loginForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  loginFail: string;

  constructor (private fb: FormBuilder, private cd: ChangeDetectorRef) {

    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]] 
    });

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.loginFail= "";
  
    
  }

  validacoes() {

    this.emailErrorMessage = ""; 
    this.passwordErrorMessage = "";
    

     if (this.loginForm.value.email=== "") {
      
      this.emailErrorMessage = "O campo de e-mail é obrigatório"
      return false;
    }

    if (this.loginForm.value.password === "") {
      
      this.passwordErrorMessage = "O campo de senha é obrigatório"         
      return false;
    }


    return true
  }


  async onLoginClick() {
    
    let hasError = this.validacoes();

    if (hasError == false) {
      return
    }


    let response = await fetch ("https://senai-gpt-api.azurewebsites.net/login", { 

      method: "POST",
      headers: {
        "Content-type" : "application/json"

      },
      body: JSON.stringify ({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })

    }); 

    if (response.status>=200 && response.status<=299) {

      let json = await response.json();
      console.log("JSON",json);
      let meuToken = json.accessToken;
      let userId = json.user.id;

      localStorage.setItem("meuToken", meuToken);
      localStorage.setItem("meuId", userId);

      this.loginForm.value.email = "";

      window.location.href = "notes";

    }
     else {
      this.loginFail = "Falha no login - revise as informações"
      
    }
   
    this.cd.detectChanges();

  }
}
