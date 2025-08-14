// ---------------------------------
// src/app/api/bills/route.ts (Mock API)
// ---------------------------------
import { NextResponse } from "next/server";
import { Bill } from "@/lib/types";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("query") || "").toLowerCase();
    const days = Number(searchParams.get("days") || 7);
    const now = Date.now();

    const data: Bill[] = [
        {
            bill_id: "hr-1234-118",
            number: "H.R. 1234",
            title: "Clean Energy Tax Incentives Act",
            chamber: "house",
            scheduled_date: new Date(now + 1000 * 60 * 60 * 24 * 3).toISOString(),
            latest_action: "Placed on the Union Calendar."
        },
        {
            bill_id: "s-567-118",
            number: "S. 567",
            title: "Affordable Housing Acceleration Act",
            chamber: "senate",
            scheduled_date: new Date(now + 1000 * 60 * 60 * 24 * 5).toISOString(),
            latest_action: "Placed on Senate Legislative Calendar."
        },
    ];

    const soon = data.filter(b => {
        const when = b.scheduled_date ? new Date(b.scheduled_date).getTime() : Infinity;
        return when - now <= days * 24 * 60 * 60 * 1000;
    });

    const filtered = q
        ? soon.filter(b => `${b.number} ${b.title}`.toLowerCase().includes(q))
        : soon;

    filtered.sort((a, b) => {
        const ad = a.scheduled_date ? new Date(a.scheduled_date).getTime() : Infinity;
        const bd = b.scheduled_date ? new Date(b.scheduled_date).getTime() : Infinity;
        return ad - bd;
    });

    return NextResponse.json(filtered);
}
