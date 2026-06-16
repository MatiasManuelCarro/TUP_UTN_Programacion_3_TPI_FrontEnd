import type { Product } from "./product";
import type { IUser } from "./users";

export interface IOrderDetail {
  cantidad: number;
  subtotal: number;
  producto: Product;
}

export interface IOrder {
  id: number;
  fecha: string; // formato YYYY-MM-DD
  estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO";
  total: number;
  formaPago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  detalles: IOrderDetail[];
  usuarioDto: IUser;
}