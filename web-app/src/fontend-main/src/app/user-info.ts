export interface UserInfo {
  name: string;
  date_of_birth: Date | string;
  email: string;
  telephone_number: string;
  privilege: string;
}

export interface PrototypeResource {
  resource_type: '2D_file' | '3D_file';
  location: string;
}

export interface Prototype {
  product_prototype_id: number;
  owner_id: number;
  description: string;
  resources: PrototypeResource[];
}

export type OrderStatus = 'pending' | 'making' | 'finished' | 'delivered';

export interface ProductOrder {
  product_order_id: number;
  order_status: OrderStatus;
  product_prototype_id: number;

  user_email: string | undefined,
  planned_delivery_date: string | Date | undefined;
  delivery_address: string | undefined;
  user_profile_id: number;

  assigned_workers_count: number | undefined;
  finished_workers_count: number | undefined;

  is_finished: boolean | undefined;
  deadline: string | Date | undefined;
}

export interface Worker {
  worker_id: number;
  name: string;
  email: string;
}

export interface ProductMaking extends Worker {
  product_order_id: number;
  is_finished: number;
  deadline: string | Date;
}

export interface DetailInfo {
  detail_type_id: number;
  name: string;
  quantity_remain: number;
}

export interface WorkerForOrder {
  worker_id: number,
  name: string,
  email: string,
  deadline: string | Date,
  is_finished: boolean
}

export interface DetailInfo {
  name: string;
  quantity_remain: number;
}
