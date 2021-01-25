create or replace view detail_info as
    select * from detail_type join detail_remain using (detail_type_id);
    
create or replace function get_all_detail_info() returns setof detail_info as $$
    select * from detail_info;
$$ language sql;
-- functions for login and register new user
----------------------------------------------------------------------------------------------------
-- NOTE: these 2 functions below need to pass the already-hashed password.
-- If you (the teacher) added the module 'pgcrypto', I can then pass raw password in and 
-- the database can hash the password itself.
-- It will be alot cooler if you do!

create or replace function register_user_profile(
    name varchar(50), 
    date_of_birth date,
    email text,
    telephone_number text,
    password_hash text)
returns int as $$
    insert into user_profile (
        name, date_of_birth, email, telephone_number, password_hash
    ) values (name, date_of_birth, email, telephone_number, password_hash)
    returning user_profile_id;
$$ language sql;

create or replace function authenticate_user_profile(email text, password_hash text) returns setof user_profile as $$
    select * from user_profile where email = $1 and password_hash = $2;
$$ language sql;

create or replace function get_user_info(user_id int) returns setof user_profile as $$
    select * from user_profile where user_profile_id = user_id;
$$ language sql;

-- functions for managing workers
----------------------------------------------------------------------------------------------------
create or replace function grant_as_worker(user_profile_id int, description text) returns int as $$
    update user_profile set privilege = 'worker' where user_profile_id = $1;
    insert into worker (worker_id, description) values ($1, $2)
    on conflict (worker_id) do update set description = $2
    returning worker_id;
$$ language sql;

create or replace function degrant_worker(worker_id int) returns void as $$
    update user_profile set privilege = 'worker' where user_profile_id = $1;
    -- must not delete from the worker table.
$$ language sql;

-- functions for manipulating and editing the product prototype
----------------------------------------------------------------------------------------------------
create or replace function add_prototype(user_profile_id int) returns int as $$
    insert into product_prototype (owner_id, description, modifier) values (user_profile_id, '', 'private')
    returning product_prototype_id;
$$ language sql;

create or replace function update_prototype_attributes(product_prototype_id int, description text, modifier modifier_type) returns int as $$
    update product_prototype set description = $2, modifier = $3 where product_prototype_id = $1 returning product_prototype_id;
$$ language sql;

create or replace function add_prototype_resource(product_prototype_id int, resource_type prototype_resource_type, location text) returns int as $$
    insert into product_prototype_resource (product_prototype_id, resource_type, location)
    values ($1, $2, $3) returning product_prototype_resource_id;
$$ language sql;

create or replace function remove_prototype_resource(product_prototype_id int, product_prototype_resource_id int) returns void as $$
    delete from product_prototype_resource where product_prototype_id = $1 and product_prototype_resource_id = $2;
$$ language sql;

create or replace function get_owning_product_prototypes(user_profile_id int) 
returns setof product_prototype as $$ 
    select * from product_prototype where owner_id = user_profile_id;
$$ language sql;

create or replace function get_prototype_resources(product_prototype_id int)
returns setof product_prototype_resource as $$ 
    select * from product_prototype_resource where product_prototype_id = $1; $$ 
language sql;

-- some "real business" functions 
create or replace function form_product_order(
    client_user_profile_id int,
    ordered_product_prototype_id int,
    wanted_delivery_date date, 
    delivery_address text
) returns int as $$
    insert into product_order (user_profile_id, product_prototype_id, planned_delivery_date, delivery_address)
    values (client_user_profile_id, ordered_product_prototype_id, wanted_delivery_date, form_product_order.delivery_address)
    returning product_order_id;
$$ language sql;

create or replace view product_order_with_user_info as
    select * from product_order left join user_profile using (user_profile_id);
    
create or replace view product_order_with_worker_info as
    select * from product_order right join product_making using (product_order_id);
    
create or replace view product_order_progress as
    select product_order_id, count(worker_id) as assigned_workers_count, coalesce(sum(is_finished::int), 0) as finished_workers_count
    from product_order_with_worker_info right join product_order using (product_order_id)
    group by product_order_id;
    
create or replace view detailed_product_order as
    select *
    from product_order_with_user_info left join product_order_progress using (product_order_id);
        
create or replace function get_owning_product_orders(client_user_profile_id int) returns setof product_order_with_user_info as $$
    select * from product_order_with_user_info where user_profile_id = client_user_profile_id order by planned_delivery_date;
$$ language sql;

create or replace function get_assigned_product_orders(worker_id int, is_finished boolean default false) returns setof product_order_with_worker_info as $$
    select * from product_order_with_worker_info where worker_id = $1 and is_finished = $2;
$$ language sql;

create or replace function get_all_product_orders() returns setof detailed_product_order as $$
    select * from detailed_product_order order by planned_delivery_date;
$$ language sql;

create or replace view worker_with_profile as
    select * from worker left join user_profile on (worker_id = user_profile_id);

create or replace function get_free_workers_for(product_order_id int) returns setof worker_with_profile as $$
    select * from worker_with_profile
    where worker_id not in (
        select worker_id from product_making
        where product_order_id = $1
    );
$$ language sql;

create or replace view product_making_with_worker_and_profile as
    select * from product_making left join worker_with_profile using (worker_id);
    
create or replace function get_workers_for(product_order_id int) returns setof product_making_with_worker_and_profile as $$
    select * from product_making_with_worker_and_profile where product_order_id = $1;
$$ language sql;

create or replace function assign_order(product_order_id int, worker_id int, deadline date) returns void as $$
    insert into product_making (product_order_id, worker_id, deadline, is_finished)
    values ($1, $2, $3, false);
$$ language sql;

create or replace function update_order_status(product_order_id int, order_status order_status_type) returns void as $$
begin
    update product_order set order_status = $2 where product_order.product_order_id = $1;
    if not found then
        raise exception 'Order not found';
    end if;
end $$ language plpgsql;

create or replace function archive_order(worker_id int, product_order_id int) returns void as $$
begin
    update product_making set is_finished = true where product_making.worker_id = $1 and product_making.product_order_id = $2 and is_finished = false;
    if not found then
        raise exception 'Can only archive active order';
    end if;
end $$ language plpgsql;

create or replace function spend_details(detail_type_id int, product_order_id int, quantity int) returns void as $$
    insert into used_detail (detail_type_id, product_order_id, quantity) 
    values ($1, $2, $3)
    on conflict (detail_type_id, product_order_id) do update set quantity = used_detail.quantity + $3;
$$ language sql;

create or replace function import_details(detail_type_id int, detail_source_id int, quantity int, price_per_unit int, import_date date = current_date) returns int as $$
    insert into storage(detail_type_id, detail_source_id, quantity, price_per_unit, import_date)
    values ($1, $2, $3, $4, $5)
    returning storage_id;
$$ language sql;

create or replace function make_review(client_user_profile_id int, product_prototype_id int, comment text, rating int) returns void as $$
    insert into review(user_profile_id, product_prototype_id, "comment", rating)
    values ($1, $2, $3, $4)
    on conflict(user_profile_id, product_prototype_id)
    do update set "comment" = make_review.comment, rating = make_review.rating;
$$ language sql;
