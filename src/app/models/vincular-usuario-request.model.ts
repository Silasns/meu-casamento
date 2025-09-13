export interface VincularUsuarioRequestModel {
    nome: string,
    telefone: string,
    email: string,
    mensagem?: string,
    produtoId: string,
    meioReserva: string
}