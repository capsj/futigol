# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table invite (
  id                            varchar(40) not null,
  sender_id                     varchar(40),
  receiver_id                   varchar(40),
  team_id                       varchar(40),
  answered                      tinyint(1) default 0,
  request_type                  varchar(255),
  constraint pk_invite primary key (id)
);

create table match_request (
  id                            varchar(40) not null,
  date                          datetime(6),
  time                          datetime(6),
  location                      varchar(255),
  constraint pk_match_request primary key (id)
);

create table player (
  id                            varchar(40) not null,
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
  id                            varchar(40) not null,
  name                          varchar(255),
  location                      varchar(255),
  size                          integer,
  captain_id                    varchar(40),
  constraint uq_team_name unique (name),
  constraint pk_team primary key (id)
);

create table team_player (
  id                            varchar(40) not null,
  player_id                     varchar(40),
  team_id                       varchar(40),
  is_captain                    tinyint(1) default 0,
  constraint pk_team_player primary key (id)
);

alter table invite add constraint fk_invite_sender_id foreign key (sender_id) references player (id) on delete restrict on update restrict;
create index ix_invite_sender_id on invite (sender_id);

alter table invite add constraint fk_invite_receiver_id foreign key (receiver_id) references player (id) on delete restrict on update restrict;
create index ix_invite_receiver_id on invite (receiver_id);

alter table invite add constraint fk_invite_team_id foreign key (team_id) references team (id) on delete restrict on update restrict;
create index ix_invite_team_id on invite (team_id);

alter table team add constraint fk_team_captain_id foreign key (captain_id) references player (id) on delete restrict on update restrict;
create index ix_team_captain_id on team (captain_id);

alter table team_player add constraint fk_team_player_player_id foreign key (player_id) references player (id) on delete restrict on update restrict;
create index ix_team_player_player_id on team_player (player_id);

alter table team_player add constraint fk_team_player_team_id foreign key (team_id) references team (id) on delete restrict on update restrict;
create index ix_team_player_team_id on team_player (team_id);


# --- !Downs

alter table invite drop foreign key fk_invite_sender_id;
drop index ix_invite_sender_id on invite;

alter table invite drop foreign key fk_invite_receiver_id;
drop index ix_invite_receiver_id on invite;

alter table invite drop foreign key fk_invite_team_id;
drop index ix_invite_team_id on invite;

alter table team drop foreign key fk_team_captain_id;
drop index ix_team_captain_id on team;

alter table team_player drop foreign key fk_team_player_player_id;
drop index ix_team_player_player_id on team_player;

alter table team_player drop foreign key fk_team_player_team_id;
drop index ix_team_player_team_id on team_player;

drop table if exists invite;

drop table if exists match_request;

drop table if exists player;

drop table if exists team;

drop table if exists team_player;

