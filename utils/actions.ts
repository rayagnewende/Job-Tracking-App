'use server';

import { auth } from "@clerk/nextjs";
import prisma from "./db";
import { createAndEditJobSchema, CreateAndEditJobType, JobType } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";



function authenticateAndRedirect() {

    const userId = auth().userId; 
    if(!userId) redirect("/"); 

    return userId ; 
}

 export async function createJobAction(values:CreateAndEditJobType):Promise<JobType | null>{
     const userId = authenticateAndRedirect(); 
     createAndEditJobSchema.parse(values); 
    try {
        const job:JobType = await prisma.job.create({
            data:{
                ...values,clerkId:userId
            }
        }); 
        return job; 
    } catch (error) {
        console.log(error);
        return null;
    }

}

type GetAllJobsActions = {
    search?: string, 
    jobstatus?:string, 
    page?:number, 
    limit?:number
} ; 

export async function getAllJobsActions({ search,jobstatus,page=1,limit=10}:GetAllJobsActions):Promise<{
    jobs:JobType[], 
    count:number, 
    page:number, 
    totalPages:number
}> {
     const userId = authenticateAndRedirect(); 
    

    try {
        let whereClause:Prisma.JobWhereInput = {
            clerkId: userId
        };

        if(search)
        {
            whereClause = {
                ...whereClause,
                OR : [
                   {
                    position: {
                        contains: search 
                    }, 
                   }, 
                   {
                    company:{
                     contains : search

                    }
                   }
                ]
            }
        }

        if( jobstatus && jobstatus !== "all")
        {
            whereClause = {
                ...whereClause, 
                status:jobstatus
            }
        }

        const jobs:JobType[] = await prisma.job.findMany({
            where: whereClause, 
            orderBy : {
                createdAt : 'desc'
            }
        }); 


      return { jobs,count:0,page:1, totalPages:0 } ;

    } catch (error) {
         console.log('====================================');
         console.log(error);
         console.log('====================================');
        return { jobs:[],count:0,page:1, totalPages:0 } ;

    }
}

export async function deleteJobAction(id:string):Promise<JobType | null> {

    const userId = authenticateAndRedirect(); 

    try {
        const job:JobType = await prisma.job.delete({
            where: {
                id, 
                clerkId: userId
            }
        }); 
        return job ; 
    } catch (error) {
        console.log(error);
        return null ; 
    }
    
}

export async function getSingleJobAction(id:string):Promise<JobType | null> {

    const userId = authenticateAndRedirect();

    try {
        const job:JobType = await prisma.job.findUnique({
            where : {
                id, 
                clerkId : userId
            }
        }); 
        return job ; 
    } catch (error) {
      console.log(error);
      return null ; 
        
    }

}


export async function updateJobAction(id:string, values:CreateAndEditJobType):Promise<JobType | null> {

    const userId = authenticateAndRedirect();


    try {
        const job:JobType = await prisma.job.update({
            where : {
                id, 
                clerkId:userId
            }, 
            data : {
                ...values
            }
        }); 
        return job ; 
    } catch (error) {
      console.log(error);
      return null ; 
        
    }

}