import User from "@/app/models/user";
import bcryptjs from "bcryptjs";
import Connection from "@/database/config";

Connection();

export const POST = async(NextRequest)=> {
    try {
        const body = await NextRequest.json();
        const { name, email, username, password } = body;

        if(!name || !email || !username || !password) {
            return new Response("All fields are required to be filled", {status: 401});
        }

        const user = await User.findOne({ username });
        const email_id = await User.findOne({ email });
        if (user) {
            return new Response("Username already exists", {status: 401});
        }
        else if (email_id) {
            return new Response("Email already exists", {status: 401});
        }

        const salt = await bcryptjs.genSalt(16);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();
        return new Response("User registered successfully", {status: 200});
    } catch (error) {
        console.log(error);
    }
}