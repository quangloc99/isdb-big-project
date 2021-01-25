drop table if exists
    detail_type,
    detail_source,
    storage,
    user_profile,
    product_prototype,
    product_prototype_resource,
    worker,
    product_making,
    used_detail,
    product_order,
    review
cascade;

drop type if exists 
    unit_type, 
    modifier_type, 
    prototype_resource_type,
    order_status_type,
    user_privilege_type
cascade;

create type unit_type as enum ('piece', 'kilogram', 'litter');
create type modifier_type as enum ('public', 'private');
create type prototype_resource_type as enum ('3D_file', '2D_file');
create type order_status_type as enum ('pending', 'making', 'finished', 'delivered');
create type user_privilege_type as enum ('admin', 'worker', 'client');

create table detail_type (
    detail_type_id serial primary key,
    name varchar(50) not null unique,
    unit unit_type not null
);

create table detail_source (
    detail_source_id serial primary key,
    name varchar(50) not null unique
);

create table storage (
    storage_id serial primary key,
    detail_type_id int references detail_type not null,
    detail_source_id int references detail_source not null,
    import_date date not null default current_date,
    price_per_unit int not null,
    quantity int not null
);

create table user_profile (
    user_profile_id serial primary key,
    name varchar(50) not null,
    date_of_birth date not null,
    -- the mail regex is stolen from 
    -- https://stackoverflow.com/questions/5689718/how-can-i-create-a-constraint-to-check-if-an-email-is-valid-in-postgres 
    email text not null check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    -- the phone number regex is written by me and I know it is not strong :))
    telephone_number text not null check (telephone_number ~* '^\+?[0-9]+$'),
    password_hash text not null,
    privilege user_privilege_type not null default 'client'
);

create table product_prototype (
    product_prototype_id serial primary key,
    owner_id int references user_profile not null,
    description text not null,
    modifier modifier_type not null
);

create table product_prototype_resource (
    product_prototype_resource_id serial primary key,
    product_prototype_id int references product_prototype not null,
    resource_type prototype_resource_type not null,
    location text not null
);

create table product_order (
    product_order_id serial primary key,
    user_profile_id int references user_profile not null,
    product_prototype_id int references product_prototype not null,
    price int NULL,
    planned_delivery_date date not NULL,
    delivery_address text not null,
    additional_description text,
    order_status order_status_type not null default 'pending'
);

create table used_detail (
    product_order_id int references product_order,
    detail_type_id  int references detail_type,
    quantity int not null,
    constraint "pk_used_detail" primary key (product_order_id, detail_type_id)
);

create view detail_remain as 
    select detail_type_id, (imported - coalesce(consummed, 0)) as quantity_remain
    from (select detail_type_id, sum(quantity) as imported from storage group by detail_type_id) as A
    left join (select detail_type_id, sum(quantity) as consummed from used_detail group by detail_type_id) as B
    using (detail_type_id);
        
create table worker (
    worker_id int references user_profile(user_profile_id) primary key,
    description text not null
);

create table product_making (
    product_order_id int references product_order,
    worker_id int references worker,
    deadline date not null,
    is_finished boolean not null default false,
    constraint "pk_product_making" primary key (product_order_id, worker_id)
);

create table review (
    user_profile_id int references user_profile,
    product_prototype_id int references product_prototype,
    rating int check(rating between 1 and 5),
    "comment" text default '',
    constraint "pk_review" primary key (user_profile_id, product_prototype_id)
);
