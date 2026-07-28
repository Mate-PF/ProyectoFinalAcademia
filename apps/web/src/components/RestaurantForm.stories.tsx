import type { Meta, StoryObj } from "@storybook/react";
import { RestaurantForm } from "./RestaurantForm";

const meta: Meta<typeof RestaurantForm> = { title: "Componentes/RestaurantForm", component: RestaurantForm, args: { onSubmit: () => undefined } };
export default meta;
type Story = StoryObj<typeof RestaurantForm>;
export const Normal: Story = {};
export const Cargando: Story = { args: { loading: true } };
