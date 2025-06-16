import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const projects = await prismaClient.project.findMany({
            select: {
                id:true,
                name: true
            },
            orderBy: {
                name: "asc"
            }
        })
        console.log("Projects: ",projects);
        
        return NextResponse.json(projects)
    } catch (error) {
        console.error("Error fetching the projects:", error)
        return NextResponse.json({
            error: "Failed to fetch projects"
        },{
            status:500
        })
    } 
}