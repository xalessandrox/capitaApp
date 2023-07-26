import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { VerifyComponent } from "./components/verify/verify.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { CustomersComponent } from "./components/customers/customers.component";

const routes: Routes = [
  { path : 'login', component : LoginComponent },
  { path : 'register', component : RegisterComponent },
  { path : 'reset-password', component : ResetPasswordComponent },
  { path : 'user/verify/account/:key', component : VerifyComponent },
  { path : 'user/verify/password/:key', component : VerifyComponent },
  { path : 'customers', component : CustomersComponent },
  { path : 'profile', component : ProfileComponent },
  { path : '', component : HomeComponent },
  { path : '', redirectTo: '/', pathMatch: 'full'},
  { path : '**', component : HomeComponent },
];

@NgModule( {
  imports : [ RouterModule.forRoot( routes ) ],
  exports : [ RouterModule ]
} )

export class AppRoutingModule {
}
