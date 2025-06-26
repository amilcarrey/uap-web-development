create database tpFinalProgra2


-- tabla de usuarios
create table dbo.users (
    id varchar(36) primary key,
    username varchar(50) not null unique,
    password_hash varchar(255) not null
);
go

-- tabla de tableros
create table dbo.boards (
    id varchar(36) primary key,
    name varchar(100) not null,
    owner_id varchar(36) not null,
    foreign key (owner_id) references dbo.users(id) on delete cascade
);
go

-- tabla de recordatorios (reminders)
create table dbo.reminders (
    id varchar(36) primary key,
    name varchar(100) not null,
    completed bit default 0,
    board_id varchar(36) not null,
    created_by varchar(36) null,
    updated_by varchar(36) null,
    created_at datetime2 default sysutcdatetime(),
    updated_at datetime2 default sysutcdatetime(),
    foreign key (board_id) references dbo.boards(id) on delete cascade,
    foreign key (created_by) references dbo.users(id) ,
    foreign key (updated_by) references dbo.users(id) 
);
go

-- tabla de permisos
create table dbo.permissions (
    id varchar(36) primary key,
    user_id varchar(36) not null,
    board_id varchar(36) not null,
    access_level varchar(20) not null check (access_level in ('owner','full_access','viewer')),
    created_at datetime2 default sysutcdatetime(),
    updated_at datetime2 default sysutcdatetime(),
    constraint uq_user_board unique (user_id, board_id),
    foreign key (user_id) references dbo.users(id) ,
    foreign key (board_id) references dbo.boards(id) on delete cascade
);
go

-- tabla de configuraciones de usuario
create table dbo.usersettings (
    user_id varchar(36) primary key,
    refresh_interval int default 30,
    show_uppercase bit default 0,
    created_at datetime2 default sysutcdatetime(),
    updated_at datetime2 default sysutcdatetime(),
    foreign key (user_id) references dbo.users(id) 
);
go
----- DATOS DE PRUEBAAAAAAAAA
-- usuarios
insert into dbo.users (id, username, password_hash)
values 
  ('u1', 'floppy', '$argon2id$v=19$m=65536,t=3,p=4$QsZRbhCyCfa8p2RFd4fmwQ$Z5oc7TyJvHUI/qR3gHgU3G5wHCHAh/mPG5ZckhCYOK4'),
  ('u2', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$QsZRbhCyCfa8p2RFd4fmwQ$Z5oc7TyJvHUI/qR3gHgU3G5wHCHAh/mPG5ZckhCYOK4'); -- mismo hash para simplificar
go

-- tableros
insert into dbo.boards (id, name, owner_id)
values 
  ('b1', 'personal', 'u1'),
  ('b2', 'trabajo', 'u2');
go

-- recordatorios
insert into dbo.reminders (id, name, completed, board_id, created_by, updated_by)
values 
  ('t1', 'estudiar sqlserver', 0, 'b1', 'u1', 'u1'),
  ('t2', 'preparar entrega final', 1, 'b2', 'u2', 'u2');
go

-- permisos
insert into dbo.permissions (id, user_id, board_id, access_level)
values 
  ('p1', 'u1', 'b1', 'full_access'),
  ('p2', 'u2', 'b2', 'full_access'),
  ('p3', 'u1', 'b2', 'viewer');
go

-- configuraciones de usuario
insert into dbo.usersettings (user_id, refresh_interval, show_uppercase)
values 
  ('u1', 15, 1),
  ('u2', 30, 0);
go