import { NextResponse } from "next/server";
import User from "@/app/models/user";
import Connection from "@/database/config";

Connection();

export async function POST(request) {
    try {
        const { username, otp } = await request.json();

        if (!username || !otp) {
            return NextResponse.json({ error: "Username and OTP are required" }, { status: 400 });
        }

        //Check if OTP exists and is valid
        if(!global.otpStorage || !global.otpStorage[username]) {
            return NextResponse.json({ error: "Invalid or expired OTP"}, {status: 400});
        }

        const storedOTP = global.otpStorage[username];

        if(storedOTP.expiresAt < Date.now()) {
            delete global.otpStorage[username];
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        if(storedOTP.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        delete global.otpStorage[username];

        return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
