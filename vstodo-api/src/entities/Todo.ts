import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string

    @Column('boolean', {unique: false})
    completed: string

    @Column()
    creatorId: number

    @ManyToOne(() => User, (u) => u.todos)
    @JoinColumn({name: 'creatorId'})
    creator: Promise<User>
}