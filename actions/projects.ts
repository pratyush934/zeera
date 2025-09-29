import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getProjectes(organisationId: string) {
    

    const {userId} = await auth();

    if (!userId) {
        console.log(`there is an issue with userId and please look at this in getProjects`)
        return null
    }

    console.log(organisationId)
}