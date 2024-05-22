//forgotpassword
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';
import { Client } from '@admin/client/client.entity';

@Entity()
export class ForgotPassword {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Subscriber)
    @JoinColumn()
    subscriber: Subscriber;

    @OneToOne(type => Client)
    @JoinColumn()
    client: Client;

    @Column('int')
    token: number;

    @Column()
    timestamp: Date;
}