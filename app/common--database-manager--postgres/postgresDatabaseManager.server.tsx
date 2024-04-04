import type {QueryResult} from "pg";
import pg from "pg";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {getErrorFromUnknown, getIntegerFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";
const {Pool} = pg;

declare global {
    // eslint-disable-next-line no-var
    var _postgresDatabaseCredentialsResolver: (id: Uuid | null) => PostgresDatabaseCredentials | Error;
    // eslint-disable-next-line no-var
    var _postgresDatabaseManagers: Map<Uuid | null, PostgresDatabaseManager> | null;
}

export type PostgresDatabaseCredentials = {
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
};

export enum TransactionCommand {
    Begin = "BEGIN",
    Commit = "COMMIT",
    Rollback = "ROLLBACK",
}

export class PostgresDatabaseManager {
    databaseConnectionPool: pg.Pool;

    constructor(databaseConnectionPool: pg.Pool) {
        this.databaseConnectionPool = databaseConnectionPool;
    }

    // TODO: Rename to something better
    // @ts-ignore
    async execute(query: string, queryArguments?: Array<unknown>): Promise<QueryResult<unknown> | Error> {
        try {
            const response = await this.databaseConnectionPool.query(query, queryArguments);
            // @ts-ignore
            return response as QueryResult<unknown>;
        } catch (error_: unknown) {
            const error = getErrorFromUnknown(error_);
            // logBackendError(error);
            return error;
        }
    }

    async executeTransactionCommand(transactionCommand: TransactionCommand) {
        const transactionResult = await this.execute(transactionCommand);
        if (transactionResult instanceof Error) {
            const message = `PANIC - Failed to execute transaction command ${transactionCommand}: ${transactionResult.message}`;
            console.log(message);
            throw new Error(message);
        }
    }
}

export async function getPostgresDatabaseManager(id: Uuid | null): Promise<PostgresDatabaseManager | Error> {
    if (global._postgresDatabaseManagers == null) {
        global._postgresDatabaseManagers = new Map<Uuid, PostgresDatabaseManager>();
    }

    if (!global._postgresDatabaseManagers.has(id)) {
        if (global._postgresDatabaseCredentialsResolver == null) {
            return Error("edc6b564-0c19-43d6-ad07-74601e74f4c2");
        }

        const postgresDatabaseCredentials = global._postgresDatabaseCredentialsResolver(id);

        if (postgresDatabaseCredentials instanceof Error) {
            return postgresDatabaseCredentials;
        }

        const databaseConnectionPool = await getNewDatabaseConnectionPool(postgresDatabaseCredentials);
        if (databaseConnectionPool instanceof Error) {
            return databaseConnectionPool;
        }

        global._postgresDatabaseManagers.set(id, new PostgresDatabaseManager(databaseConnectionPool));
    } else {
        // TODO: Ensure the connection is valid, otherwise refresh it
    }

    // @ts-ignore
    return global._postgresDatabaseManagers.get(id);
}

export async function getNewDatabaseConnectionPool(credentials: PostgresDatabaseCredentials): Promise<pg.Pool | Error> {
    // TODO: Do some error handling here?
    const databaseConnectionPool = new Pool({
        host: credentials.DB_HOST,
        port: getIntegerFromUnknown(credentials.DB_PORT),
        database: credentials.DB_NAME,
        user: credentials.DB_USERNAME,
        password: credentials.DB_PASSWORD,
    });

    return databaseConnectionPool;
}
