import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import {generateUuid, getCurrentIsoTimestamp} from "~/global-common-typescript/utilities/utilities";

export async function subscribeUser(emailId: string): Promise<Error | null> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                public.email_subscription
            WHERE
                email_id = $1
        `,
        [emailId],
    );
    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount != 0) {
        await postgresDatabaseManager.execute(
            `
                UPDATE
                    public.email_subscription
                SET
                    update_timestamp =$1
                WHERE
                    email_id = $2
            `,
            [getCurrentIsoTimestamp(), emailId],
        );

        return new Error("Email Id already Present");
    }

    const insertResult = await postgresDatabaseManager.execute(
        `INSERT INTO
            public.email_subscription
        VALUES(
            $1,
            $2,
            $3,
            $4
        )
        `,
        [generateUuid(), getCurrentIsoTimestamp(), getCurrentIsoTimestamp(), emailId],
    );
    if (insertResult instanceof Error) {
        return insertResult;
    }

    return null;
}

export async function insertCampaignLead(websiteUrl: string, emailId: string): Promise<Error | null> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const insertResult = await postgresDatabaseManager.execute(
        `INSERT INTO
            public.campaign_form_leads
        VALUES(
            $1,
            $2,
            $3,
            $4
        )
        `,
        [generateUuid(), websiteUrl, emailId, getCurrentIsoTimestamp()],
    );
    if (insertResult instanceof Error) {
        return insertResult;
    }

    return null;
}
