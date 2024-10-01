import { Injectable, StreamableFile } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import * as fs from 'fs';
import * as path from 'path';
import { read, utils, write } from 'xlsx';

@Injectable()
export class FileService {
  constructor(private readonly productService: ProductService) {}
  async uploadFile(file: Express.Multer.File) {
    const wb = read(file.buffer);
    /* generate CSV of first worksheet */
    const data = utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);

    //Convert data string to JSON
    const jsonData = data.split('\n').map((row) => row.split(','));
    const headers = jsonData[0].map((header) => header.toLowerCase());
    //Validate headers to match the product create DTO
    const VALID_HEADER = [
      'name',
      'category',
      'description',
      'price',
      'amount',
      'specification',
    ];
    const isValidHeader = VALID_HEADER.every((header) =>{
      return headers.includes(header);
    });
    if (!isValidHeader) {
      return 'Invalid headers';
    }
    const productData = jsonData.slice(1);
    const products = productData.map((product) => {
      return {
        name: product[0],
        category: product[1],
        price: Number(product[3]),
        amount: Number(product[4]),
        specification: product[5],
      };
    });

    return await this.productService.createMany(products);
  }

  async downloadFile() {
    const product = await this.productService.findAll();
    const data = product.map((product) => [
      product.name,
      product.category,
      product.description,
      product.price,
      product.amount,
      product.specification,
    ]);
    const headers = ['Name', 'Category', 'Description', 'Price', 'Amount', 'Specification'];
    /* create workbook & set props*/
    var ws = utils.aoa_to_sheet([headers, ...data]);
    var wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    /* generate buffer */
    var buf = write(wb, { type: 'buffer', bookType: 'xlsx' });
    /* Return a streamable file */
    return new StreamableFile(buf);
  }

  // readXlsxFileToJSON(file: Express.Multer.File) {
  //   const workbook = read(file.buffer, { type: 'buffer' });
  //   const sheetName = workbook.SheetNames[0];
  //   const sheet = workbook.Sheets[sheetName];
  //   const data = utils.sheet_to_json(sheet);
  //   return data;
  // }

  // saveFileAt(file: Express.Multer.File) {
  //   const uploadsDir = path.join(__dirname, '..', 'uploads');

  //   // Create the uploads directory if it doesn't exist
  //   if (!fs.existsSync(uploadsDir)) {
  //     fs.mkdirSync(uploadsDir);
  //   }

  //   // Define the file path
  //   const filePath = path.join(uploadsDir, file.originalname);

  //   // Write the file to the uploads directory
  //   fs.writeFileSync(filePath, file.buffer);
  //   return filePath;
  // }
}
