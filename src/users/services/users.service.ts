import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly _logger: LoggerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this._logger.setContext(UsersService.name);
  }

  private async validatExistingUserByEmail(email: string): Promise<void> {
    this._logger.log('Validando si el usuario ya existe');
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this._logger.error('Usuario existente con el email:', email);
      throw new HttpException('Ya existe un usuario con este email', HttpStatus.NOT_FOUND);
    }
  }

  async createUser({ email, password }: { email: string; password: string }): Promise<User> {
    this._logger.log('Creando usuario');
    await this.validatExistingUserByEmail(email);

    const user = this.userRepository.create({ email, password });
    this._logger.log('Usuario creado exitosamente');
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    this._logger.log('Buscando usuario por email: ', email);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this._logger.error('Usuario no encontrado con el email:', email);
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }

    this._logger.log('Usuario encontrado:', user.email);
    return user;
  }
}