import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Response, RequestOptions} from '@angular/http';

@Injectable()
export class BaseService {

    public getUrl() {
        return "http://uat.fipe.org.br/api/veiculos/";
    }

    public extractData(res: Response) {
        if (res.status < 200 || res.status >= 300)
            throw new Error('Bad response status: ' + res.status);

        let body = res.json();
        return body || [];
    }

    public handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = JSON.parse(error._body).mensagem || 'Server error';
        return Observable.throw(errMsg);
    }
}