create or replace function check_detail_quantity_trigger() returns trigger as $$
<<local>>
declare
    detail_type_id int;
    diff bigint;
    having_acc bigint;
begin
    raise notice 'calling trigger';
    diff := 0;
    if new is not NULL then
        if new.quantity < 0 then
            raise exception 'Quantity must be non-negative';
        end if;
        raise notice 'new %', new.quantity;
        diff := diff + new.quantity;
        detail_type_id := new.detail_type_id;
    end if;
    raise notice 'diff %', diff;
    if old is not NULL then
        diff := diff - old.quantity;
        detail_type_id := old.detail_type_id;
        raise notice 'old %', old.quantity;
    end if;
    raise notice 'diff %', diff;
    if TG_NAME = 'check_detail_quantity_when_using' then
        diff := -diff;
    end if;
    raise notice 'diff %', diff;
    having_acc := (select quantity_remain from detail_remain where detail_remain.detail_type_id = local.detail_type_id);
    raise notice 'having %, diff %', having_acc, diff;
    if (having_acc + diff < 0) then
        raise exception 'Detail % is having spent quantity more than current having', (select name from detail_type where detail_type.detail_type_id = local.detail_type_id);
    end if;
    return new;
end $$ language plpgsql;

drop trigger if exists check_detail_quantity_when_using on used_detail;
drop trigger if exists check_detail_quantity_when_importing on storage;
create trigger check_detail_quantity_when_using
    before insert or update 
    on used_detail
    for each row
    execute procedure check_detail_quantity_trigger();

create trigger check_detail_quantity_when_importing
    before update or delete
    on storage
    for each row
    execute procedure check_detail_quantity_trigger();

