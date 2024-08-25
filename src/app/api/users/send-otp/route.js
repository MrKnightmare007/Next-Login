import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '@/app/models/user';
import Connection from '@/database/config';

Connection(); // Initialize database connection

export async function POST(request) {
    try {
        // Parse the request body
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Check if the username exists in the database
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate a 6-digit OTP using crypto
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store the OTP temporarily in memory (for simplicity)
        if (!global.otpStorage) {
            global.otpStorage = {};
        }
        // In a real-world scenario, this should be stored securely
        global.otpStorage[username] = {
            otp,
            email: user.email,
            expiresAt: Date.now() + 300000, // 5 minutes from now
        };

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other email services
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verification Code for Password Reset',
            text: `Your OTP is: ${otp}`,
        });

        return NextResponse.json({ message: "OTP sent to email", email: user.email }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
