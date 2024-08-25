import User from "@/app/models/user";
import bcryptjs from "bcryptjs";
import Connection from "@/database/config";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";

Connection();

export const POST = async(NextRequest)=> {
    try {
        const body = await NextRequest.json();
        const { username, password } = body;

        if( !username || !password) {
            return new Response("All fields are required to be filled", {status: 400});
        }

        const user = await User.findOne({ username });

        if (!user) {
            return new Response("User doesnot exists", {status: 401});
        }
        
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return new Response("Invalid Password", {status: 401});
        }
        
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, { expiresIn: '1d' }); 

        const response = NextResponse.json({ message: 'login successfully' });

        response.cookies.set('token', token, { httpOnly: true });

        return response;

    } catch (error) {
        console.log(error);
        return new Response("Something went wrong", {status: 500});
    }
}