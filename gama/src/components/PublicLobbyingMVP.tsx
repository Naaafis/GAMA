// ---------------------------------
// src/components/PublicLobbyingMVP.tsx (Client component)
// ---------------------------------
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CalendarDays, Landmark, Shirt } from "lucide-react";
import type { Bill, Influencer, MerchItem } from "@/lib/types";

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

function money(cents: number) {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function PublicLobbyingMVP() {
    const [q, setQ] = useState("");
    const [bills, setBills] = useState<Bill[]>([]);
    const [active, setActive] = useState<Bill | null>(null);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [merch, setMerch] = useState<MerchItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const bs = await fetchJSON<Bill[]>(`/api/bills?query=${encodeURIComponent(q)}&days=14`);
            setBills(bs);
            setActive(bs[0] ?? null);
        } catch (e: any) {
            setError(e.message || "Failed to load bills");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBills();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!active) return;
        (async () => {
            try {
                const [infl, merchItems] = await Promise.all([
                    fetchJSON<Influencer[]>(`/api/influence?bill_id=${active.bill_id}`),
                    fetchJSON<MerchItem[]>(`/api/merch?bill_id=${active.bill_id}`),
                ]);
                setInfluencers(infl);
                setMerch(merchItems);
            } catch (e: any) {
                setError(e.message || "Failed to load details");
            }
        })();
    }, [active]);

    return (
        <div className="min-h-screen p-6 md:p-10 bg-neutral-50 text-neutral-900">
            <header className="flex items-center gap-3 mb-6">
                <Landmark className="h-7 w-7" />
                <h1 className="text-2xl md:text-3xl font-semibold">Civic Threads — Public Lobbying MVP</h1>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bills List */}
                <Card className="lg:col-span-1 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            <h2 className="text-lg font-medium">Bills up for votes</h2>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Search bills (e.g., clean energy)" value={q} onChange={(e) => setQ(e.target.value)} />
                            <Button onClick={loadBills}>Search</Button>
                        </div>
                        {loading && <div className="text-sm text-neutral-600">Loading…</div>}
                        {error && <div className="text-sm text-red-600">{error}</div>}
                        <ul className="space-y-3">
                            {bills.map((b) => (
                                <li key={b.bill_id}>
                                    <button onClick={() => setActive(b)} className={`w-full text-left p-3 rounded-xl hover:bg-neutral-100 transition ${active?.bill_id === b.bill_id ? "bg-neutral-100" : ""}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">{b.number} · {b.title}</div>
                                            <Badge variant={b.chamber === "house" ? "secondary" : "default"}>{b.chamber.toUpperCase()}</Badge>
                                        </div>
                                        <div className="text-sm text-neutral-600 mt-1">
                                            {b.scheduled_date ? (
                                                <>Scheduled: {new Date(b.scheduled_date).toLocaleString()}</>
                                            ) : (
                                                <>Not scheduled</>
                                            )}
                                        </div>
                                        {b.latest_action && <div className="text-xs text-neutral-500 mt-1">{b.latest_action}</div>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Influencers */}
                <Card className="lg:col-span-1 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Landmark className="h-5 w-5" />
                            <h2 className="text-lg font-medium">Most influential lawmakers</h2>
                        </div>
                        {!active ? (
                            <p className="text-sm text-neutral-600">Select a bill to see who matters most.</p>
                        ) : (
                            <div className="space-y-3">
                                {influencers.map((m) => (
                                    <div key={m.bioguide_id} className="p-3 rounded-xl border bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">{m.name}</div>
                                            <Badge>{m.influence_score.toFixed(0)}</Badge>
                                        </div>
                                        <div className="text-sm text-neutral-700">{m.role} • {m.chamber.toUpperCase()}</div>
                                        <div className="text-sm text-neutral-600 mt-1">{m.rationale}</div>
                                        <div className="mt-2 flex gap-2">
                                            <Button variant="secondary" size="sm">View Voting History</Button>
                                            <Button variant="secondary" size="sm">Contact Office</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Merch */}
                <Card className="lg:col-span-1 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Shirt className="h-5 w-5" />
                            <h2 className="text-lg font-medium">Merch that supports this bill</h2>
                        </div>
                        {!active ? (
                            <p className="text-sm text-neutral-600">Pick a bill to see merch that funds the advocacy.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {merch.map((m) => (
                                    <div key={m.id} className="rounded-xl border overflow-hidden bg-white">
                                        <img src={m.image_url} alt={m.name} className="w-full h-40 object-cover" />
                                        <div className="p-3">
                                            <div className="font-medium">{m.name}</div>
                                            <div className="text-sm text-neutral-600">{money(m.price_cents)}</div>
                                            <Button className="mt-2 w-full"><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <footer className="mt-10 text-xs text-neutral-500">
                <p>
                    Demo data via Next.js Route Handlers. Swap /api/* to your backend aggregator (Congress.gov/govinfo calendars, House Clerk, ProPublica Congress, OpenStates). Add Stripe for checkout.
                </p>
            </footer>
        </div>
    );
}
