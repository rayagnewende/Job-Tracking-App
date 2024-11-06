'use client'; 

import { useToast } from '@/hooks/use-toast'
import { getSingleJobAction, updateJobAction } from '@/utils/actions';
import { createAndEditJobSchema, CreateAndEditJobType, JobMode, JobStatus } from '@/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { CustomFormField, CustomFormSelect } from './FormComponents';
import { Button } from './ui/button';
import { Form } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const EditJobForm = ({jobId}:{ jobId: string}) => {
    const { toast} = useToast(); 
    const router = useRouter(); 
    const queryClient = useQueryClient() ; 

    // récupérer les informations du job à modifier 
    const { data} = useQuery({
        queryKey:['job', jobId], 
        queryFn :( ) => getSingleJobAction(jobId)
    }); 

    const { mutate, isPending} = useMutation({
        mutationFn: (values:CreateAndEditJobType) => updateJobAction(jobId, values), 
        onSuccess: (data) => {
               if(!data)
               {
                 toast({ description: "there has been an error"}); 
                 return ; 
               }
               toast({ description:"job updated" });
               queryClient.invalidateQueries({ queryKey: ["jobs"] });
               queryClient.invalidateQueries({ queryKey: ["job", jobId] });
               queryClient.invalidateQueries({ queryKey: ["stats"] });
               router.push("/jobs");
        }
    })


     // 1. Define your form.
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: data?.position || "",
      company: data?.company || "",
      location: data?.location || "",
      status: (data?.status as JobStatus) || JobStatus.Pending,
      mode: (data?.mode as JobMode) || JobMode.FullTime,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateAndEditJobType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">edit job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position */}
          <CustomFormField name="position" control={form.control} />
          {/* company */}
          <CustomFormField name="company" control={form.control} />
          {/* location */}
          <CustomFormField name="location" control={form.control} />

          {/* job status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="job status"
            items={Object.values(JobStatus)}
          />
          {/* job  type */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="job mode"
            items={Object.values(JobMode)}
          />

          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? "updating..." : "edit job"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditJobForm