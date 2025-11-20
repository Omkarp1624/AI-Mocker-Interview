// "use client"
// import { db } from '@/utils/db';
// import { MockInterview } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs'
// import { desc, eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react'
// import InterviewItemCard from './InterviewItemCard';

//         function InterviewList() {
//             const {user} = useUser();

//             const [interviewList, setInterviewList] = useState([]);
//             useEffect(() => {
//                 user&&GetInterviewList();
//             }, [user]);

//             const GetInterviewList = async() => {
//                 const result = await db.select()
//                 .from(MockInterview)
//                 .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
//                 .orderBy(desc(MockInterview.createdAt));
                
//                 console.log(result);
//                 setInterviewList(result);
//             }
//         return (
//             <div>

//                 <h2 className='font-medium text-xl'>Previous Mock Interview</h2>

//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
//                     {interviewList && interviewList.map((item, index) => (  
//                         <InterviewItemCard
//                         interview = {item}
//                         key={index}  />
                        
//                     ))}
//                 </div>
//             </div>
//         )
//         }

// export default InterviewList

"use client"
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            setLoading(true);
            setError(null);

            // Call API route instead of direct database access
            const response = await fetch(
                `/api/interview?email=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch interviews');
            }

            const data = await response.json();

            if (data.success) {
                setInterviewList(data.interviews);
            } else {
                setError(data.error || 'Failed to load interviews');
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            setError('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center">
                <p>Loading interviews...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                <p>{error}</p>
                <button 
                    onClick={GetInterviewList}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
            
            {interviewList.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    <p>No interviews yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                    {interviewList.map((interview, index) => (
                        <InterviewItemCard 
                            key={interview.id || index} 
                            interview={interview} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default InterviewList;
