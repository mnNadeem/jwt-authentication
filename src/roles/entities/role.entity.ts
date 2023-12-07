import { User } from "src/users/entities/user.entity";
import {
  Entity,
  Column,
  DeleteDateColumn,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, name: "role_name", unique: true })
  roleName: string;

  @Column({ nullable: false })
  description?: string;

  @DeleteDateColumn({ name: "created_at" })
  createdAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
