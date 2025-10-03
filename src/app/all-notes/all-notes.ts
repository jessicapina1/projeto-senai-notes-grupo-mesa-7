import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INotes {
  noteTitle: string;
  id: number;
  userId: string;

}

interface IText {
  chatId: number;
  text: string;
  userId: string;
  id: number;

}

@Component({
  selector: 'app-all-notes',
  imports: [],
  templateUrl: './all-notes.html',
  styleUrl: './all-notes.css'
})

export class AllNotes {
  onEnterClick: any;
  notes: INotes[];
  notaSelecionada: INotes;
  textNote: IText[];
  notaUsuario = new FormControl("");
  darkMode: boolean = false;


  constructor(private http: HttpClient, private cd:ChangeDetectorRef) {
    this.notaSelecionada = null!;
    this.textNote = [];
    this.notes = [];

  }
  ngOnInit() {

    this.getNotes();

     let darkModeLocalStorage = localStorage.getItem("darkMode");

    if (darkModeLocalStorage == "true") {
      this.darkMode = true;
      document.body.classList.toggle("dark-mode", this.darkMode);
    }

  }

  async getNotes() {
    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }


    })) as INotes[];

    if (response) {
      let userId = localStorage.getItem("meuId");
      response = response.filter(notes=>notes.userId == userId);

      //mostra os chats na tela
      this.notes = response as [];


    } else {

      console.log("Erro ao buscar as notas.");


    }

   this.cd.detectChanges();
  }

  async onNoteClick(notaClicada: INotes) {

    console.log("Nota Clicada", notaClicada);

    this.notaSelecionada = notaClicada;

    //Logica para buscar as mensagens.
    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + notaClicada.id, {
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }


    }));

    console.log ("TEXTO DA NOTA", response);

    this.textNote = response as IText[]; ///verificar se nao seri INotes

    this.cd.detectChanges();

  }

  async salvarNota () {

    let novaNotaUsuario = {
      chatId: this.notaSelecionada.id,
      userId: localStorage.getItem("meuId"),
      text: this.notaUsuario.value
    };

    //1- salva as mensagens do usuario no banco de dados.
    let novaNotaUsuarioResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaNotaUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    }));

    await this.onNoteClick(this.notaSelecionada); //atualiza as mensagens da tela

    //2- enviar a mensagem do usuario para a IA responder
    // let respostaIAResponse = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
    //   "contents": [ {
    //     "parts": [
    //       {
    //         "text": this.mensagemUsuario.value + ". Me dê uma resposta objetiva."
    //       }
    //     ]
    //   }
    // ]
    // }, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"
    //   }
    // })) as any;

    // let novaRespostaIA = {

    //   chatId: this.chatSelecionado.id,
    //   userId: "chatbot",
    //   text: respostaIAResponse.candidates[0].content.parts[0].text,
    //   //id a api gera
    // }

    // //3- salva a resposta da IA no banco de dados
    // let novaRespostaIAResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaRespostaIA, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer " + localStorage.getItem("meuToken")
    //   }

    // }));

    await this.onNoteClick(this.notaSelecionada);

  }

  async novaNota () {

    const nomeNota = prompt("Digite o nome da nova nota:");
    if (!nomeNota) {
      //caso o usuario deixe o campo vazio
      alert("Nome inválido.")
        return;
  
    }
    const novaNotaObj = {

      noteTitle: nomeNota,
      userId: localStorage.getItem ("meuId"),

      //id - sera gerado pelo backend quando cadastrar
      }
      let novaNotaResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/chats", novaNotaObj, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INotes;


    //atualiza os chats da tela
    await this.getNotes();
    //abre direto o novo chat criado
    await this.onNoteClick(novaNotaResponse);


  }

  deslogar () {

    // alternativa - local.Storage.remove.Item("meuToken") e ("meuId")

    localStorage.clear();

    window.location.href = "login";


  }
}
