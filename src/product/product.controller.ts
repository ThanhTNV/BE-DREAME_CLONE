import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product';
import { UpdateProductDTO } from './dto/update-product';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@ApiTags('Product')
// @UseGuards(JwtAuthGuard)
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

  @Post()
  @UseGuards(AuthGuard('api-key'))
  async create(@Body() product: CreateProductDTO) {
    return this.productService.create(product);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('api-key'))
  async update(@Param('id') id: string, @Body() product: UpdateProductDTO) {
    return this.productService.update(id, product);
  }
}
