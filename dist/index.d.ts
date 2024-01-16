/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ClientSession, Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
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
export declare abstract class EntityRepository<T extends Document> {
    protected readonly options: Partial<{
        entityModel: Model<T>;
        logger?: boolean;
    }>;
    private readonly logger;
    /**
     * Constructor for the EntityRepository class.
     * @param options - Configuration options for the repository.
     * @param options.entityModel - Mongoose model representing the entity.
     * @param options.logger - Whether to enable logging (default is false).
     * @throws Error if entityModel is not provided.
     */
    constructor(options?: Partial<{
        entityModel: Model<T>;
        logger?: boolean;
    }>);
    /**
     * Finds documents based on the provided filter query.
     * @param entityFilterQuery - Filter criteria for querying documents.
     * @param projection - Fields to include/exclude from the result.
     * @param options - Additional options such as skip and limit for pagination.
     * @returns Promise resolving to an array of documents.
     */
    find(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>, options?: {
        skip?: number;
        limit?: number;
    }): Promise<T[]>;
    /**
     * Finds a document by its ID.
     * @param id - ID of the document to retrieve.
     * @param projection - Fields to include/exclude from the result.
     * @returns Promise resolving to the found document or null.
     * @throws HttpException with NOT_FOUND status if no document is found.
     */
    findById(id: string, projection?: Record<string, unknown>): Promise<T | null>;
    /**
     * Finds a single document based on the provided filter query.
     * @param entityFilterQuery - Filter criteria for querying the document.
     * @param projection - Fields to include/exclude from the result.
     * @returns Promise resolving to the found document or null.
     */
    findOne(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T | null>;
    /**
     * Performs a full-text search on the specified field.
     * @param searchText - The text to search for.
     * @param searchField - The field to search in.
     * @returns Promise resolving to an array of documents matching the search criteria.
     * @throws HttpException with appropriate status code if the search fails.
     */
    fullTextSearch(searchText: string, searchField: string): Promise<T[]>;
    /**
     * Counts the number of documents based on the provided filter query.
     * @param entityFilterQuery - Filter criteria for counting documents.
     * @returns Promise resolving to the count of matching documents.
     */
    count(entityFilterQuery: FilterQuery<T>): Promise<number>;
    /**
     * Finds distinct values for a specified field based on the provided filter query.
     * @param field - Field for which to find distinct values.
     * @param entityFilterQuery - Filter criteria for finding distinct values.
     * @returns Promise resolving to an array of distinct values.
     */
    distinctValues(field: string, entityFilterQuery?: FilterQuery<T>): Promise<any[]>;
    /**
     * Creates a new document.
     * @param createEntity - Data for creating the new document.
     * @returns Promise resolving to the created document.
     * @throws HttpException with appropriate status code if creation fails.
     */
    create(createEntity: unknown): Promise<(Document<unknown, {}, T> & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | undefined>;
    /**
     * Creates multiple documents.
     * @param createEntities - Array of data for creating the new documents.
     * @returns Promise resolving to an array of the created documents.
     * @throws HttpException with appropriate status code if creation fails for any document.
     */
    createMany(createEntities: unknown[]): Promise<T[]>;
    /**
     * Updates multiple documents based on the provided filter query.
     * @param filterQuery - Filter criteria for updating documents.
     * @param update - Data to update documents with.
     * @returns Promise resolving to the number of updated documents.
     * @throws HttpException with appropriate status code if update fails.
     */
    updateMany(filterQuery: FilterQuery<T>, update: UpdateQuery<unknown>): Promise<number>;
    /**
     * Finds a document by the provided filter query, updates it, and returns the updated document.
     * @param filterQuery - Filter criteria for finding the document to update.
     * @param updatedObject - Data to update the document with.
     * @returns Promise resolving to the updated document or null.
     * @throws HttpException with appropriate status code if update fails.
     */
    findOneAndUpdate(filterQuery: FilterQuery<T>, updatedObject: UpdateQuery<unknown>): Promise<T | null>;
    /**
     * Updates a document by its ID with the provided update data.
     * Uses optimistic concurrency control to handle potential race conditions.
     * @param id - ID of the document to update.
     * @param update - Data to update the document with.
     * @returns Promise resolving to the updated document.
     * @throws HttpException with appropriate status code if update fails.
     */
    updateById(id: string, update: UpdateQuery<T>): Promise<T>;
    /**
     * Deletes a single document based on the provided filter query.
     * @param filterQuery - Filter criteria for deleting the document.
     * @returns Promise resolving to true if the document was deleted, false otherwise.
     * @throws HttpException with appropriate status code if
     */
    deleteOne(filterQuery: FilterQuery<T>): Promise<boolean>;
    /**
     * Deletes multiple documents based on the provided filter query.
     * @param filterQuery - Filter criteria for deleting documents.
     * @returns Promise resolving to true if one or more documents were deleted, false otherwise.
     * @throws HttpException with appropriate status code if deletion fails.
     */
    deleteMany(filterQuery: FilterQuery<T>): Promise<boolean>;
    /**
     * Starts a new database session and transaction.
     * @returns Promise resolving to the started session.
     */
    startTransaction(): Promise<ClientSession>;
    /**
     * Commits the ongoing transaction and ends the provided session.
     * @param session - The database session to commit and end.
     * @throws HttpException with appropriate status code if committing the transaction fails.
     */
    commitTransaction(session: ClientSession): Promise<void>;
    /**
     * Aborts the ongoing transaction and ends the provided session.
     * @param session - The database session to abort and end.
     * @throws HttpException with appropriate status code if aborting the transaction fails.
     */
    abortTransaction(session: ClientSession): Promise<void>;
    /**
     * Ends the provided session without committing or aborting the transaction.
     * @param session - The database session to end.
     */
    endTransaction(session: ClientSession): void;
    /**
     * Executes an aggregation pipeline on the entity's collection.
     * @param aggregatePipeline - Array of stages to process documents.
     * @returns Promise resolving to an array of aggregated results.
     * @throws HttpException with appropriate status code if aggregation fails.
     */
    aggregate(aggregatePipeline: any[]): Promise<any[]>;
    /**
     * Checks if the database connection for the entity is currently established.
     * @returns Promise resolving to true if connected, false otherwise.
     */
    isDatabaseConnected(): Promise<boolean>;
    private handleDatabaseError;
}
//# sourceMappingURL=index.d.ts.map