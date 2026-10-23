import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
// jsdom has no layout/scroll rendering. This does not simulate browser visuals.
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()
