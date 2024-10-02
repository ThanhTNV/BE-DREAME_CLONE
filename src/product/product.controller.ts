import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product';
import { UpdateProductDTO } from './dto/update-product';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post('create')
  async create(@Body() product: CreateProductDTO) {
    return this.productService.create(product);
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() product: UpdateProductDTO) {
    return this.productService.update(id, product);
  }
}
