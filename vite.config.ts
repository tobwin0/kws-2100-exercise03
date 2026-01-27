import { defineConfig } from "vite";

export default defineConfig({
  base: "/kws-2100-exercise03",
  // Prevent repeated slow pre-bundling of large deps (like `ol`) by excluding them
  // from Vite's optimize step in dev. We still force-include React to keep dev
  // startup stable.
  optimizeDeps: {
    exclude: ["ol"],
    include: ["react", "react-dom", "geotiff", "xml-utils"],
  },
  // Reduce filesystem watch noise that can trigger re-optimizations/restarts.
  server: {
    watch: {
      // ignore node_modules and git metadata
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
  },
});
