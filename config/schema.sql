create database test_db;

use test_db;

drop table users;

create table users 
(
	id int(10) not null auto_increment,
    username varchar(25) unique,
    email varchar(100) unique,
    password binary (60),
    primary key(id)
);

drop table bucketlist;

create table bucketlist
(
	id int(10) not null auto_increment,
    user_id int(10),
    title varchar(255),
    info varchar(255),
    completed boolean,
    primary key (id),
    Foreign Key(`user_id`) references users(`id`)
);

select * from bucketlist;

drop table sessions;

select * from users;



select * from sessions;

commit;