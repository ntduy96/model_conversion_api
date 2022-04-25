import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs-extra';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('gltf/glb')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async gltfToGlb(@Request() req, @UploadedFile() file: Express.Multer.File): Promise<any> {
    const path = await this.appService.gltfToGlb(file, req.user.id);
    return {
      success: true,
      converted_path: path,
    };
  }

  @Post('glb/gltf')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async glbToGltf(@Request() req, @UploadedFile() file: Express.Multer.File): Promise<any> {
    const path = await this.appService.glbToGltf(file, req.user.id);
    return {
      success: true,
      converted_path: path,
    };
  }

  @Get('file/:name')
  file(@Param('name') name: string): StreamableFile {
    const file = createReadStream(`${process.cwd()}/resources/${name}`);
    return new StreamableFile(file);
  }

  @Get('uploaded')
  @UseGuards(JwtAuthGuard)
  async uploaded(@Request() req): Promise<any> {
    const files = await this.appService.getUploadedFile(req.user.id);
    return { files };
  }

  @Delete('file/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUploaded(@Param('id') id: string): Promise<any> {
    const result = await this.appService.deleteUploadedFile(parseInt(id));
    return { result };
  }
}
