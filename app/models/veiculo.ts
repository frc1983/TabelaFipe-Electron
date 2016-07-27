export class Veiculo {
  valor: number;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;

  constructor(obj: any) {
    this.valor = parseFloat(obj.Valor.replace("R$ ", ""));
    this.marca = obj.Marca;
    this.modelo = obj.Modelo;
    this.anoModelo = obj.AnoModelo;
    this.combustivel = obj.Combustivel;
    this.codigoFipe = obj.CodigoFipe;
    this.mesReferencia = obj.MesReferencia;
    this.tipoVeiculo = obj.TipoVeiculo;
  }

  static fromJSONArray(array: Array<Veiculo>): Veiculo[] {
    return array.map(obj => new Veiculo(obj));
  }

  static fromJSON(item: Object): Veiculo {
    return new Veiculo(item);
  }
}