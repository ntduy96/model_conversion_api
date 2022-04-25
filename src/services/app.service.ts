import { Injectable } from '@nestjs/common';
import { gltfToGlb, glbToGltf } from 'gltf-pipeline';
import {
  readJsonSync,
  readFileSync,
  writeFileSync,
  writeJsonSync,
} from 'fs-extra';
import { file, PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaClient) {}
  async gltfToGlb(file: Express.Multer.File, userId: number): Promise<string> {
    const gltf = readJsonSync(file.path);
    const results = await gltfToGlb(gltf);
    const originalname = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
    const filename = file.filename.substr(0, file.filename.lastIndexOf('.'));
    const path = `${process.cwd()}/resources/${filename}.glb`;
    writeFileSync(path, results.glb);

    await this.prisma.file.create({
      data: {
        name: originalname,
        upload_uri: `${filename}.gltf`,
        convert_uri: `${filename}.glb`,
        user_id: userId,
      },
    });
    return `/file/${filename}.glb`;
  }

  async glbToGltf(file: Express.Multer.File, userId: number): Promise<string> {
    const gltf = readFileSync(file.path);
    const results = await glbToGltf(gltf);
    const originalname = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
    const filename = file.filename.substr(0, file.filename.lastIndexOf('.'));
    const path = `${process.cwd()}/resources/${filename}.gltf`;
    writeJsonSync(path, results.gltf);

    await this.prisma.file.create({
      data: {
        name: originalname,
        upload_uri: `${filename}.glb`,
        convert_uri: `${filename}.gltf`,
        user_id: userId,
      },
    });
    return `/file/${filename}.gltf`;
  }

  async getUploadedFile(userId: number): Promise<file[]> {
    return await this.prisma.file.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async deleteUploadedFile(id: number): Promise<boolean> {
    try {
      await this.prisma.file.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
