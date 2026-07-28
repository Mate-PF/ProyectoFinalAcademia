import type { Meta, StoryObj } from "@storybook/react";
import { MenuItemForm } from "./MenuItemForm";

const meta: Meta<typeof MenuItemForm> = { title: "Componentes/MenuItemForm", component: MenuItemForm, args: { onSubmit: () => undefined } };
export default meta;
type Story = StoryObj<typeof MenuItemForm>;
export const Normal: Story = {};
export const ConError: Story = { args: { error: "El precio del ítem debe ser positivo" } };
