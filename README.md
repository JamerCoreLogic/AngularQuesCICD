# AdjusterLocatorApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Angular Project Coding Standards

## Code Style and Standards

### File Naming Conventions
- Use kebab-case for all filenames
- Follow Angular's naming pattern:
  - Components: `feature.component.ts`
  - Services: `feature.service.ts`
  - Directives: `feature.directive.ts`
  - Pipes: `feature.pipe.ts`
  - Tests: `feature.spec.ts`
  - Styles: `feature.component.scss`

### TypeScript Guidelines
- Use strict typing, avoid `any`
- Define interfaces for data models with `I` prefix
- Define enums with `E` prefix
- Use private members with underscore prefix
- Use meaningful variable and function names
- Document complex functions with JSDoc comments

### Component Guidelines
- Use standalone components where possible
- Implement lifecycle interfaces explicitly
- Keep components focused and small
- Use signals for reactive state management
- Use `inject()` function for dependency injection
- Implement proper cleanup in `ngOnDestroy`

### Template Guidelines
- Use `trackBy` functions with `*ngFor`
- Use async pipe for observables
- Implement proper accessibility attributes
- Use semantic HTML elements
- Avoid logic in templates

### Service Guidelines
- Keep services single-responsibility
- Use proper error handling
- Implement retry logic for HTTP calls
- Use proper typing for API responses
- Document public methods

### Testing Guidelines
- Follow AAA pattern (Arrange-Act-Assert)
- Test edge cases and error scenarios
- Mock external dependencies
- Use proper test descriptions
- Maintain high test coverage (90%+)

### Performance Guidelines
- Implement lazy loading
- Use pure pipes
- Optimize change detection
- Use `NgOptimizedImage` for images
- Implement proper caching strategies

### Security Guidelines
- Sanitize user input
- Use Angular's built-in XSS protection
- Implement proper CSRF protection
- Follow OWASP guidelines
- Use environment variables for sensitive data

## Project Structure
```
src/
├── app/
│   ├── core/           # Singleton services, guards, interceptors
│   ├── shared/         # Shared components, directives, pipes
│   ├── features/       # Feature modules
│   └── utils/          # Utility functions and constants
├── assets/            # Static files
└── environments/      # Environment configurations
```

## Development Workflow
1. Pull latest changes
2. Create feature branch
3. Write tests first (TDD)
4. Implement feature
5. Run linting and tests
6. Create pull request
7. Address review comments
8. Merge after approval

## Commands
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm run test`: Run unit tests
- `npm run e2e`: Run e2e tests
- `npm run build`: Production build

## Dependencies
- Node.js >= 18.x
- Angular CLI >= 17.x
- TypeScript >= 5.x

## Code Review Checklist
- [ ] Follows naming conventions
- [ ] Implements proper error handling
- [ ] Includes unit tests
- [ ] Maintains code coverage
- [ ] Follows security guidelines
- [ ] Implements proper cleanup
- [ ] Uses proper typing
- [ ] Follows performance guidelines
- [ ] Implements accessibility
- [ ] Documentation updated
