create database sistema_equipamentos character set utf8mb4 collate utf8mb4_unicode_ci;
use sistema_equipamentos;

create table equipamentos(
    id int auto_increment primary key,
    nome_equipamento varchar(50) not null,
    descricao varchar(200) not null,
    tipo_mime varchar(50) not null,
    imagem longblob not null
); 

create table reservas(
    id int auto_increment primary key,
    id_equipamento int,
    nome_solicitante varchar(100),
    datahora_reserva datetime,
    datahora_devolucao datetime,
    observacao varchar(30),
    foreign key (id_equipamento) references equipamentos(id)
);

create table devolucoes(
    id int auto_increment primary key,
    id_reserva int,
    nome_devolvedor varchar(100),
    data_devolucao datetime,
    condicao varchar(35),
    foreign key (id_reserva) references reservas(id)
);

create table relatorios(
    id int auto_increment primary key,
    data_relatorio date,
    tipo_mime varchar(50) not null,
    relatorio longblob not null
);