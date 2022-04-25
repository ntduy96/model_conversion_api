import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
// import { GoogleStrategy } from '../strategies/google.strategy.ts_bk';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    MulterModule.register({
      // dest: process.cwd() + '/resources/upload',
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, `${process.cwd()}/resources`);
        },
        filename: (req, file, cb) => {
          const fileName = randomBytes(16).toString('hex');
          const fileExtension = file.originalname.split('.')[1]; // get file extension from original file name
          cb(null, fileName + '.' + fileExtension);
        },
      }),
    }),
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtStrategy, PrismaClient],
})
export class AppModule {}
