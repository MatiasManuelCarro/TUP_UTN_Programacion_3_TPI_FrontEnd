import type { Product } from "./product";

export interface IOrderDetail {
  cantidad: number;
  subtotal: number;
  producto: Product;
}

export interface IOrder {
  id: number;
  fecha: string; // formato YYYY-MM-DD
  estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO" | "CANCELADO";
  total: number;
  formaPago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  detalles: IOrderDetail[];
  usuarioDto: IUserDto;
}

//DTO para pedidos solamente, no requiere el password
export interface IUserDto {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: "USUARIO" | "ADMIN"; 
}