# Registration Form - React TypeScript Exercise

This is the starting point for Lab 3: React TypeScript Forms.

## What's Included

- `package.json` - Vite + React + TypeScript setup with testing
- `src/App.tsx` - Main application component
- `src/components/RegistrationForm.tsx` - Skeleton form component

## What You'll Build

Using Codex, implement a production-ready multi-step registration form:

1. **Zod Schema** - Validation rules for all fields
2. **React Hook Form** - Form state management
3. **Multi-Step Flow** - Personal Info → Account → Confirmation
4. **Accessibility** - ARIA labels, keyboard navigation, focus management
5. **Error Handling** - Inline validation messages
6. **Tests** - Component and integration tests

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (passes even before you add tests)
npm test
```

## First Codex Prompt

```bash
codex "Create a Zod schema for a registration form with firstName, lastName, 
email, password, and confirmPassword. Include validation for email format, 
password strength (8+ chars, uppercase, number), and matching passwords."
```
