import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { Client } from "pg";
import { Prisma } from "@prisma/client";
import { prismaClient } from "@/app/lib/db";

export async function GET() {
    try{
        const s3 = new S3Client({region: process.env.AWS_REGION})

        const s3command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: process.env.S3_KEY,
        });

        const S3Response = await s3.send(s3command);
        const stream = S3Response.Body as Readable;

        let jsonString = "";
        for await (const chunk of stream) {
            jsonString += chunk.toString();
        }

        let cleanString = jsonString.trim();

        // Optional: remove BOM if present
        // if (cleanString.charCodeAt(0) === 0xfeff) {
        // cleanString = cleanString.slice(1);
        // }

        // console.log("Before parsed JSON:", jsonString.slice(0,200));

        const records = JSON.parse(cleanString);
        console.log("Extracted data from S3 bucket");
        console.log("Parsed JSON:", records);
        

        for(const record of records) {
            // console.log(,record.slaTypeId,record.slaValue,new Date());
            const projectId = record.projectId
            const slaTypeId = record.slaTypeId
            const slaValue = record.slaValue
            const ReportDate = record.ReportDate
            // console.log(ReportDate.toISOString());
            

            await prismaClient.sLAEntry.create({
                data: {
                    projectId,
                    slaTypeId,
                    slaValue,
                    date: new Date( ReportDate).toISOString()                
                }
            })
        }
        console.log("Saved to table succesfullyy....");
        
        return NextResponse.json({
            messaage : "Imported Successfully."
        })
        
    } catch (err) {
    console.error("Import Error:", err);
    return NextResponse.json({ error: "Failed to import data" }, { status: 500 });
  }
}