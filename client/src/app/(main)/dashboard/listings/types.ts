interface Listing {
    collectionId: string;
    collectionName: string;
    id: string;
    Buisness_Name: string;
    Confidential_Listing_Name: string;
    Location: string;
    Asking_Price: number;
    Commission_Percentage: number;
    Agents_Split: number;
    Date_Listed: string;
    Inquiry_Calls_Taken: number;
    Current_Stage: string;
    Day_Stage_Changed: string;
    Status: string;
    Broker_Assigned: string;
    Owner_Name: string;
    Owner_Email: string;
    Owner_Phone: number;
    Description: string;
    created: string;
    updated: string;
    BizBuySell_Listing_Link: string;
    BizDepot_Listing_Link: string;
    Drive_Link: string;
  }
type ListingsType = Listing[];

export type {ListingsType, Listing}
  