interface Lead {
    collectionId: string;
    collectionName: string;
    id: string;
    Listing: string; // Assuming RELATION_RECORD_ID is a string representing the record ID
    Info: string; // Assuming RELATION_RECORD_ID is a string representing the record ID
    Status: string;
    Date: string; // ISO 8601 string
    created: string; // ISO 8601 string
    updated: string; // ISO 8601 string
}
export default Lead