import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";

import { RolesService } from "./roles.service";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createUserDto: CreateRoleDto) {
    return this.rolesService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rolesService.remove(+id);
  }
}
