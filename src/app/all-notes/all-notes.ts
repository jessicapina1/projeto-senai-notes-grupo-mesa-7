import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INotes {
  titulo: string;
  descricao: string;
  usuarioID: string;
  id: number

  // noteTitle: string;
  // id: number;
  // userId: string;


  
//             "titulo": "titulo da nota",
//             "descricao": "descricao da nota",
//             "imagemUrl": "link da imagem",
//             "usuarioID": 1,
 }

interface IText {
  noteId: number;
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


  constructor(private http: HttpClient, private cd:ChangeDetectorRef) {
    this.notaSelecionada = null!;
    this.textNote = [];
    this.notes = [];

  }
  ngOnInit() {

    this.getNotes();

  }

  async getNotes() {
    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }


    })) as INotes[];

    if (response) {
      let usuarioID = localStorage.getItem("meuId");

      // if (usuarioID != null) {

        // let usuarioIDNumber = Number(usuarioID);

        response = response.filter(notes=>notes.usuarioID == usuarioID);

      
      

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
    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas/" + notaClicada.id, {
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
      noteId: this.notaSelecionada.id,
      usuarioID: localStorage.getItem("meuId"),
      text: this.notaUsuario.value
    };

    //1- salva as mensagens do usuario no banco de dados.
    let novaNotaUsuarioResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novaNotaUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    }));

    await this.onNoteClick(this.notaSelecionada); //atualiza as mensagens da tela


  }



  async novaNota () {

    const nomeNota = prompt("Digite o nome da nova nota:");
    if (!nomeNota) {
      //caso o usuario deixe o campo vazio
      alert("Nome inválido.")
        return;
  
    }
    const novaNotaObj = {

      titulo: nomeNota,
      descricao: "",
      usuarioID: localStorage.getItem ("meuId"),

      //id - sera gerado pelo backend quando cadastrar
      }
      let novaNotaResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novaNotaObj, {
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
