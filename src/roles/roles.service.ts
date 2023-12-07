import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";

import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/role.entity";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = this.roleRepository.create(createRoleDto);

      if (!newRole) {
        throw new HttpException(
          "Could not create Role in SRP",
          HttpStatus.BAD_REQUEST
        );
      }

      const role = await this.roleRepository.save(newRole);

      if (!role) {
        throw new HttpException(
          "Could not save Role in SRP",
          HttpStatus.BAD_REQUEST
        );
      }

      if (role.id) {
        return await this.findOne(role.id);
      }
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.roleRepository.find({
      where: { roleName: Not("member") },
      select: { id: true, roleName: true},
    });
  }

  findAllWithMember() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    try {
      return this.roleRepository.findOne({
        where: { id },
        select: {
          id: true,
          roleName: true,
          description: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByRole(roleName: string) {
    try {
      const newRole = await this.roleRepository.findOneBy({ roleName });

      if (!newRole) {
        throw new HttpException(
          "Role not found in SRP",
          HttpStatus.BAD_REQUEST
        );
      }

      return newRole;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findOne(id);
      const updatedRole = await this.roleRepository.update(id, updateRoleDto);

      if (!updatedRole.affected) {
        return { message: "Could not update the Role" };
      }

      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      const deletedRole = await this.roleRepository.delete(id);

      if (!deletedRole.affected) {
        throw new HttpException(
          "Role not deleted in SRP",
          HttpStatus.NOT_FOUND
        );
      }

      return { message: "Role is deleted in SRP" };
    } catch (error) {
      throw error;
    }
  }
}
