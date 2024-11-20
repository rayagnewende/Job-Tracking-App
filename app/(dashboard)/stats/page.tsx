import ChartsContainer from '@/components/ChartsContainer';
import { StatsLoadingCard } from '@/components/StatsCard';
import StatsContainer from '@/components/StatsContainer';
import { getChartsAction, getStatsAction } from '@/utils/actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React from 'react'

const statsPage = async () => {

  const queryClient = new QueryClient(); 

await queryClient.prefetchQuery({
  queryKey: ['stats'], 
  queryFn : () => getStatsAction()
}) ; 

await queryClient.prefetchQuery({
  queryKey: ['charts'], 
  queryFn : () => getChartsAction()
}) ; 


  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsLoadingCard />
      <StatsContainer  />
      <ChartsContainer />
    </HydrationBoundary>
  )
}

export default statsPage; 