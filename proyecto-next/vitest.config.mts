import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Define the configuration
export default defineConfig({
  plugins: [react()], // Enables React support with Vite

  // Test configuration
  test: {
    // Enable global variables (e.g., `describe`, `it`, `expect`) without imports
    globals: true,

    // Use jsdom as the test environment for React components
    environment: "jsdom",

    // Path to setup file(s) for global test configuration
    setupFiles: ["./test/setupTests.ts"], // Ensure correct casing and path

    // Include source files for testing (matches your project structure)
    includeSource: ["src/**/*.{ts,tsx}"],

    // Enable TypeScript type checking during tests
    typecheck: {
      tsconfig: "./tsconfig.test.json", // Path to test-specific TypeScript config
    },

    // Add coverage reporting to check test coverage
    coverage: {
      reporter: ["text", "html"], // Generate text summary and HTML report
      include: ["src/**/*.{ts,tsx}"], // Only check source files
      exclude: ["src/types/**/*", "src/lib/googleBooks.ts"], // Exclude types and external API logic
      thresholds: {
        statements: 70, // Aim for at least 70% coverage
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },

  // Resolve aliases for imports (e.g., `@/components` -> `src/components`)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});