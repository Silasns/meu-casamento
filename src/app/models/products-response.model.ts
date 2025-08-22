export interface ProcuctResposeModel {
    products: Product[]
}

export interface Product {
    id: number,
    titulo: string,
    descricao: string,
    valor: number,
    statusRevervado: boolean,
    linksLoja: LinksLoja[],
    imageUrl: string,
    imageAlt: string
}

interface LinksLoja {
    nomeLoja: string,
    linkProduto: string
}