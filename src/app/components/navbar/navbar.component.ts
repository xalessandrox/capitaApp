import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { User } from "../../interfaces/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
@Input() user:User;
  constructor(private router:Router, private userService: UserService) {}

  logOut(): void {
    this.userService.logOut();
    this.router.navigate( [ 'login' ] );
  }


}
