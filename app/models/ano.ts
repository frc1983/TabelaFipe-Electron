export class Ano {
  id: number;
  //nome: string;
  
  constructor(obj: any) {
    this.id = obj.Value;
    //this.nome = obj.Label;
  }
  
  static fromJSONArray(array: Array<Ano>): Ano[] {
    return array.map(obj => new Ano(obj));
  }

  static fromJSON(item: Object): Ano {
    return new Ano(item);
  }
}