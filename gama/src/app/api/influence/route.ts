// ---------------------------------
// src/app/api/influence/route.ts (Mock API)
// ---------------------------------
import { NextResponse } from "next/server";
import { Influencer } from "@/lib/types";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const bill_id = searchParams.get("bill_id");
    if (!bill_id) return NextResponse.json({ error: "bill_id required" }, { status: 400 });

    const data: Influencer[] = [
        {
            bioguide_id: "A000360",
            name: "Rep. Jane Alvarez",
            chamber: "house",
            role: "Majority Whip",
            influence_score: 92,
            rationale: "Controls whip operations; can secure swing votes in majority caucus."
        },
        {
            bioguide_id: "B001234",
            name: "Rep. Tom Bennett",
            chamber: "house",
            role: "Rules Committee",
            influence_score: 84,
            rationale: "Member of Rules; shapes floor terms for debate and amendments."
        }
    ];

    return NextResponse.json(data);
}
