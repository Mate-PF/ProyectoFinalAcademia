import type { Meta, StoryObj } from "@storybook/react";
import { OrderTracking } from "./OrderTracking";

const meta: Meta<typeof OrderTracking> = {
  title: "Componentes/OrderTracking",
  component: OrderTracking,
};
export default meta;

type Story = StoryObj<typeof OrderTracking>;

export const Confirmado: Story = {
  args: { tracking: { orderId: "o-1", status: "CONFIRMADO", total: { amount: 3000, currency: "ARS" }, delivererId: null } },
};
export const EnCamino: Story = {
  args: { tracking: { orderId: "o-1", status: "EN_CAMINO", total: { amount: 3000, currency: "ARS" }, delivererId: "rep-9" } },
};
