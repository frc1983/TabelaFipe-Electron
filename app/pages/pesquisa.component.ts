import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

@Component({
    selector: 'pesquisa',
    templateUrl: 'pesquisa.component.html'
})
export class PesquisaComponent {
    router: Router;

    constructor(private route: ActivatedRoute, _router: Router) {
        this.router = _router;
    }

    ngOnInit() {
        
    }
}