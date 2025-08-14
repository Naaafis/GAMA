// ---------------------------------
// src/app/api/merch/route.ts (Mock API)
// ---------------------------------
import { NextResponse } from "next/server";
import { MerchItem } from "@/lib/types";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bill_id = searchParams.get("bill_id");

    const all: MerchItem[] = [
        {
            id: "tee-clean-energy",
            name: "Clean Energy Tee",
            price_cents: 3200,
            image_url: "https://placehold.co/600x400",
            supports_bill_id: "hr-1234-118"
        },
        {
            id: "hat-housing",
            name: "Housing Now Cap",
            price_cents: 2800,
            image_url: "https://placehold.co/600x400",
            supports_bill_id: "s-567-118"
        }
    ];

    const items = bill_id ? all.filter(m => m.supports_bill_id === bill_id) : all;
    return NextResponse.json(items);
}
