'use client' 
import { createAndEditJobSchema, CreateAndEditJobType, JobMode, JobStatus } from '@/utils/types'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"; 
import {  useForm } from 'react-hook-form'
import { CustomFormField, CustomFormSelect } from './FormComponents';
import { Button } from './ui/button';
import { Form } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createJobAction } from '@/utils/actions';

function CreateJobForm() {
    const form = useForm<CreateAndEditJobType>({
        resolver: zodResolver(createAndEditJobSchema), 
        defaultValues: {
            position:"", 
            company:'', 
            location:'', 
            status:JobStatus.Pending, 
            mode:JobMode.FullTime
        }
    }); 

    const queryClient = useQueryClient(); 
    const router = useRouter(); 
    const { toast} = useToast();

    const { mutate , isPending } = useMutation({
        mutationFn:(values:CreateAndEditJobType) => createJobAction(values), 
        onSuccess: data => {
            if(!data){
                toast({ description : 'there has been an error  '}); 
                return ; 
            }
            toast({ description : 'Job had been successfully created! '}); 
            queryClient.invalidateQueries({ queryKey : ['jobs']}); 
            queryClient.invalidateQueries({ queryKey : ['stats']}); 
            queryClient.invalidateQueries({ queryKey : ['charts']}); 

            router.push('/jobs'); 
        }
    })

    function onSubmit(values:CreateAndEditJobType) {
    
        mutate(values);
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className='bg-muted p-8 rounded'>
        <h2 className="capitalize text-4xl font-semibold mb-6">Add Job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
            <CustomFormField  name="position" control={form.control} />
            <CustomFormField  name="company" control={form.control} />
            <CustomFormField  name="location" control={form.control} />

           <CustomFormSelect
                name='status' 
                control={form.control} 
                labelText="job status" 
                items={Object.values(JobStatus)}
            />

<CustomFormSelect
                name='mode' 
                control={form.control} 
                labelText="job mode" 
                items={Object.values(JobMode)}
            />
        <Button className='self-end capitalize'>
            {
                isPending ? 'loading': 'Create Job'
            }
        </Button>

        </div>
        </form>
    </Form>
  )
}

export default CreateJobForm