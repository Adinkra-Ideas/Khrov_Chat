import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity('users')
export class Users {
	@PrimaryGeneratedColumn()
	id?: number;

	@CreateDateColumn( {nullable: true} )
	createdAt?: Date;

	@CreateDateColumn( {nullable: true} )
	updatedAt?: Date;

	@Column( {type: 'varchar', length: 32, nullable: false} )
	username: string;

	@Column( {type: 'text', nullable: true, default: null} )
	signature: string;

	@Column( {length: 32} )
	password: string;

}
