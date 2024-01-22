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
      errLogger: true, // Optional: Enable error logging (default is false)
    });
  }

  // Additional methods specific to the User entity can be added here.
}
```

## Methods

### `create` Method

The `create` method is used to create a new document in the database using the provided data. It returns a promise that resolves to the created document, or throws an `HttpException` with an appropriate status code if the creation fails.

#### Example Usage

```javascript
const entityRepo = new EntityRepository({ entityModel: MyModel });
const createEntity = { name: "John Doe", age: 25 };
const createdDocument = await entityRepo.create(createEntity);
console.log(createdDocument); // { _id: '...', name: 'John Doe', age: 25, ... }
```

### `createMany` Method

The `createMany` method is used to create multiple documents in the database using the `entityModel.create` method. It takes an array of data for creating the new documents as input and returns a promise that resolves to an array of the created documents. If the creation fails for any document, it throws an `HttpException` with an appropriate status code.

#### Example Usage

```javascript
const entityRepo = new EntityRepository({ entityModel: MyModel });
const createEntities = [
  { name: "John", age: 25 },
  { name: "Jane", age: 30 },
];
const createdDocuments = await entityRepo.createMany(createEntities);
console.log(createdDocuments);
// Output: [Document1, Document2]
```

### `find` Method

Finds documents based on the provided filter query.

```javascript
const users = await userRepository.find({ age: { $gte: 18 } });
console.log(users);
```

### `findById` Method

The `findById` method is used to find a document in the database by its ID. It takes an ID parameter and an optional projection parameter to specify which fields to include or exclude from the result. If a document with the specified ID is found, it is returned. If no document is found, an `HttpException` with a `NOT_FOUND` status is thrown.

#### Example Usage

```javascript
const document = await repository.findById("12345");
console.log(document);
// Output: The document with ID "12345" or 404 HttpException if not found
```

### `findOne` Method

The `findOne` method is used to find a single document in the database based on the provided filter query and projection.

#### Example Usage

```javascript
const filterQuery = { name: "John" };
const projection = { name: 1, age: 1 };
const document = await repository.findOne(filterQuery, projection);
console.log(document);
// Output: The document with name "John" or null if not found
```

### `fullTextSearch` Method

The `fullTextSearch` method performs a case-insensitive full-text search on a specified field in the database. It uses a regular expression to match documents that contain the specified search text in the specified field.

#### Example Usage

```javascript
const searchText = "example";
const searchField = "title";
const results = await entityRepo.fullTextSearch(searchText, searchField);
console.log(results);
```

### `count` Method

The `count` method is used to count the number of documents in a MongoDB collection based on the provided filter query.

#### Example Usage

```javascript
const filterQuery = { status: "active" };
const count = await entityRepo.count(filterQuery);
console.log(count); // Output: 10
```

### `distinctValues` Method

The `distinctValues` method is used to find distinct values for a specified field based on the provided filter query.

#### Example Usage

```javascript
const repository =
  new EntityRepository() < MyEntity > { entityModel: MyEntityModel };
const distinctValues = await repository.distinctValues("fieldName", {
  filterField: "filterValue",
});
console.log(distinctValues);
// Output: [value1, value2, value3]
```

### `updateOne` Method

The `updateOne` method is used to update a single document in the database based on the provided filter query and update data.

#### Example Usage

```javascript
const filterQuery = { _id: "123" };
const update = { name: "John" };
const result = await repository.updateOne(filterQuery, update);
console.log(result); // Output: 1
```

### `updateMany` Method

The `updateMany` method updates multiple documents in the database based on the provided filter query and the data to update the documents with.

#### Example Usage

```javascript
const filterQuery = { field: "value" };
const update = { $set: { field: "new value" } };

const updatedCount = await repository.updateMany(filterQuery, update);
console.log(updatedCount); // Output: the number of updated documents
```

### `findOneAndUpdate` Method

The `findOneAndUpdate` method is used to find a document in the database based on the provided filter query, update it with the specified data, and return the updated document. It is a part of the `EntityRepository` class.

#### Example Usage

```javascript
const filterQuery = { _id: "123" };
const updatedObject = { name: "John" };
const updatedDocument = await repository.findOneAndUpdate(
  filterQuery,
  updatedObject
);
console.log(updatedDocument);
// Output: { _id: '123', name: 'John', ... }
```

### `updateById` Method

The `updateById` method updates a document in the database based on its ID. It uses optimistic concurrency control to handle potential race conditions.

#### Example Usage

```javascript
const updatedDocument = await repository.updateById("12345", { name: "John" });
console.log(updatedDocument);
```

### `deleteOne` Method

This method is responsible for deleting a single document from the database based on the provided filter query.

#### Example Usage

```javascript
const filterQuery = { _id: "123" };
const result = await repository.deleteOne(filterQuery);
console.log(result); // true or false
```

### `deleteMany` Method

The `deleteMany` method is used to delete multiple documents from the database based on the provided filter query. It returns a boolean value indicating whether one or more documents were deleted.

## Example Usage

```javascript
const filterQuery = { age: { $gte: 18 } };
const result = await repository.deleteMany(filterQuery);
console.log(result); // true or false
```

## Contributing

Contributions are always welcome!
