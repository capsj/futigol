# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table match_request (
  id                            bigint auto_increment not null,
  date                          datetime(6),
  time                          datetime(6),
  location                      varchar(255),
  constraint pk_match_request primary key (id)
);

create table player (
  id                            bigint auto_increment not null,
  password                      varchar(255),
  name                          varchar(255),
  last_name                     varchar(255),
  location                      varchar(255),
  email                         varchar(255),
  phone                         varchar(255),
  position                      varchar(255),
  constraint uq_player_email unique (email),
  constraint pk_player primary key (id)
);

create table team (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  location                      varchar(255),
  size                          integer,
  captain_id                    bigint,
  constraint uq_team_name unique (name),
  constraint pk_team primary key (id)
);

create table team_player (
  id                            bigint auto_increment not null,
  player_id                     bigint,
  team_id                       bigint,
  is_captain                    tinyint(1) default 0,
  constraint pk_team_player primary key (id)
);

create table team_request (
  id                            bigint auto_increment not null,
  date                          datetime(6),
  constraint pk_team_request primary key (id)
);

alter table team add constraint fk_team_captain_id foreign key (captain_id) references player (id) on delete restrict on update restrict;
create index ix_team_captain_id on team (captain_id);

alter table team_player add constraint fk_team_player_player_id foreign key (player_id) references player (id) on delete restrict on update restrict;
create index ix_team_player_player_id on team_player (player_id);

alter table team_player add constraint fk_team_player_team_id foreign key (team_id) references team (id) on delete restrict on update restrict;
create index ix_team_player_team_id on team_player (team_id);


# --- !Downs

alter table team drop foreign key fk_team_captain_id;
drop index ix_team_captain_id on team;

alter table team_player drop foreign key fk_team_player_player_id;
drop index ix_team_player_player_id on team_player;

alter table team_player drop foreign key fk_team_player_team_id;
drop index ix_team_player_team_id on team_player;

drop table if exists match_request;

drop table if exists player;

drop table if exists team;

drop table if exists team_player;

drop table if exists team_request;

