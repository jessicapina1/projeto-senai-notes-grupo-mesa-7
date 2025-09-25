import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { NewUserScreen } from './user-module/new-user-screen/new-user-screen';
import { AllNotes } from './all-notes/all-notes';


export const routes: Routes = [
    
    {
        path: "login",
        loadComponent: () => LoginScreen
    },
    {
        path: "new-user",
        loadComponent: () =>NewUserScreen
        
    },
    {
        path: "notes",
        loadComponent: () => AllNotes
}
];