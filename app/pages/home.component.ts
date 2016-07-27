import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

import { FipeService } from '../services/fipe.service';
import { Marca } from '../models/marca';
import { Modelo } from '../models/modelo';
import { Veiculo } from '../models/veiculo';

declare var nosql: any;

@Component({
    selector: 'home',
    templateUrl: './app/pages/home.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {
	indexTipoVeiculo = 1;
    title = "Fipe";
    router: Router;

	loading: boolean;
	infoMessage: string[];
    errorMessage: string;

	arrayTiposVeiculo: Array<string>;
	arrayMarcas: Array<Array<Marca>>;
	arrayLista: Array<Veiculo>;

    marcasCarros: Array<Marca>;
    marcasMotos: Array<Marca>;
    marcasCaminhoes: Array<Marca>;

	indexMarcaConsulta = 0;

    constructor(_router: Router,
		private _consultaService: FipeService) {
        this.router = _router;
		this.loading = false;
		this.marcasCarros = new Array();
		this.marcasMotos = new Array();
		this.marcasCaminhoes = new Array();

		this.arrayMarcas = new Array();
		this.arrayMarcas.push(this.marcasCarros);
		this.arrayMarcas.push(this.marcasMotos);
		this.arrayMarcas.push(this.marcasCaminhoes);

		this.arrayLista = new Array();

		this.arrayTiposVeiculo = ["Carro", "Moto", "Caminhao"];
    }

	iniciarBuscas() {
		this.indexTipoVeiculo = 1;
		this.errorMessage = "";
		this.getAllMarcas(this.arrayMarcas[this.indexTipoVeiculo - 1]);
	}

	carregarVeiculos() {
		this.indexTipoVeiculo = 1;
		this.indexMarcaConsulta = 0;
		this.errorMessage = "";
		
		if (!this.obterDadosBasicosNoSQL())
			return;

		this.getAllVeiculos(this.arrayMarcas[this.indexTipoVeiculo - 1]);
	}
	
	obterDadosBasicosNoSQL(){
		if(nosql.custom().dadosBasicos.length == 0){
			this.errorMessage = "Não existem dados básicos no NoSQL!";
			return false;
		}
		
		this.arrayMarcas[0] = nosql.custom().dadosBasicos[0].carros;
		this.arrayMarcas[1] = nosql.custom().dadosBasicos[1].motos;
		this.arrayMarcas[2] = nosql.custom().dadosBasicos[2].caminhoes;
		
		if (this.arrayMarcas[0].length == 0 && this.arrayMarcas[1].length == 0 && this.arrayMarcas[2].length == 0) {
			this.errorMessage = "Não existem dados básicos carregados!";
			return false;
		}
		
		return true;
	}

    getAllMarcas(lista: Array<Marca>) {
		if (this.indexTipoVeiculo <= this.arrayMarcas.length) {
			this.loading = true;
			Observable.forkJoin(
				this.getMarcas(this.indexTipoVeiculo, lista)
			).subscribe(
				data => {
					this.getStatus(["Marcas obtidas", "Obtendo Modelos de " + this.arrayTiposVeiculo[this.indexTipoVeiculo - 1]]),
						lista = data[0],
						this.getAllModelos(lista)
				},
				err => {
					this.onError("Erro ao obter marcas")
				});
		} else {
			this.exibeResultadosDadosBasicos();
			this.persisteDadosBasicos();
		}
    }

    getAllModelos(lista: Array<Marca>) {
		let observableBatch = [];
		lista.forEach((marca, i) => {
			observableBatch.push(this.getModelos(this.indexTipoVeiculo, marca))
		})
        Observable.forkJoin(
			observableBatch
		).subscribe(
			data => {
				this.getStatus(["Modelos obtidos", "Obtendo anos dos modelos de " + this.arrayTiposVeiculo[this.indexTipoVeiculo - 1]]),
					this.getAllAnosModelos(lista)
			},
			err => {
				this.onError("Erro ao obter modelos")
			});
    }

	getAllAnosModelos(lista: Array<Marca>) {
		let observableBatch = [];
		lista.forEach(marca => {
			marca.modelos.forEach(modelo => {
				observableBatch.push(this.getAnosModelo(this.indexTipoVeiculo, marca.id, modelo))
			});
		})
        Observable.forkJoin(
			observableBatch
		).subscribe(
			data => {
				this.loading = false;
				this.getStatus(["Anos obtidos para os modelos", ""])
				console.log("getAll ", lista);
				this.arrayMarcas[this.indexTipoVeiculo - 1] = lista;
				this.indexTipoVeiculo++;
				this.getAllMarcas(this.arrayMarcas[this.indexTipoVeiculo]);
			},
			err => {
				this.onError("Erro ao obter anos dos modelos")
			});
	}

	getAllVeiculos(lista: Array<Marca>) {
		this.loading = true;
		let observableBatch = [];

		lista[this.indexMarcaConsulta].modelos.forEach(modelo => {
			modelo.anos.forEach(ano => {
				observableBatch.push(this.getVeiculos(
					this.indexTipoVeiculo,
					parseInt(lista[this.indexMarcaConsulta].id.toString()),
					modelo.id,
					ano.id))
			});
		});

        Observable.forkJoin(
			observableBatch
		).subscribe(
			veiculo => {
				this.getStatus(["Obtendo veículos", "Marca: " + lista[this.indexMarcaConsulta].nome])
				if (this.arrayMarcas.length >= this.indexTipoVeiculo && lista.length - 1 == this.indexMarcaConsulta + 1)
					this.indexTipoVeiculo++;

				if (this.arrayMarcas.length > this.indexTipoVeiculo - 1 && lista.length - 1 == this.indexMarcaConsulta + 1) {
					this.indexMarcaConsulta = 0;
					this.getAllVeiculos(this.arrayMarcas[this.indexTipoVeiculo - 1]);
				}
				else if (this.arrayMarcas.length > this.indexTipoVeiculo - 1 && lista.length - 1 > this.indexMarcaConsulta) {
					this.indexMarcaConsulta++;
					this.getAllVeiculos(this.arrayMarcas[this.indexTipoVeiculo - 1]);
				} else {
					this.loading = false;
					this.getStatus(["Veículos carregados com sucesso", ""]);
					this.exibeResultadosVeiculos();
				}
			},
			err => {
				this.onError("Erro ao obter veículos")
			});
	}

    getMarcas(tipoVeiculo: number, lista: Array<Marca>): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this._consultaService.getMarcasFipe(tipoVeiculo)
				.subscribe(
				marcas => {
					lista = marcas;
					resolve(lista)
				},
				error => {
					this.errorMessage = <any>error;
					this.onError("Erro ao obter marcas");
					reject(null)
				});
		});
    }

    getModelos(tipoVeiculo: number, marca: Marca): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this._consultaService.getModelosFipe(tipoVeiculo, marca.id)
				.subscribe(
				modelos => {
					marca.modelos = modelos;
					resolve()
				},
				error => {
					this.errorMessage = <any>error;
					this.onError("Erro ao obter modelos da marca");
					reject(null)
				});
		});
    }

	getAnosModelo(tipoVeiculo: number, codMarca: number, modelo: Modelo): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this._consultaService.getAnosModeloFipe(tipoVeiculo, codMarca, modelo.id)
				.subscribe(
				anos => {
					modelo.anos = anos;
					resolve();
				},
				error => {
					this.errorMessage = <any>error;
					this.onError("Erro ao obter anos para o modelo");
					reject(null)
				});
		});
    }

	getVeiculos(codTipoVeiculo: number, codMarca: number, codModelo: number, ano: number): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this._consultaService.getVeiculoFipe(codTipoVeiculo, codMarca, codModelo, parseInt(ano.toString().split("-")[0]), parseInt(ano.toString().split("-")[1]), this.arrayTiposVeiculo[this.indexTipoVeiculo - 1].toLowerCase())
				.subscribe(
				veiculo => {
					this.arrayLista.push(veiculo);
					resolve(veiculo);
				},
				error => {
					this.errorMessage = <any>error;
					this.onError("Erro ao obter veiculos");
					reject(null)
				});
		});
	}

	exibeResultadosVeiculos() {
		console.log("Lista de veículos:", this.arrayLista);
	}

	exibeResultadosDadosBasicos() {
		console.log("Total de marcas:", this.arrayMarcas[0].length + this.arrayMarcas[1].length + this.arrayMarcas[2].length);

		let countModelos = 0;
		let countAnos = 0;
		this.arrayMarcas[0].forEach((marca) => {
			countModelos += marca.modelos.length;
			marca.modelos.forEach(modelo => {
				countAnos += modelo.anos.length;
			});
		});
		this.arrayMarcas[1].forEach((marca) => {
			countModelos += marca.modelos.length;
			marca.modelos.forEach(modelo => {
				countAnos += modelo.anos.length;
			});
		});
		this.arrayMarcas[2].forEach((marca) => {
			countModelos += marca.modelos.length;
			marca.modelos.forEach(modelo => {
				countAnos += modelo.anos.length;
			});
		});
		console.log("Total de modelos:", countModelos);
		console.log("Total de anos:", countAnos);
	}
	
	persisteDadosBasicos(){
		nosql.custom({ dadosBasicos: [
			{ carros: this.arrayMarcas[0] },
			{ motos: this.arrayMarcas[1] },
			{ caminhoes: this.arrayMarcas[2] }
		]})
	}
	
	persisteVeiculos(){
		nosql.custom({ veiculos: this.arrayLista });
	}

	onError(msg: string) {
		this.loading = false;
		this.errorMessage = msg;
		this.infoMessage = new Array();
	}

	getStatus(msg: string[]) {
		this.infoMessage = msg;
		this.errorMessage = "";
	}
}