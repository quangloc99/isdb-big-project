DO $$  
declare
    worker1id int; worker2id int; worker3id int; worker4id int;
    adminid int; user1id int; user2id int; user3id int;
    cur_proto int;
    order1id int; order2id int;
begin
    -- for the purpose of the labs, the details might not as detailed
    -- as they should be. For example, there might be a lot of types of nails,
    -- but here I just use nail instead.
    insert into detail_type (name, unit) values
        ('nail', 'piece'),
        ('wood-log', 'piece'),
        ('wood-plank', 'piece'),
        ('wood-stain', 'litter');

    insert into detail_source (name) values 
        ('random-nail-company'),
        ('random-wood-company'),
        ('random-wood-stain-company');

    -- import each details once, and each of them with quantity 10
    perform import_details(
        (select detail_type_id from detail_type where name = 'nail'),
        (select detail_source_id from detail_source where name = 'random-nail-company'),
        100, 1
    );
    perform import_details(
        (select detail_type_id from detail_type where name = 'wood-log'),
        (select detail_source_id from detail_source where name = 'random-wood-company'),
        100, 100
    );
    perform import_details(
        (select detail_type_id from detail_type where name = 'wood-plank'),
        (select detail_source_id from detail_source where name = 'random-wood-company'),
        100, 300
    );
    perform import_details(
        (select detail_type_id from detail_type where name = 'wood-stain'),
        (select detail_source_id from detail_source where name = 'random-wood-stain-company'),
        100, 300
    );

    -- register some user
    adminid := register_user_profile('admin', '2000-01-01', 'admin@here.com', '121212121212', '123456');
    update user_profile set privilege = 'admin' where user_profile_id = adminid;
    
    user1id := register_user_profile('user1', '1991-02-24', 'user1@nowhere.com', '123456789', '123456');
    user2id := register_user_profile('user2', '1998-02-08', 'user2@anywhere.ru', '987654321', '123456');
    user3id := register_user_profile('user3', '1999-02-16', 'user3@somewhere.net', '543216789', '123456');
    worker1id := register_user_profile('worker1', '1994-09-03', 'worker1@nocompany.com', '123123123', '123456');
    worker2id := register_user_profile('worker2', '1998-12-12', 'worker2@nocompany.com', '456456456', '123456');
    worker3id := register_user_profile('worker3', '2000-05-10', 'worker3@nocompany.com', '789789879', '123456');
    worker4id := register_user_profile('worker4', '2000-05-11', 'worker4@nocompany.com', '6969696969', '123456');

    -- grant jobs to the worker
    perform grant_as_worker(worker1id, 'has 5-year experience');
    perform grant_as_worker(worker2id, 'fresher');
    perform grant_as_worker(worker3id, 'this guy is closed to being fired');
    perform grant_as_worker(worker4id, 'and this guy just came in to replace worker3 :))');

    -- company's first prototype
    -- cur_proto := add_prototype(adminid);
    -- perform update_prototype_attributes(cur_proto, 'our first product', 'public');
    -- perform add_prototype_resource(cur_proto, '2D_file', '/dev/null');

    -- company's second prototype
    -- cur_proto := add_prototype(adminid);
    -- perform update_prototype_attributes(cur_proto, 'our second product', 'public');
    -- perform add_prototype_resource(cur_proto, '3D_file', '/dev/null');

    -- user1's prototype 1
    cur_proto := add_prototype(user1id);
    perform update_prototype_attributes(cur_proto, E'Teapot\nI know it is not wooden but please make me a wooden teapot.', 'public');
    perform add_prototype_resource(cur_proto, '2D_file', 'teapot1.jpg');

    -- user1's prototype 2
    cur_proto := add_prototype(user1id);
    perform update_prototype_attributes(cur_proto, E'Cup\nI also know that it is not wooden, but please make the wooden one', 'private');
    perform add_prototype_resource(cur_proto, '2D_file', 'cup1.jpg');
    perform add_prototype_resource(cur_proto, '2D_file', 'cup2.jpg');
    
    cur_proto := add_prototype(user2id);
    perform update_prototype_attributes(cur_proto, E'Wood house\nI saw a little wooden house here https://www.ozon.ru/context/detail/id/149408817/.\nWonder if you guy can make it for a smaller price :))', 'private');
    perform add_prototype_resource(cur_proto, '2D_file', 'wood-house-1.jpg');
    perform add_prototype_resource(cur_proto, '2D_file', 'wood-house-2.jpg');
    perform add_prototype_resource(cur_proto, '2D_file', 'wood-house-3.jpg');

    -- user1 order the company's first product
    -- cur_proto := (select product_prototype_id from product_prototype where owner_id = adminid order by description limit 1);
    -- order1id := form_product_order(user1id, cur_proto, '2021-01-01', 'somewhere');
    -- assign worker 2 to this order
    -- perform assign_order(order1id, worker2id, '2020-12-31');

    -- user3 order the user2's prototype
    -- cur_proto := (select product_prototype_id from product_prototype where owner_id = user2id); -- there is only 1 row.
    -- order2id := form_product_order(user2id, cur_proto, '2021-01-02', 'nowhere');
    -- assign worker 1 to this order
    -- perform assign_order(order2id, worker1id, '2021-01-01');

    -- use some of the detail during the making
    -- perform spend_details((select detail_type_id from detail_type where name = 'wood-log'), order1id, 5);
    -- perform spend_details((select detail_type_id from detail_type where name = 'wood-plank'), order2id, 5);

    -- user1 leaves 1 review on the second product prototype of the company
    -- cur_proto := (select product_prototype_id from product_prototype where owner_id = adminid order by description desc limit 1);
    -- perform make_review(user1id, cur_proto, 'Great product, would order again!', 5);
end $$
