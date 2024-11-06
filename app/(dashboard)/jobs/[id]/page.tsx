import EditJobForm from '@/components/EditJobForm'
import { getSingleJobAction } from '@/utils/actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

async function page({params}: {params:{id:string}}) {


    const newQuery = new QueryClient() ; 

    await newQuery.prefetchQuery({
        queryKey:['job', params.id], 
        queryFn : () => getSingleJobAction(params.id)
    }); 

  return (
    <HydrationBoundary state={dehydrate(newQuery)}>
        <EditJobForm   jobId={params.id} />
    </HydrationBoundary>
  )
}

export default page