export interface ProcuctResposeModel {
    products: Product[]
}

export interface Product {
    id: string,
    titulo: string,
    descricao: string,
    valor: number,
    statusRevervado: boolean,
    disponivel: boolean,
    linksLoja: LinksLoja[],
    imageUrl: string,
    imageAlt: string
}

interface LinksLoja {
    nomeLoja: string,
    linkProduto: string
}