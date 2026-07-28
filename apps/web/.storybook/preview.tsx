import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#fafafa", minHeight: "100vh", padding: 24 }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
