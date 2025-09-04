// src/setupTests.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock para window.alert
vi.stubGlobal('alert', vi.fn());
