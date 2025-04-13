# PluteoJS

A robust Node.js TypeScript template for backend applications with built-in database connectivity, authentication, and API structure.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

## 🌟 Overview

PluteoJS is a starter template for building scalable backend services with TypeScript. It provides a well-structured foundation with PostgreSQL database integration, authentication flows, and robust error handling.

## 🚀 Features

- **TypeScript-First**: Fully typed codebase with strict type checking
- **Express.js v5.1.0**: Built on the latest Express framework for robust HTTP server implementation
- **PostgreSQL Integration**: Using pg-promise for efficient database operations
- **Repository Pattern**: Clean separation of data access logic
- **Authentication**: Ready-to-use authentication routes and services
- **Error Handling**: Comprehensive error handling throughout the application
- **Logging**: Advanced logging with Winston across different environments
- **Code Quality**: ESLint and Prettier for code quality and consistent style
- **Git Hooks**: Husky for pre-commit and pre-push validations
- **Versioning**: Standard-version for release management
- **Environment Management**: Configuration for different environments (development, staging, production)

## 📁 Project Structure

```
├── src/
│   ├── App.ts                      # Application entry point
│   ├── api/                        # API definition layer
│   │   ├── middlewares/            # Express middlewares
│   │   └── routes/                 # Express routes
│   ├── config/                     # Configuration handling
│   ├── constants/                  # Application constants
│   │   ├── errors/                 # Error message definitions
│   │   └── successMessages/        # Success message definitions
│   ├── customTypes/                # TypeScript type definitions
│   │   └── appDataTypes/           # Application-specific types
│   ├── db/                         # Database related code
│   │   ├── models/                 # Database entity models
│   │   ├── repositories/           # Data access layer
│   │   └── sql/                    # SQL query files
│   ├── jobs/                       # Scheduled/recurring jobs
│   ├── loaders/                    # Application bootstrapping
│   ├── services/                   # Business logic layer
│   ├── subscribers/                # Event handlers
│   ├── util/                       # Utility functions
│   └── validations/                # Request validation schemas
├── logs/                           # Application log files
├── ecosystem-staging.config.js     # PM2 configuration for staging
├── eslint.config.mjs               # ESLint configuration
├── nodemon.json                    # Nodemon configuration
├── tsconfig.json                   # TypeScript configuration
└── tsconfig.scripts.json           # TypeScript config for scripts
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js v22.14.0 (as specified in volta config)
- PostgreSQL >= 13
- Yarn v4.9.0 (as specified in volta config)

We recommend using [Volta](https://volta.sh/) for managing Node.js and Yarn versions.

## 📝 Scripts

- `yarn lint`: Run linting checks
- `yarn check-types`: Validate TypeScript types
- `yarn format`: Format code with Prettier
- `yarn start:dev`: Start development server with nodemon
- `yarn build`: Build the application
- `yarn start:production`: Build and start in production mode
- `yarn inspect`: Start server in debug mode
- `yarn release`: Create a new release using standard-version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📚 References & Inspiration

This project structure is inspired by best practices from:

- [The Bulletproof Node.js Architecture](https://www.softwareontheroad.com/ideal-nodejs-project-structure/) - A comprehensive guide on structuring Node.js applications
- [pg-promise-demo](https://github.com/vitaly-t/pg-promise-demo/tree/master) - Reference implementation for PostgreSQL integration using pg-promise

## 👥 Acknowledgments

- [HeedLabs](https://heedlabs.com/) team for creating and maintaining this template
- All the open-source libraries used in this project
