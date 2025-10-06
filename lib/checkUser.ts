import { currentUser } from "@clerk/nextjs/server";
import db from "./prisma";

export const CheckUser = async () => {
  try {
    // Add some debugging info
    console.log('Attempting to get current user from Clerk...');
    
    // Check if we're in a server environment
    if (typeof window !== 'undefined') {
      console.warn('CheckUser called on client side, this should only run on server');
      return null;
    }
    
    const user = await currentUser();
    console.log('User retrieved:', user ? 'User found' : 'No user');

    if (!user) {
      console.log(`The user in CheckUser do not exist`);
      return null;
    }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) return loggedInUser;

    const name = `${user.firstName || 'User'} ${user.lastName || ''}`.trim() || user.username || 'Unknown User';

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl || '',
        email: user.emailAddresses?.[0]?.emailAddress || '',
      },
    });

    return newUser;
    } catch (error) {
      console.log(
        `there is an error in CheckUser , Please look at this ${error}`
      );
      return null;
    }
  } catch (clerkError) {
    console.error('Error calling currentUser() from Clerk:');
    console.error('Error details:', clerkError);
    console.error('Error message:', clerkError instanceof Error ? clerkError.message : 'Unknown error');
    console.error('Error stack:', clerkError instanceof Error ? clerkError.stack : 'No stack trace');
    
    // Check environment variables
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    console.error('Clerk environment check:');
    console.error('CLERK_SECRET_KEY present:', !!clerkSecretKey);
    console.error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY present:', !!clerkPublishableKey);
    
    return null;
  }
};
