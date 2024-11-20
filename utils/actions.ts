'use server';

import { auth } from "@clerk/nextjs";
import prisma from "./db";
import { createAndEditJobSchema, CreateAndEditJobType, JobType } from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import  dayjs from 'dayjs' ; 


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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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


export async function getStatsAction():Promise<{
    pending:number, 
    interview:number,
    declined:number
}>{

    const userId = authenticateAndRedirect(); 

    try {
        const data = await prisma.job.groupBy({
            where :{
                clerkId : userId
            }, 
            by: ['status'], 
            _count : {
                status: true
            }
        })
        const statsObject = data.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
          }, {} as Record<string, number>);
      
          const defaultStats = {
            pending: 0,
            declined: 0,
            interview: 0,
            ...statsObject,
          };
          return defaultStats;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        redirect('/jobs'); 
    }

}



export async function getChartsAction(): Promise<Array<{date:string, count:number}>>{

    const userId = authenticateAndRedirect(); 
    const sixMonthsAgo = dayjs().subtract(6, 'month').toDate(); 
    try {
        const jobs = await prisma.job.findMany({
          where: {
            clerkId: userId,
            createdAt: {
              gte: sixMonthsAgo,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });
    
        // eslint-disable-next-line prefer-const
        let applicationsPerMonth = jobs.reduce((acc, job) => {
          const date = dayjs(job.createdAt).format("MMM YY");
    
          const existingEntry = acc.find((entry) => entry.date === date);
    
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            acc.push({ date, count: 1 });
          }
    
          return acc;
        }, [] as Array<{ date: string; count: number }>);
    
        return applicationsPerMonth;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        redirect("/jobs");
      }
    
}