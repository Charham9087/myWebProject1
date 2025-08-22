"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markAsRead } from "@/server/customer_queries"; // ✅ Adjust path if needed

export default function AdminNotificationsPage({ initialQueries }) {
    const [queries, setQueries] = useState(initialQueries);
    const router = useRouter();

    const handleMarkAsRead = async (id) => {
        const success = await markAsRead(id); // ✅ Server action
        if (success) {
            // ✅ Update state: mark the matching query as read
            setQueries((prev) =>
                prev.map((q) =>
                    q._id === id ? { ...q, isRead: true } : q
                )
            );
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">Customer Notifications</h1>

            {queries.length === 0 ? (
                <p className="text-center text-gray-500">No notifications.</p>
            ) : (
                queries.map((query) => (
                    <Card key={query._id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{query.name}</span>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{query.formattedDate}</Badge>
                                    {query.isRead && (
                                        <Badge className="bg-green-100 text-green-800">Read</Badge>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p><strong>Email:</strong> {query.email}</p>
                            <p><strong>Phone:</strong> {query.phone}</p>
                            <p><strong>Message:</strong> {query.message}</p>

                            {!query.isRead && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => handleMarkAsRead(query._id)}
                                >
                                    Mark as Read
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

export const dynamic = "force-dynamic"; 
// ensures page is rendered on server at runtime, not build

