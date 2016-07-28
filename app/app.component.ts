import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { BaseService } from './services/base.service';
import { FipeService } from './services/fipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [BaseService, FipeService]
})
export class AppComponent {
  title = 'app works!';
  router: Router;
  
  constructor(_router: Router){
    this.router = _router;
  }
  
  ngOnInit(){
    this.router.navigate(["/home"]);
  }
}
