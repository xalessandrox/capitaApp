import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomersComponent } from './components/customers/customers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StatsComponent } from './components/stats/stats.component';

@NgModule( {
  declarations : [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetPasswordComponent,
    HomeComponent,
    CustomerComponent,
    ProfileComponent,
    CustomersComponent,
    NavbarComponent,
    StatsComponent
  ],
  imports : [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers : [],
  bootstrap : [ AppComponent ]
} )
export class AppModule {
}
