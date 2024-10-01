export interface CreateProductDTO {
    readonly name: string;
    readonly category: string;
    readonly description?: string;
    readonly price: number;
    readonly amount: number;
    readonly specification?: string;
}