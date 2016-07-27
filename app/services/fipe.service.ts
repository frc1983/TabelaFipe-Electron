import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, HTTP_PROVIDERS, Headers, RequestOptions } from '@angular/http';

import { BaseService } from './base.service';
import { Marca } from '../models/marca';
import { Modelo } from '../models/modelo';
import { Ano } from '../models/ano';
import { Veiculo } from '../models/veiculo';

@Injectable()
export class FipeService {
    options: RequestOptions;

    constructor(private http: Http, private _baseService: BaseService) {
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin', 'http://veiculos.fipe.org.br');
        headers.append('Content-Type', 'application/json');
        this.options = new RequestOptions({ headers: headers });
    }

    getMarcasFipe(tipoVeiculo: number) {
        return this.http.post(this._baseService.getUrl() + "ConsultarMarcas?codigoTabelaReferencia=193&codigoTipoVeiculo=" + tipoVeiculo, "")
            .map(obj => Marca.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getModelosFipe(tipoVeiculo: number, codMarca: number) {
        return this.http.post(this._baseService.getUrl() + "ConsultarModelos?codigoTabelaReferencia=193&codigoTipoVeiculo=" +
            tipoVeiculo + "&codigoMarca=" +
            codMarca + "&codigoModelo=&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=", "")
            .map(obj => Modelo.fromJSONArray(this._baseService.extractData(obj).Modelos))
            .catch(this._baseService.handleError);
    }

    getAnosModeloFipe(tipoVeiculo: number, codMarca: number, codModelo: number) {
        return this.http.post(this._baseService.getUrl() + "ConsultarAnoModelo?codigoTabelaReferencia=193&codigoTipoVeiculo=" +
            tipoVeiculo + "&codigoMarca=" +
            codMarca + "&codigoModelo=" +
            codModelo + "&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=", "")
            .map(obj => Ano.fromJSONArray(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }

    getVeiculoFipe(codTipoVeiculo: number, codMarca: number, codModelo: number, ano: number, codTipoCombustivel: number, tipoVeiculo: string) {
        return this.http.post(this._baseService.getUrl() + "ConsultarValorComTodosParametros?codigoTabelaReferencia=193" +
            "&codigoTipoVeiculo=" + codTipoVeiculo +
            "&codigoMarca=" + codMarca +
            "&codigoModelo=" + codModelo +
            "&anoModelo=" + ano +
            "&codigoTipoCombustivel=" + codTipoCombustivel +
            "&tipoVeiculo=" + tipoVeiculo +
            "&modeloCodigoExterno=&tipoConsulta=tradicional", "", this.options)
            .map(obj => Veiculo.fromJSON(this._baseService.extractData(obj)))
            .catch(this._baseService.handleError);
    }
}