'use client'
import { getAllJobsActions } from '@/utils/actions';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import JobCard from './JobCard';

const JobList = () => {
  const searchParams = useSearchParams() ; 
  const search = searchParams.get('search') || ''; 
  const jobstatus = searchParams.get('jobStatus') || 'all'; 
  const page = Number(searchParams.get('page')) || 1; 

  const { data, isPending } = useQuery({
    queryKey: ['jobs', search, jobstatus, page],
    queryFn: () => getAllJobsActions({search,jobstatus,page}),
  });

  const jobs = data?.jobs || [] ; 

  if(isPending) return <h2 className='text-xl'>Wait please ...</h2> ;
  if(jobs.length < 1 ) return <h2 className='text-xl'>Job not find !</h2>
  return (
    <div className='grid md:grid-cols-2 gap-4 '>
     {
      jobs.map( job => { 
        return <JobCard   key={job.id}  { ...job} />
      })
     }
    </div>
  )
}

export default JobList