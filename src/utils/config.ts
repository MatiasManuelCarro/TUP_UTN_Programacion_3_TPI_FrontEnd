
// Constante fija de envío
export const DELIVERY = 600;

/* =====================================================
    Devuelve el costo de envío actual.
    Si en el futuro se necesita modificar,
    solo se modifica aca y no en todo el código.
======================================================*/
export function getDeliveryCost(): number {
    return DELIVERY;
}

