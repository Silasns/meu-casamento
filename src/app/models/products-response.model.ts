export interface ProcuctResposeModel {
    products: Product[]
}

export interface Product {
    titulo: string,
    descricao: string,
    valor: string,
    statusRevervado: boolean,
    linksLoja: LinksLoja[],
    imageUrl: string,
    imageAlt: string
}

interface LinksLoja {
    nomeLoja: string,
    linkProduto: string
}