import { Component } from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-new-user-screen',
  imports: [],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'
})

export class NewUserScreen {

  registerForm: FormGroup;

  emailErrorMessage: string; 
  passwordErrorMessage: string;
  confirmPasswordErrorMessage: string;
  approvedMessage: string;
  usernameErrorMessage: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // Quando a tela iniciar.

    //Inicia o formulário;
    //Cria campo obrigatório de e-mail;
    //Cria campo obrigatório de senha.
    this.registerForm = this.fb.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]]
    });

    // Inicia com uma string vazia
    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.confirmPasswordErrorMessage = "";
    this.approvedMessage = "";
    this.usernameErrorMessage = "";

  }

  async enterLoginClick() {

    console.log("Email", this.registerForm.value.email);
    console.log("Password", this.registerForm.value.password);
    console.log("Criar nova conta de usuário", this.registerForm.value.username);
    console.log("Confirmar a senha", this.registerForm.value.confirmPassword);
    
          
    if (this.registerForm.value.username === ""){

      this.usernameErrorMessage = "O campo usuário é obrigatório.";

    } 
    
    if (this.registerForm.value.email === ""){

      this.emailErrorMessage = "O campo e-mail é obrigatório.";

      this.emailErrorMessage = "Digite um e-mail válido.";

    }

    if (this.registerForm.value.password === ""){

      // alert("Preencha a senha.")
      this.passwordErrorMessage = "O campo senha é obrigatório.";
      return;

    }

    if (this.registerForm.value.confirmPassword === ""){

      // alert("Preencha a senha.")
      this.confirmPasswordErrorMessage = "O campo senha é obrigatório.";
      return;

    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) { 
      this.confirmPasswordErrorMessage = "As senhas não coincidem.";
      return;
    } 

      const userData = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      username: this.registerForm.value.username
    };

    //   this.http.post("https://senai-gpt-api.azurewebsites.net/users", userData).subscribe(
    //   (response: any) => {
    //     this.approvedMessage = "Cadastro realizado com sucesso!";
    //     console.log("Resposta do backend:", response);

    //   },
    //   (error: HttpErrorResponse) => {
    //     console.error("Erro ao cadastrar usuário:", error);
    //     alert("Erro ao realizar cadastro. Tente novamente.");
    //   }

    // );
    
    let response = await fetch("https://senai-gpt-api.azurewebsites.net/users", {
      method: "POST", // Enviar,
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(userData)
    });

    console.log("STATUS CODE", response.status);
   
    if (response.status >= 200 && response.status <=299) {
      //alert("Requisição bem-sucedida");
      this.approvedMessage = "Login concluido com sucesso!"

      let json = await response.json();

      console.log("JSON", json)

      window.location.href = "login";

    } else {
      alert("Credenciais incorretas.");
    } 

    this.cd.detectChanges(); // Força uma atualização da tela.

  }}