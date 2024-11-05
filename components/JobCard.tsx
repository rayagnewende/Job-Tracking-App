/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import Link from 'next/link'
import JobInfo from './JobInfo'
import {  Briefcase, CalendarDays, MapPin, RadioTower } from 'lucide-react'
import { Badge } from './ui/badge'
import DeleteJobBtn from './DeleteJobBtn'
//import { JobType } from '@/utils/types'

const JobCard = (props:any) => {

    const date = new Date(props.createdAt).toLocaleDateString(); 
   
  return (
    <div className="bg-muted">
        <CardHeader>
            <CardTitle>{props.position}</CardTitle>
            <CardDescription>{props.company}</CardDescription> 
        </CardHeader>
        <Separator   />
        <CardContent className=' grid grid-cols-2 gap-2'>
             <JobInfo icon={<Briefcase />} text={props.mode}   />
             <JobInfo icon={<MapPin />} text={props.location}   />
             <JobInfo icon={<CalendarDays />} text={date}   />
             <Badge className="w-32 justify-center">
             <JobInfo icon={<RadioTower  className='w-4 h-4'/>} text={props.status}   />
             </Badge>
        </CardContent>
        <CardFooter className='flex gap-4'>
            <Button asChild size="sm">
              <Link href={`/jobs/${props.id}`}>Edit</Link>
            </Button>
            <DeleteJobBtn id={props.id} />
        </CardFooter>
    
    </div>
  )
}

export default JobCard