import { describe, it, expect } from "vitest";
import { Order, type OrderStatus } from "./Order";
import { OrderItem } from "./OrderItem";
import { Money } from "../value-objects/Money";

function makeItem(overrides: Partial<{ price: number; currency: string; quantity: number }> = {}): OrderItem {
  const { price = 10, currency = "ARS", quantity = 1 } = overrides;
  return OrderItem.create({
    menuItemId: "m1",
    name: "Pizza",
    unitPrice: Money.fromDecimal(price, currency),
    quantity,
  });
}

function makeOrder(items: OrderItem[] = [makeItem()]): Order {
  return Order.create({ id: "o1", customerId: "c1", restaurantId: "r1", items });
}

/** Lleva un pedido nuevo hasta el estado pedido, usando solo transiciones válidas. */
function orderInStatus(status: OrderStatus): Order {
  const order = makeOrder();
  const path: Record<OrderStatus, () => void> = {
    PENDIENTE: () => {},
    CONFIRMADO: () => order.confirm(),
    EN_PREPARACION: () => {
      order.confirm();
      order.startPreparing();
    },
    EN_CAMINO: () => {
      order.confirm();
      order.startPreparing();
      order.dispatch();
    },
    ENTREGADO: () => {
      order.confirm();
      order.startPreparing();
      order.dispatch();
      order.deliver();
    },
    CANCELADO: () => order.cancel(),
  };
  path[status]();
  return order;
}

describe("Order", () => {
  describe("creación", () => {
    it("nace en estado PENDIENTE y sin repartidor asignado", () => {
      const order = makeOrder();
      expect(order.status).toBe("PENDIENTE");
      expect(order.delivererId).toBeNull();
    });

    it("requiere al menos un ítem", () => {
      expect(() => makeOrder([])).toThrow();
    });

    it("hace copia defensiva de las líneas (no se mutan desde afuera)", () => {
      const items = [makeItem()];
      const order = makeOrder(items);
      items.push(makeItem());
      expect(order.items).toHaveLength(1);
    });
  });

  describe("total", () => {
    it("suma los subtotales de las líneas", () => {
      const order = makeOrder([makeItem({ price: 10, quantity: 2 }), makeItem({ price: 5, quantity: 1 })]);
      expect(order.total().equals(Money.fromDecimal(25, "ARS"))).toBe(true);
    });

    it("falla si las líneas tienen monedas distintas", () => {
      const order = makeOrder([makeItem({ currency: "ARS" }), makeItem({ currency: "USD" })]);
      expect(() => order.total()).toThrow();
    });
  });

  describe("máquina de estados — camino feliz", () => {
    it("avanza PENDIENTE → CONFIRMADO → EN_PREPARACION → EN_CAMINO → ENTREGADO", () => {
      const order = makeOrder();
      order.confirm();
      expect(order.status).toBe("CONFIRMADO");
      order.startPreparing();
      expect(order.status).toBe("EN_PREPARACION");
      order.dispatch();
      expect(order.status).toBe("EN_CAMINO");
      order.deliver();
      expect(order.status).toBe("ENTREGADO");
    });
  });

  describe("máquina de estados — cancelación", () => {
    it.each<OrderStatus>(["PENDIENTE", "CONFIRMADO", "EN_PREPARACION"])(
      "permite cancelar desde %s",
      (status) => {
        const order = orderInStatus(status);
        order.cancel();
        expect(order.status).toBe("CANCELADO");
      },
    );

    it.each<OrderStatus>(["EN_CAMINO", "ENTREGADO"])(
      "no permite cancelar desde %s (ya salió a reparto / terminó)",
      (status) => {
        const order = orderInStatus(status);
        expect(() => order.cancel()).toThrow();
      },
    );
  });

  describe("máquina de estados — transiciones inválidas", () => {
    it("no permite saltar estados (PENDIENTE no puede despachar ni entregar ni preparar)", () => {
      expect(() => orderInStatus("PENDIENTE").startPreparing()).toThrow();
      expect(() => orderInStatus("PENDIENTE").dispatch()).toThrow();
      expect(() => orderInStatus("PENDIENTE").deliver()).toThrow();
    });

    it("no permite repetir/retroceder (CONFIRMADO no puede volver a confirmar)", () => {
      expect(() => orderInStatus("CONFIRMADO").confirm()).toThrow();
    });

    it("ENTREGADO es terminal: no admite ninguna transición", () => {
      const order = orderInStatus("ENTREGADO");
      expect(() => order.confirm()).toThrow();
      expect(() => order.cancel()).toThrow();
    });

    it("CANCELADO es terminal: no admite ninguna transición", () => {
      const order = orderInStatus("CANCELADO");
      expect(() => order.confirm()).toThrow();
      expect(() => order.deliver()).toThrow();
    });
  });

  describe("asignación de repartidor", () => {
    it.each<OrderStatus>(["CONFIRMADO", "EN_PREPARACION"])(
      "permite asignar repartidor en %s",
      (status) => {
        const order = orderInStatus(status);
        order.assignDeliverer("rep-9");
        expect(order.delivererId).toBe("rep-9");
      },
    );

    it.each<OrderStatus>(["PENDIENTE", "EN_CAMINO", "ENTREGADO", "CANCELADO"])(
      "no permite asignar repartidor en %s",
      (status) => {
        expect(() => orderInStatus(status).assignDeliverer("rep-9")).toThrow();
      },
    );

    it("rechaza un id de repartidor vacío", () => {
      expect(() => orderInStatus("CONFIRMADO").assignDeliverer("   ")).toThrow();
    });
  });
});

describe("Order.rehydrate (reconstitución desde persistencia)", () => {
  const item = OrderItem.create({
    menuItemId: "m1",
    name: "Pizza",
    unitPrice: Money.fromDecimal(10, "ARS"),
    quantity: 2,
  });

  it("reconstruye un pedido en un estado no inicial (ENTREGADO) con repartidor", () => {
    const order = Order.rehydrate({
      id: "o1",
      customerId: "c1",
      restaurantId: "r1",
      items: [item],
      status: "ENTREGADO",
      delivererId: "rep-9",
    });
    expect(order.status).toBe("ENTREGADO");
    expect(order.delivererId).toBe("rep-9");
    expect(order.total().equals(Money.fromDecimal(20, "ARS"))).toBe(true);
  });

  it("el pedido reconstruido sigue respetando la máquina de estados", () => {
    const confirmado = Order.rehydrate({
      id: "o1",
      customerId: "c1",
      restaurantId: "r1",
      items: [item],
      status: "CONFIRMADO",
      delivererId: null,
    });
    confirmado.startPreparing();
    expect(confirmado.status).toBe("EN_PREPARACION");

    const entregado = Order.rehydrate({
      id: "o2",
      customerId: "c1",
      restaurantId: "r1",
      items: [item],
      status: "ENTREGADO",
      delivererId: null,
    });
    expect(() => entregado.cancel()).toThrow(); // terminal: no admite transiciones
  });
});
