import type { Meta, StoryObj } from "@storybook/react";
import { MenuList } from "./MenuList";
import type { MenuItemDTO } from "../api/client";

const items: MenuItemDTO[] = [
  { id: "a", restaurantId: "r", name: "Muzzarella", price: { amount: 1500, currency: "ARS" }, available: true },
  { id: "b", restaurantId: "r", name: "Napolitana", price: { amount: 1800, currency: "ARS" }, available: false },
];

const meta: Meta<typeof MenuList> = {
  title: "Componentes/MenuList",
  component: MenuList,
};
export default meta;

type Story = StoryObj<typeof MenuList>;

export const ConItems: Story = { args: { items, onAdd: () => undefined } };
export const Cargando: Story = { args: { items: [], loading: true } };
export const Vacio: Story = { args: { items: [] } };
