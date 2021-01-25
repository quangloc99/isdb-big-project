create index user_profile__email on user_profile (email);
create index product_order__user_profile_id on product_order (user_profile_id);
create index product_making__worker_id on product_making (worker_id);
create index product_prototype_resource__product_prototype_id on product_prototype_resource (product_prototype_id);
create index used_detail__product_order_id on used_detail (product_order_id);
create index review__product_prototype_id on review (product_prototype_id);
