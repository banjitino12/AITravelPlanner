# Contributing to AI Travel Planner

First off, thank you for considering contributing to AI Travel Planner! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript styleguide
* Include screenshots in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

### Setup Development Environment

1. Fork the repo
2. Clone your fork
3. Run `npm install` in the root directory
4. Run `npm install` in both `frontend` and `backend` directories
5. Create `.env` files based on `.env.example`
6. Run `npm run dev` to start development servers

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Examples:
```
feat: Add voice input for expense tracking
fix: Resolve authentication timeout issue
docs: Update API documentation
style: Format code with prettier
refactor: Simplify plan generation logic
test: Add tests for expense service
chore: Update dependencies
```

### Code Style

* Use TypeScript for all new code
* Follow the existing code style
* Run `npm run lint` before committing
* Use Prettier for code formatting
* Write meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused

### Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Maintain or improve code coverage

## Project Structure

```
AITravelPlanner/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── backend/           # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── package.json
└── package.json       # Root package
```

## Documentation

* Update README.md if needed
* Update USAGE.md for user-facing changes
* Update DEPLOYMENT.md for deployment changes
* Add JSDoc comments for public APIs
* Update CHANGELOG.md

## Questions?

Feel free to open an issue with the question label or reach out to the maintainers.

Thank you for contributing! 🙏
