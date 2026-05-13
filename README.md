# DIN45554-Repair-Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20138050.svg)](https://doi.org/10.5281/zenodo.20138050)


A web-based repairability assessment tool implementing the DIN 45554 German industrial standard for measuring and evaluating the repairability of products.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [Authors](#authors)
- [Funding](#funding)
- [License](#license)

## Features

- **Product Group Management** - Create, read, update, and delete product groups
- **Parts Management** - Manage parts within product groups with version tracking
- **Version Control** - Track multiple versions of products
- **General Criteria Assessment** - 11 standardized repairability criteria:
  - Disassembly Depth
  - Fasteners and Connectors
  - Tools
  - Availability of Information
  - Availability of Spare Parts
  - Availability Duration of Spare Parts
  - Diagnostic Support and Interfaces
  - Working Environment
  - Data Management
  - Skill Level
  - Return Options
- **Rating Process** - Comprehensive repairability assessment workflow
- **Weighted Components** - Configure importance weights for product criteria
- **Export Capabilities** - Generate PDF and Excel reports
- **Multi-language Support** - Interface available in German and English

## Technology Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | Angular 18, RxJS, TypeScript                     |
| Backend     | Express.js, Sequelize ORM                        |
| Database    | PostgreSQL 15                                    |
| Containerization | Docker, Docker Compose                     |
| PDF Export  | jsPDF, html2canvas                               |
| Excel Export | xlsx library                                   |
| Math Rendering | MathJax 3                                      |

## Prerequisites

Before running this project, ensure you have the following installed:

- **Docker** (version 20.10 or higher) and **Docker Compose**
- **Node.js** (version 18 or higher) - for manual setup
- **npm** (version 9 or higher) - for manual setup

## Quick Start

The fastest way to get the application running is using Docker Compose.

```bash
# Clone the repository
git clone <repository-url>
cd Repair-Tool-DIN45554

# Start all services (database, backend, frontend)
docker-compose up --build

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8090/api
```

The application will automatically:
- Create the PostgreSQL database
- Initialize the database schema
- Seed default general criteria

## Manual Setup

If you prefer to run services manually instead of using Docker:

### Backend

```bash
cd backend

# Install dependencies
npm install

# Configure database (edit config/db.config.js if needed)
# Default: PostgreSQL on localhost:5432

# Create database and run migrations
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Start the server
node server.js
# Server runs on http://localhost:8080
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# Frontend runs on http://localhost:4200
```

Ensure the backend is running before starting the frontend. The frontend is configured to connect to `http://localhost:8090/api` by default.

## API Endpoints

### Product Groups
| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| GET    | /api/produktgruppen          | Get all product groups          |
| POST   | /api/produktgruppen          | Create a new product group      |
| GET    | /api/produktgruppen/:id      | Get product group by ID         |
| PUT    | /api/produktgruppen/:id      | Update product group            |
| DELETE | /api/produktgruppen/:id      | Delete product group            |

### Parts
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/teile                        | Get all parts            |
| POST   | /api/teile                        | Create a new part        |
| PUT    | /api/teile/:id                    | Update part              |
| DELETE | /api/teile/:id                    | Delete part              |
| GET    | /api/teile/produktgruppe/:id      | Get parts by product group |

### Versions
| Method | Endpoint                                  | Description                |
|--------|-------------------------------------------|----------------------------|
| GET    | /api/versionen                            | Get all versions           |
| POST   | /api/versionen                            | Create a new version       |
| PUT    | /api/versionen/:id                        | Update version             |
| DELETE | /api/versionen/:id                        | Delete version             |

### General Criteria
| Method | Endpoint                     | Description                |
|--------|------------------------------|----------------------------|
| GET    | /api/allgemeine_kriterien    | Get all general criteria   |

### Assessment Process
| Method | Endpoint                     | Description                |
|--------|------------------------------|----------------------------|
| GET    | /api/bewertungsprozess       | Get all assessments        |
| POST   | /api/bewertungsprozess       | Create new assessment      |

## Database Schema

The application uses the following main entities:

```
Produktgruppe (Product Group)
├── id (PK)
├── name
├── beschreibung (description)
├── createdAt
└── updatedAt

Teil (Part)
├── id (PK)
├── produktgruppe_id (FK)
├── name
├── createdAt
└── updatedAt

Version
├── id (PK)
├── produktgruppe_id (FK)
├── versionsnummer (version number)
├── createdAt
└── updatedAt

AllgemeineKriterium (General Criteria)
├── id (PK)
├── name
├── beschreibung (description)
├── createdAt
└── updatedAt

KennzahlProduktkriterien (Product Criteria Metrics)
├── id (PK)
├── produktgruppe_id (FK)
├── kriterium_id (FK)
├── wert (value)
└── ...

KennzahlTeilkriterien (Part Criteria Metrics)
├── id (PK)
├── teil_id (FK)
├── kriterium_id (FK)
├── wert (value)
└── ...

GewichtderProduktKomponenten (Product Component Weights)
├── id (PK)
├── produktgruppe_id (FK)
├── kriterium_id (FK)
├── gewicht (weight)
└── ...
```

## Development Scripts

### Frontend
```bash
cd frontend

npm start          # Start development server
npm run build      # Build for production
npm test           # Run unit tests
npm run watch      # Build in watch mode (development)
```

### Backend
```bash
cd backend

node server.js           # Start server (development)
npx sequelize-cli db:migrate    # Run database migrations
npx sequelize-cli db:seed       # Seed database with initial data
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

Lisa Dawel (DfKI Oldenburg),
Ole Meyer (OFFIS e.V.),
Alexandra Pehlken (DfKI Oldenburg)

## Funding

This project has received funding from the European Union’s Horizon Europe research and innovation programme under Grant Agreement No. 101091490
