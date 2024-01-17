# NestJS Abstract Mongo Repository

An abstract MongoDB entity repository for NestJS using Mongoose.

## Introduction

NestJS Abstract Mongo Repository provides a flexible and reusable solution for interacting with MongoDB using Mongoose in your NestJS applications.

## Installation

Install the package using npm:

```bash
npm install nestjs-abstract-mongo-repository
```

## Usage

### Importing

Import the **`EntityRepository`** class in your NestJS application:

```javascript
import { EntityRepository } from "nestjs-abstract-mongo-repository";
```

### Creating a Repository

Create a repository for your MongoDB entity by extending **`EntityRepository`**`:

```javascript
import { Model } from 'mongoose';
import { EntityRepository } from 'nestjs-abstract-mongo-repository';
import { UserDocument } from './user.model'; // Your Mongoose model

class UserRepository extends EntityRepository<UserDocument> {
  constructor() {
    super({
      entityModel: // Your Mongoose model instance,
      logger: true, // Optional: Enable logging (default is false)
    });
  }

  // Additional methods specific to the User entity can be added here.
}
```

## Methods

### `find` Method

Finds documents based on the provided filter query.

```javascript
const users = await userRepository.find({ age: { $gte: 18 } });
console.log(users);
```

### `findById` Method

Finds a document by its ID.

```javascript

```

### `findOne` Method

Finds a single document based on the provided filter query.

```javascript

```

### `fullTextSearch` Method

Performs a full-text search on the specified field.

```javascript

```

### `count` Method

Counts the number of documents based on the provided filter query.

```javascript

```

### `distinctValues` Method

Finds distinct values for a specified field based on the provided filter query.

```javascript

```

### `updateOne` Method

Updates single document based on the provided filter query.

```typescript
async updateOne(
  filterQuery: FilterQuery<T>,
  update: UpdateQuery<unknown>
): Promise<number>

```

### `updateMany` Method

Updates multiple documents based on the provided filter query.

```javascript

```

### `findOneAndUpdate` Method

Finds a document by the provided filter query, updates it, and returns the updated document.

```javascript

```

### `updateById` Method

Updates a document by its ID with the provided update data.

```javascript

```

### `deleteOne` Method

Deletes a single document based on the provided filter query.

```javascript

```

### `deleteMany` Method

Deletes multiple documents based on the provided filter query.

```javascript

```

### `startTransaction` Method

Starts a new database session and transaction.

```javascript

```

### `commitTransaction` Method

Commits the ongoing transaction and ends the provided session.

```javascript

```

### `abortTransaction` Method

Aborts the ongoing transaction and ends the provided session.

```javascript

```

### `endTransaction` Method

Ends the provided session without committing or aborting the transaction.

```javascript

```

## Contributing

Contributions are always welcome!
