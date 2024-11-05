'use client'; 
import React from 'react'
import { Select } from './ui/select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'; 
import { JobStatus } from '@/utils/types'
import { Button } from './ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SearchForm = () => {
  const searchParams = useSearchParams() ; 
  const search = searchParams.get('search') || ''; 
  const jobStatus = searchParams.get('jobStatus') || ''; 


  const router = useRouter(); 
  const pathname = usePathname(); 

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const formData = new FormData(e.currentTarget) ; 
    const search = formData.get("search") as string ; 
    const jobStatus = formData.get("jobStatus") as string ; 

    const params = new URLSearchParams(); 
    params.set("search", search); 
    params.set("jobStatus", jobStatus); 

    router.push(`${pathname}?${params.toString()}`); 
  }
  return (
    <form onSubmit={handleSubmit} action="" className=" bg-muted mb-6 p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg">
        <input type="text" name="search" className='' placeholder='Search Job' defaultValue={search}/>
        <Select name="jobStatus" defaultValue={jobStatus}>
           <SelectTrigger>
              <SelectValue />
           </SelectTrigger>
           <SelectContent>
             {
              ["all", ...Object.values(JobStatus)].map( jobStatus => {
                return <SelectItem key={jobStatus} value={jobStatus}>{jobStatus }</SelectItem>
              })
             }
           </SelectContent>
        </Select>
        <Button type='submit'>Search</Button>
    </form>
  )
}

export default SearchForm