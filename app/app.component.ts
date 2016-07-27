import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
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
}
