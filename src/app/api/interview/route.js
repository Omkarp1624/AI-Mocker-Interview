import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { chatSession } from '@/utils/GeminiAIModal';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs/server';
import moment from 'moment';
import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';

// POST: Create new interview
export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobPosition, jobDesc, jobExperience, userEmail } = await req.json();

    if (!jobPosition || !jobDesc || !jobExperience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating interview for:', { jobPosition, jobDesc, jobExperience });

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on the information provided, please give me 5 interview questions with answers in JSON format. Give questions and answers as fields.`;
    
    const result = await chatSession.sendMessage(inputPrompt);
    
    // Clean the AI response - remove markdown formatting
    const rawText = result.response.text();
    const MockJsonResp = rawText.replaceAll('``````', '').trim();

    console.log('AI Response received, parsing...');

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(MockJsonResp);
      console.log('Questions parsed successfully');
    } catch (error) {
      console.error('JSON parse error:', error);
      console.error('Raw response:', MockJsonResp);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    const mockId = uuidv4();
    console.log('Generated mockId:', mockId);

    console.log('Inserting into database...');
    const resp = await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: MockJsonResp,
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperience: jobExperience,
      createdBy: userEmail,
      createdAt: moment().format('DD-MM-yyyy'),
    }).returning({ mockId: MockInterview.mockId });

    console.log('Insert successful:', resp);

    return NextResponse.json({
      success: true,
      mockId: resp[0].mockId,
      questions: parsedQuestions,
    });

  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create interview' },
      { status: 500 }
    );
  }
}

// GET: Fetch all interviews for current user
export async function GET(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    console.log('Fetching interviews for:', userEmail);

    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}
