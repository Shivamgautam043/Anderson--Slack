import {execute} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import {getCurrentTimestamp} from "~/global-common-typescript/utilities/utilities";

export async function createContactUsEnquiry(id: string, contactUsEnquiry) {
    execute("INSERT INTO contact_us_responses(id, timestamp, customer_id, response) VALUES($1, TO_TIMESTAMP($2), $3, $4)", [id, getCurrentTimestamp(), null, JSON.stringify(contactUsEnquiry)]);
}
