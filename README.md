# FlixFlex

FlixFlex is a movie and series tracking application that allows users to discover, view details, and manage their favorite movies and series.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Movies and Series](#movies-and-series)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Swagger Documentation](#swagger-documentation)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/) (or provide your own database)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/oussamabouchikhi/flixflex.git
```

2. Install dependencies:

```bash
cd flixflex
pnpm install
```

3. Rename the `example.env.development` file to `.env.development` and modify the environment variables:
   > Note: you need to create a MongoDB atlas and create an account TMDB website

- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [TMDB](https://www.themoviedb.org/)

```env
MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_JWT_SECRET
ENCRYPT_JWT_SECRET=YOUR_JWT_ENCRIPTING_PASS
JWT_EXPIRATION=30m

TMDB_API_KEY=YOUR_TMDB_API_KEY
TMDB_READ_ACCESS_TOKEN=YOUR_TMDB_READ_ACCESS_TOKEN
```

## Usage

The base endpont is

> http://localhost:3000/api/v1/

### Authentication

To use authentication features, you need to register and login. Use the following API endpoints:

> POST /auth/register: Register a new user.
> POST /auth/login: Login with a registered user.

### Movies and Series

Explore and manage movies and series with the following API endpoints:

> GET /movies: Get a list of all movies.

> GET /movies/top: Get the top movies.

> GET /movies/:id: Get details of a specific movie.

> POST /movies/search: Search for movies.

> POST /movies/add-to-favorites/:id: Add a movie to your favorites.

> DELETE /movies/remove-from-favorites/:id: Remove a movie from your favorites.

> GET /movies/favorites: Get your list of favorite movies.

## API Endpoints

For a complete list of API endpoints and their descriptions, refer to the Swagger Documentation.

## Testing

Run the tests using:

```bash
pnpm run test
```

## Swagger Documentation

Access Swagger documentation to explore and test API endpoints:

## Start the application

```bash
pnpm run start:dev
```

## Visit Swagger documentation in your browser

> http://localhost:3000/api/v1/swagger

## Contributing

Feel free to contribute to the development of FlixFlex. Please follow the [Contribution Guidelines](/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
