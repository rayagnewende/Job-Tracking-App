'use client'; 

import ThemeProvider from '@/components/Theme-provider'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


function Providers({children}:{children:React.ReactNode}) {
  const [queryClient] = useState( () => {
    return new QueryClient({
      defaultOptions:{
        queries : {
          staleTime: 60 * 1000 * 5
        }
      }
    })
  })
  return (
    <>
        <ThemeProvider 
attribute='class'
defaultTheme='system'
enableSystem
disableTransitionOnChange
        >
          <Toaster />

          <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools  initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
    </>
  )
}

export default Providers