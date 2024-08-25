import User from "@/app/models/user";
import bcryptjs from "bcryptjs";
import Connection from "@/database/config";

Connection();

export const PUT = async (NextRequest) => {
    try {
        const body = await NextRequest.json();
        const { username, newpassword } = body;

        if (!username || !newpassword) {
            return new Response("Username and New password is required", { status: 401 });
        }

        // Find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(16);
        const hashedPassword = await bcryptjs.hash(newpassword, salt);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        return new Response("Password reset successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("An error occurred while resetting the password", { status: 500 });
    }
};
