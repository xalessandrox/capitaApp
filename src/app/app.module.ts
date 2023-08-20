import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomersComponent } from './components/customers/customers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { NgOptimizedImage } from "@angular/common";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { NewInvoiceComponent } from './components/new-invoice/new-invoice.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

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
    StatisticsComponent,
    NewCustomerComponent,
    NewInvoiceComponent,
    InvoicesComponent,
    InvoiceComponent
  ],
  imports : [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage
  ],
  providers : [ { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true } ],
  bootstrap : [ AppComponent ]
} )
export class AppModule {
}
