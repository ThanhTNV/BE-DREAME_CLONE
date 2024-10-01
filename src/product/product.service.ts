import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/create-product';
import { UpdateProductDTO } from './dto/update-product';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(product: CreateProductDTO): Promise<Product> {
    const newProduct = {
      id: new Date().toISOString(),
      ...product,
    };
    const createdProduct = new this.productModel(newProduct);
    return await createdProduct.save();
  }

  async createMany(products: CreateProductDTO[]): Promise<string> {
    const newProducts = products.map((product) => ({
      id: new Date().toISOString(),
      ...product,
    }));
    await this.productModel.insertMany(newProducts);
    return 'Products created successfully';
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ id: id });
    return product;
  }

  async findMany(ids: string[]): Promise<Product[]> {
    return await this.productModel.find({ id: { $in: ids } }).exec();
  }

  async update(id: string, product: UpdateProductDTO): Promise<Product> {
    const findProduct = await this.productModel.findOne({ id: id });
    return await this.productModel.findByIdAndUpdate(findProduct._id, product, {
      new: true,
    });
  }
}
