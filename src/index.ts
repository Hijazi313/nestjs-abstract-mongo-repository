import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import {
  ClientSession,
  CreateOptions,
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
} from "mongoose";

/**
 * Abstract class for creating MongoDB repositories with common CRUD operations.
 * This class provides a set of reusable methods for interacting with MongoDB using Mongoose.
 * @template T - The type of the MongoDB document.
 *
 * Usage Example:
 * ```typescript
 * class UserRepository extends EntityRepository<User> {
 * constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({ entityModel: userModel });
  }
 *   // Additional methods specific to the User entity can be added here.
 * }
 * ```
 */
export abstract class EntityRepository<T extends Document> {
  private readonly logger = new Logger(EntityRepository.name);

  /**
   * Constructor for the EntityRepository class.
   * @param options - Configuration options for the repository.
   * @param options.entityModel - Mongoose model representing the entity.
   * @param options.errLogger - Whether to enable error logging (default is false).
   * @throws Error if entityModel is not provided.
   */
  constructor(
    protected readonly options: Partial<{
      entityModel: Model<T>;
      errLogger?: boolean;
    }> = {
      errLogger: false,
    }
  ) {
    if (!options.entityModel) {
      throw new Error("entityModel is required");
    }
  }

  /**
   * Creates a new document in the database using the provided data.
   * @param createEntity - The data for creating the new document.
   * @returns Promise resolving to the created document.
   * @throws HttpException with appropriate status code if creation fails.
   */
  async create(createEntity: unknown, options?: CreateOptions) {
    try {
      return await new this.options.entityModel(createEntity).save(options);
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Creates multiple documents.
   * @param createEntities - Array of data for creating the new documents.
   * @returns Promise resolving to an array of the created documents.
   * @throws HttpException with appropriate status code if creation fails for any document.
   */
  async createMany(createEntities: unknown[]): Promise<T[]> {
    try {
      const createdDocuments = await this.options.entityModel.create(
        createEntities
      );
      return createdDocuments;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Finds documents based on the provided filter query.
   * @param entityFilterQuery - Filter criteria for querying documents.
   * @param projection - Fields to include/exclude from the result.
   * @param options - Additional options such as skip and limit for pagination.
   * @returns Promise resolving to an array of documents.
   */
  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: { skip?: number; limit?: number }
  ): Promise<T[]> {
    return this.options.entityModel
      .find(entityFilterQuery, projection)
      .skip(options?.skip || 0)
      .limit(options?.limit || 0)
      .exec();
  }

  /**
   * Finds a document by its ID.
   * @param id - ID of the document to retrieve.
   * @param projection - Fields to include/exclude from the result.
   * @returns Promise resolving to the found document or null.
   * @throws HttpException with NOT_FOUND status if no document is found.
   */
  async findById(
    id: string,
    projection?: Record<string, unknown>
  ): Promise<T | null> {
    try {
      const data = await this.options.entityModel
        .findById(id, projection)
        .exec();
      if (!data) {
        throw new HttpException(
          `No data found with ID ${id}`,
          HttpStatus.NOT_FOUND
        );
      }
      return data;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Finds a single document based on the provided filter query.
   * @param entityFilterQuery - Filter criteria for querying the document.
   * @param projection - Fields to include/exclude from the result.
   * @returns Promise resolving to the found document or null.
   */
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<T | null> {
    return this.options.entityModel
      .findOne(entityFilterQuery, projection)
      .exec();
  }

  /**
   * Performs a full-text search on the specified field.
   * @param searchText - The text to search for.
   * @param searchField - The field to search in.
   * @returns Promise resolving to an array of documents matching the search criteria.
   * @throws HttpException with appropriate status code if the search fails.
   */
  async fullTextSearch(searchText: string, searchField: string): Promise<T[]> {
    try {
      const searchQuery = {
        [searchField]: { $regex: searchText, $options: "i" },
      } as FilterQuery<T>;
      return this.options.entityModel.find(searchQuery).exec();
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Counts the number of documents based on the provided filter query.
   * @param entityFilterQuery - Filter criteria for counting documents.
   * @returns Promise resolving to the count of matching documents.
   */
  async count(entityFilterQuery: FilterQuery<T>): Promise<number> {
    try {
      return await this.options.entityModel
        .countDocuments(entityFilterQuery)
        .exec();
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Finds distinct values for a specified field based on the provided filter query.
   * @param field - Field for which to find distinct values.
   * @param entityFilterQuery - Filter criteria for finding distinct values.
   * @returns Promise resolving to an array of distinct values.
   */
  async distinctValues(
    field: string,
    entityFilterQuery?: FilterQuery<T>
  ): Promise<any[]> {
    try {
      return await this.options.entityModel
        .distinct(field, entityFilterQuery)
        .exec();
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Updates single document based on the provided filter query.
   * @param filterQuery - Filter criteria for updating documents.
   * @param update - Data to update documents with.
   * @returns Promise resolving to the number of updated documents.
   * @throws HttpException with appropriate status code if update fails.
   */
  async updateOne(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<unknown>
  ): Promise<number> {
    try {
      const updateResult = await this.options.entityModel
        .updateOne(filterQuery, update)
        .exec();
      return updateResult.modifiedCount || 0;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Updates multiple documents based on the provided filter query.
   * @param filterQuery - Filter criteria for updating documents.
   * @param update - Data to update documents with.
   * @returns Promise resolving to the number of updated documents.
   * @throws HttpException with appropriate status code if update fails.
   */
  async updateMany(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<unknown>
  ): Promise<number> {
    try {
      const updateResult = await this.options.entityModel
        .updateMany(filterQuery, update)
        .exec();
      return updateResult.modifiedCount || 0;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Asynchronously finds a document based on the provided filter query and updates it.
   * If no document matches the filter query, it may create a new document based on the upsert option.
   *
   * @param filterQuery - The query object used to filter the document to be updated.
   * @param updatedObject - An object representing the updates to be applied to the document.
   * @param options - Optional configuration for the update operation. Defaults to { versionKey: "__v", incVersion: false, upsert: false }.
   *   - versionKey: The key used for versioning (default: "__v").
   *   - incVersion: Whether to increment the version key (default: false).
   *   - upsert: Whether to create a new document if no match is found (default: false).
   *
   * @returns A Promise resolving to the updated document or null if no document is found.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updatedObject: UpdateQuery<unknown>,
    options = { versionKey: "__v", incVersion: false, upsert: false }
  ): Promise<T | null> {
    try {
      return await this.options.entityModel.findOneAndUpdate(
        filterQuery,
        options.incVersion
          ? { ...updatedObject, $inc: { [options.versionKey]: 1 } }
          : updatedObject,
        { new: true, upsert: options.upsert }
      );
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Updates a document by its ID with the provided update data.
   * Uses optimistic concurrency control to handle potential race conditions.
   * @param id - ID of the document to update.
   * @param update - Data to update the document with.
   * @returns Promise resolving to the updated document.
   * @throws HttpException with appropriate status code if update fails.
   */
  async updateById(id: string, update: UpdateQuery<T>): Promise<T> {
    const session = await this.options.entityModel.startSession();
    session.startTransaction();

    try {
      const existingDoc = await this.options.entityModel
        .findById(id)
        .session(session);
      if (!existingDoc) {
        throw new HttpException(
          `No data found with ID ${id}`,
          HttpStatus.NOT_FOUND
        );
      }

      // Simulate optimistic concurrency control
      if (update.__v && existingDoc.__v !== update.__v) {
        throw new HttpException("Concurrency conflict", HttpStatus.CONFLICT);
      }

      const updatedDoc = await this.options.entityModel
        .findByIdAndUpdate(
          id,
          { ...update, __v: existingDoc.__v + 1 },
          { new: true }
        )
        .session(session);

      await session.commitTransaction();
      session.endSession();

      return updatedDoc;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.handleDatabaseError(error);
    }
  }

  /**
   * Deletes a single document based on the provided filter query.
   * @param filterQuery - Filter criteria for deleting the document.
   * @returns Promise resolving to true if the document was deleted, false otherwise.
   * @throws HttpException with appropriate status code if
   */
  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      const deleteResult = await this.options.entityModel.deleteOne(
        filterQuery
      );
      return deleteResult.deletedCount >= 1;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Deletes multiple documents based on the provided filter query.
   * @param filterQuery - Filter criteria for deleting documents.
   * @returns Promise resolving to true if one or more documents were deleted, false otherwise.
   * @throws HttpException with appropriate status code if deletion fails.
   */
  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      const deleteResult = await this.options.entityModel.deleteMany(
        filterQuery
      );
      return deleteResult.deletedCount >= 1;
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  // Transaction and Session Management

  /**
   * Starts a new database session and transaction.
   * @returns Promise resolving to the started session.
   */
  async startTransaction(): Promise<ClientSession> {
    const session = await this.options.entityModel.startSession();
    session.startTransaction();
    return session;
  }

  /**
   * Commits the ongoing transaction and ends the provided session.
   * @param session - The database session to commit and end.
   * @throws HttpException with appropriate status code if committing the transaction fails.
   */
  async commitTransaction(session: ClientSession): Promise<void> {
    try {
      await session.commitTransaction();
    } catch (error) {
      // If committing the transaction fails, handle the error.
      await session.abortTransaction();
      session.endSession();
      this.handleDatabaseError(error);
    }
  }

  /**
   * Aborts the ongoing transaction and ends the provided session.
   * @param session - The database session to abort and end.
   * @throws HttpException with appropriate status code if aborting the transaction fails.
   */
  async abortTransaction(session: ClientSession): Promise<void> {
    try {
      await session.abortTransaction();
    } catch (error) {
      // If aborting the transaction fails, handle the error.
      session.endSession();
      this.handleDatabaseError(error);
    }
  }

  /**
   * Ends the provided session without committing or aborting the transaction.
   * @param session - The database session to end.
   */
  endTransaction(session: ClientSession): void {
    session.endSession();
  }

  // Additional Operations

  /**
   * Executes an aggregation pipeline on the entity's collection.
   * @param aggregatePipeline - Array of stages to process documents.
   * @returns Promise resolving to an array of aggregated results.
   * @throws HttpException with appropriate status code if aggregation fails.
   */
  async aggregate(aggregatePipeline: any[]): Promise<any[]> {
    try {
      return await this.options.entityModel.aggregate(aggregatePipeline).exec();
    } catch (err) {
      this.handleDatabaseError(err);
    }
  }

  /**
   * Checks if the database connection for the entity is currently established.
   * @returns Promise resolving to true if connected, false otherwise.
   */
  async isDatabaseConnected(): Promise<boolean> {
    try {
      const isConnected = this.options.entityModel.db.readyState === 1;
      return isConnected;
    } catch {
      return false;
    }
  }

  private handleDatabaseError(error: any): void {
    if (this.options.errLogger) {
      this.logger.error(
        `Database Error: ${error?.name} -  ${error.message || error}`
      );
    }
    let errorMessage = "Database operation failed";
    let errorStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (error.code) {
      case 11000:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = `${Object.values(error.keyValue)[0]} already exists`;
        break;
      case 11001:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "Duplicate key error";
        break;
      case 12000:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "Invalid index specification";
        break;
      case 12010:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "Cannot build index on a non-existing field";
        break;
      case 12102:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "Index key too long";
        break;
      case 12134:
        errorStatusCode = HttpStatus.BAD_REQUEST;
        errorMessage = "Index not found";
        break;
    }

    throw new HttpException(errorMessage, errorStatusCode);
  }
}
