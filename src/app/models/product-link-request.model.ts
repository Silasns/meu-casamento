export interface ProductLinkRequest {
    order_nsu: string,
    customer: CustomerModel,
    items: item[]
}

interface CustomerModel {
    name: string,
    email: string,
    phone_number: string
}

interface item {
    quantity: number,
    price: number,
    description: string
}