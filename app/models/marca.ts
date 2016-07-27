import { Modelo } from './modelo';

export class Marca {
  id: number;
  nome: string;
  modelos: Array<Modelo>;  
  
  constructor(obj: any) {
    this.id = obj.Value;
    this.nome = obj.Label;
    this.modelos = new Array();
  }
  
  static fromJSONArray(array: Array<Marca>): Marca[] {
    return array.map(obj => new Marca(obj));
  }

  static fromJSON(item: Object): Marca {
    return new Marca(item);
  }
}