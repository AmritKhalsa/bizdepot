'use server';
import pb from "../../../../../connections/pocketbase";
import { cache } from 'react';

import Listings from "./ListingClientPage";
import {ListingsType} from "./types"

interface PBrequest {
  status: string,
  items: ListingsType,
}

// Move getListings outside of the Page component to define it at the module level
const getListings = cache(async () => {
    
      const listings = await pb.collection('Listings').getFullList<PBrequest>({
        sort: 'Status',
        expand: 'Broker_Assigned',
        filter: "Broker_Assigned='7dszznjk9aan5kw'",

      }).catch((err) => {
        console.log(err)
        return [];
      });
      return listings;
    
  });

export default async function Page() {

    const listingsData = await getListings();
    return (
    <Listings listing={listingsData} />
    );
}
