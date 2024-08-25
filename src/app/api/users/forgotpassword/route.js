import { NextResponse } from "next/server";
import User from "@/app/models/user";
import Connection from "@/database/config";

Connection();

export async function GET(request) {
    try {
        // Extract the username from the query parameters
        const username = request.nextUrl.searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Check if the username exists in the database
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User found", user: { username: user.username } }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// This allows the route to be statically optimized
export const dynamic = 'force-dynamic';