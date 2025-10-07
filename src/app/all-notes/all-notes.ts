import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface INotes {
  titulo: string;
  descricao: string;
  usuarioID: string;
  id: number;
  tags: string
  // imagemUrl: 

 }

@Component({
  selector: 'app-all-notes',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
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

  tagSelecionada = '';
  tagsDisponiveis = [

    "dev",
    "cooking",
    "work",
    "home"

  ];


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

      console.log("Erro ao buscar as notas");

    }

   this.cd.detectChanges();
  }

  async onNoteClick(notaClicada: INotes) {

    this.notaSelecionada = notaClicada;

    this.tituloNota.setValue(this.notaSelecionada.titulo);
    this.descricao.setValue(this.notaSelecionada.descricao);
    if ( this.notaSelecionada.tags!= null && this.notaSelecionada.tags.length>0) {
    this.tagSelecionada = this.notaSelecionada.tags[0]}
    else {
      this.tagSelecionada = ""
    }

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
      descricao: this.descricao.value,
      tags: [this.tagSelecionada]
    };

    let notaAtualizadaResponse = await firstValueFrom(this.http.put("http://localhost:3000/notas/"+ this.notaSelecionada.id, novaNotaUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INotes;

 
    await this.onNoteClick(notaAtualizadaResponse); //atualiza as mensagens da tela
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

      }
      let novaNotaResponse = await firstValueFrom(this.http.post("http://localhost:3000/notas", novaNotaObj, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    })) as INotes;


    await this.getNotes();
    await this.onNoteClick(novaNotaResponse);


  }

  deslogar () {

    localStorage.clear();

    window.location.href = "login";

  }

  cancelar() {

    this.notaSelecionada = null!;
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