import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { VerifyComponent } from "./components/verify/verify.component";

const routes: Routes = [
  { path : 'login', component : LoginComponent },
  { path : 'register', component : RegisterComponent },
  { path : 'reset-password', component : ResetPasswordComponent },
  { path : 'user/verify/account/:key', component : VerifyComponent },
  { path : 'user/verify/password/:key', component : VerifyComponent },
  { path : '**', redirectTo :  'login' },
];

@NgModule( {
  imports : [ RouterModule.forRoot( routes ) ],
  exports : [ RouterModule ]
} )

export class AppRoutingModule {
}
