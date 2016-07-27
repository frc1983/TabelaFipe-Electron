import { Ano } from './ano';

export class Modelo {
  id: number;
  nome: string;
  anos: Array<Ano>;
  
  constructor(obj: any) {
    this.id = obj.Value;
    this.nome = obj.Label;
    this.anos = new Array();
  }
  
  static fromJSONArray(array: Array<Modelo>): Modelo[] {
    return array.map(obj => new Modelo(obj));
  }

  static fromJSON(item: Object): Modelo {
    return new Modelo(item);
  }
}