import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/app/models/user";
import Connection from "@/database/config";

Connection();

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
      const user = await User.findById(decodedToken.id).select('name username email');

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
      const user = await User.findById(decodedToken.id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      await user.deleteOne();

      const response = NextResponse.json({ message: "User deleted successfully" });
      response.cookies.set('token', '', { maxAge: -1 });
      
      return response;

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}