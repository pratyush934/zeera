import { currentUser } from "@clerk/nextjs/server";
import db from "./prisma";

export const CheckUser = async () => {
  const user = await currentUser();

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

    const name = `${user.firstName}-${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.log(
      `there is an error in CheckUser , Please look at this ${error}`
    );
    return;
  }
};
