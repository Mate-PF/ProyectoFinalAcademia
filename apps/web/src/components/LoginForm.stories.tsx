import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Componentes/LoginForm",
  component: LoginForm,
  args: { onSubmit: () => undefined },
};
export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Normal: Story = {};
export const ConError: Story = { args: { error: "Email o contraseña incorrectos" } };
export const Cargando: Story = { args: { loading: true } };
