import type { Meta, StoryObj } from "@storybook/react";
import { RegisterForm } from "./RegisterForm";

const meta: Meta<typeof RegisterForm> = {
  title: "Componentes/RegisterForm",
  component: RegisterForm,
  args: { onSubmit: () => undefined },
};
export default meta;

type Story = StoryObj<typeof RegisterForm>;

export const Normal: Story = {};
export const ConError: Story = { args: { error: "Ya existe un usuario con ese email" } };
export const Cargando: Story = { args: { loading: true } };
