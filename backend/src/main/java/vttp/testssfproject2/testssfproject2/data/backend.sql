drop database if exists artistick;

create database artistick;
use artistick;

SELECT "USER TABLE";
create table users (
    user_id char(28), -- firebase user id is 28 char long
    username varchar(64),
    email varchar(64),
    constraint pk_user_id primary key(user_id)
);

SELECT "GAMES TABLE";
create table games (
    game_id char(8),
    prompt varchar(255),
    aiimageurl varchar(255), -- test
    constraint pk_game_id primary key(game_id)
);

SELECT "SUBMISSIONS TABLE";
create table submissions (
    sub_id char(8),
    title varchar(128),
    description varchar(255),
    aicomments text,
    imageurl varchar(128),
    user_id char(28),
    game_id char(8),
    aiimageurl varchar(255) default '',
    isactive boolean default true, -- test
    
    constraint pk_sub_id primary key(sub_id),
    constraint fk_user_id foreign key(user_id) references users(user_id),
    constraint fk_game_id foreign key(game_id) references games(game_id)


);

-- grant all privileges on artistick.* to 'fred'@'%';