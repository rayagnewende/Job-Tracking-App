import CreateJobForm from '@/components/CreateJobForm'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

const addJob = () => {
  const queryClient = new QueryClient(); 

  return (
    <div className=''>
      <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateJobForm  />
      </HydrationBoundary>
     
    </div>
  )
}

export default addJob