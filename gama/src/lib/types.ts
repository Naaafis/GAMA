// ---------------------------------
// src/lib/types.ts
// ---------------------------------
export interface Bill {
    bill_id: string;
    number: string;
    title: string;
    chamber: "house" | "senate";
    scheduled_date?: string;
    latest_action?: string;
    committees?: string[];
}

export interface Influencer {
    bioguide_id: string;
    name: string;
    chamber: "house" | "senate";
    role: string;
    influence_score: number;
    rationale: string;
}

export interface MerchItem {
    id: string;
    name: string;
    price_cents: number;
    image_url: string;
    supports_bill_id: string;
}
