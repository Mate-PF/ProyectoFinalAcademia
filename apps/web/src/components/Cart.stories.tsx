import type { Meta, StoryObj } from "@storybook/react";
import { Cart } from "./Cart";
import type { CartLine } from "../api/client";

const items: CartLine[] = [
  { menuItemId: "a", name: "Muzzarella", unitPrice: { amount: 1500, currency: "ARS" }, quantity: 2, subtotal: { amount: 3000, currency: "ARS" } },
  { menuItemId: "b", name: "Empanada", unitPrice: { amount: 500, currency: "ARS" }, quantity: 3, subtotal: { amount: 1500, currency: "ARS" } },
];

const meta: Meta<typeof Cart> = {
  title: "Componentes/Cart",
  component: Cart,
};
export default meta;

type Story = StoryObj<typeof Cart>;

export const ConItems: Story = {
  args: { items, total: { amount: 4500, currency: "ARS" }, onRemove: () => undefined, onCheckout: () => undefined },
};
export const Cargando: Story = { args: { items: [], total: null, loading: true } };
export const Vacio: Story = { args: { items: [], total: null } };
