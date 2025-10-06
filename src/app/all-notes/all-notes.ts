import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INotes {
  titulo: string;
  descricao: string;
  usuarioID: string;
  id: number;
  // imagemUrl: 

 }

@Component({
  selector: 'app-all-notes',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './all-notes.html',
  styleUrl: './all-notes.css'
})

export class AllNotes {
  onEnterClick: any;
  notes: INotes[];
  notaSelecionada: INotes;
  tituloNota = new FormControl("");
  descricao = new FormControl ("");
  darkMode: boolean = false;


  constructor(private http: HttpClient, private cd:ChangeDetectorRef) {
    this.notaSelecionada = null!;
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
    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }


    })) as INotes[];

    if (response) {
      let usuarioID = localStorage.getItem("meuId");

        response = response.filter(notes=>notes.usuarioID == usuarioID);     
      
      this.notes = response;


    } else {

      console.log("Erro ao buscar as notas.");


    }

   this.cd.detectChanges();
  }

  async onNoteClick(notaClicada: INotes) {

    // console.log("Nota Clicada", notaClicada);

    this.notaSelecionada = notaClicada;

    this.tituloNota.setValue(this.notaSelecionada.titulo);
    this.descricao.setValue(this.notaSelecionada.descricao)
    

    //Logica para buscar as mensagens.
    let response = await firstValueFrom(this.http.get("http://localhost:3000/notas/" + notaClicada.id, {
      headers: {

        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }


    }));

    this.cd.detectChanges();

  }

  async salvarNota () {

    let novaNotaUsuario = {
      id: this.notaSelecionada.id,
      usuarioID: localStorage.getItem("meuId"),
      titulo: this.tituloNota.value,
      descricao: this.descricao.value
    };

    //1- salva as mensagens do usuario no banco de dados.
    let notaAtualizadaResponse = await firstValueFrom(this.http.put("http://localhost:3000/notas/"+ this.notaSelecionada.id, novaNotaUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INotes;

    let textoAtualizadoResponse = await firstValueFrom(this.http.put("http://localhost:3000/notas/"+ this.notaSelecionada.id, novaNotaUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")

      }


    })) as INotes;

    await this.onNoteClick(notaAtualizadaResponse); //atualiza as mensagens da tela
    await this.onNoteClick(textoAtualizadoResponse);
    await this.getNotes();

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

  async deletarNota () {

    let confirmation = confirm("Deseja realmente deletar a nota " + this.notaSelecionada.titulo + "?")
    if (!confirmation) {
      return
    }
    try {
      let deleteResponse = await firstValueFrom (this.http.delete("http://localhost:3000/notas/"+this.notaSelecionada.id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("meuToken")
            }
          }
            )) as INotes;
          } catch (error) {
            console.log("Erro no delete: " + error);
          }
          await this.getNotes();

          this.notaSelecionada = null!;

          this.cd.detectChanges();
        } 
      } 