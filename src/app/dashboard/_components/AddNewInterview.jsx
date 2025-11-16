"use client"
import React from 'react'
import moment from "moment";
import { db } from '@/utils/db';  // Make sure this path is correct
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "@/src/components/ui/dialog"


import { Button } from '@/src/components/ui/button'
import { Ghost, LoaderCircle, LucideLoaderCircle } from 'lucide-react'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import { MockInterview } from '@/utils/schema'
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';


function AddNewInterview() {

    const [openDialog, setOpenDialog] = React.useState(false)
    const [jobPosition, setJobPosition] = React.useState()
    const[jobDesc, setJobDesc] = React.useState()
    const [jobExperience, setJobExperience] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [JsonResponse, setJsonResponse] = React.useState([])
    const {user} = useUser();
    const router = useRouter();
    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()  
        console.log(jobPosition, jobDesc, jobExperience)
        const inputPrompt = "Job Position : " + jobPosition + ", Job Description: " + jobDesc + " , Years of Experience: "+jobExperience+" Based on the information provided, please give me 5 interview questions with answers in json format , give questions and answers as field"
        const result = await chatSession.sendMessage(inputPrompt);
        const MockJsonResp = result.response.text().replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);
        if(MockJsonResp) {
            const resp = await db.insert(MockInterview)
            .values({
                mockId : uuidv4(),
                jsonMockResp: MockJsonResp,
                jobPosition: jobPosition,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy'),
            }).returning({mockId: MockInterview.mockId});

            console.log("Inserted ID:",resp)
            if(resp){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+resp[0].mockId);
            }
        }
        else {
            console.log("ERROR");
        }

        setLoading(false);
    }


    return (
        <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
            onClick={() => setOpenDialog(true)}
        >
            <h2 className='mx-20  text-lg'>+ Add New Interview</h2>
        </div>

            <Dialog open = {openDialog}>
                
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                    <DialogTitle className='text-2xl'>Tell us more about your job Interview</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={onSubmit}>
                            <div>
                                <h2>Add Details about your job position/role, Job Description and years of experience</h2>
                                <div className='mt-7 my-2'>
                                    <label className='font-bold mx-2 '>Job Role/Job Position</label>
                                    <Input placeholder="Ex: Full Stack Developer" required  
                                    onChange={(e) => setJobPosition(e.target.value)}
                                    />
                                </div>

                                    
                                <div className=' my-3'>
                                    <label className='font-bold mx-2 my-4 '>Job Description/ Tech Stack</label>
                                    <Textarea placeholder="Ex: React, Node.js, MongoDB, etc" required
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                </div>


                                <div className='my-3'>
                                    <label className='font-bold mx-2 '>Years Of Experience</label>
                                    <Input placeholder="Ex. 5" type="number"  max = "90" min = "0" required
                                    onChange={(e) => setJobExperience(e.target.value)}
                                    />
                                </div>

                        
                            </div>

                            <div className='flex gap-5 justify-end'>
                                <Button type = "button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button type = "submit" disabled = {loading} > 
                                    {
                                        loading?
                                        <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />'Generating  from AI'
                                        </> :'Start Interview'
                                    }

                                    </Button>
                            </div>
                        </form>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
    }

    export default AddNewInterview