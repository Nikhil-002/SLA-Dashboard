import { prismaClient } from "@/app/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if(!projectId) {
        return NextResponse.json({
            error : "Project ID is required"
        },{
            status : 400
        })
    }

    try {
        const slaEntries = await prismaClient.sLAEntry.findMany({
            where: {
                projectId: Number.parseInt(projectId),
            },
            include: {
                slaType: true,
            },
            orderBy: {
                date : "desc"
            }
        })
        console.log("slaEntries", slaEntries);
        
        const groupedData = slaEntries.reduce((acc: any, entry) => {
            const dateKey = entry.date.toISOString().split("T")[0]

            if(!acc[dateKey]) {
                acc[dateKey] = {
                    date : entry.date.toISOString(),
                    projectId: entry.projectId
                }
            }

            const {category, hours} = entry.slaType
            let fieldName = ""

            if(category === "BLP") {
                fieldName = `blp_${hours}h`
            }
            else if(category === "DLP"){
                fieldName = `dlp_${hours}h`
            }
            else if(category === "Billing") {
                fieldName = `billing_${hours}h`
            }

            if(fieldName) {
                acc[dateKey][fieldName] = entry.slaValue;
            }
            console.log("acc", acc);
            
            return acc
        },{})
        console.log("groupedData: ", groupedData);

        const result = Object.values(groupedData);
        console.log("result: ", result);
        
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching SLA data", error)
        return NextResponse.json({
            error : "Failed to fetch SLA data"
        },{
            status: 500
        })
    }
}