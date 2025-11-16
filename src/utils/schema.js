import { serial, varchar , text} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mock_interview", {
    id:serial("id").primaryKey().notNull(),
    jsonMockResp : text('jsonMockResp').notNull(),
    jobPosition : varchar('jobPosition').notNull(),
    jobDesc : varchar('jobDesc').notNull(),
    jobExperience : varchar('jobExperience').notNull(),
    createdBy : varchar('createdBy').notNull(),
    createdAt:varchar('createdAt').notNull(),
    mockId :varchar('mockId').notNull()

})

export const UserAnswer = pgTable("useranswer", {
    id:serial("id").primaryKey().notNull(),
    mockIdRef : varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:varchar('correctAns').notNull(),
    userAns:text('userAns').notNull(),
    feedback:text('feedback').notNull(),
    rating:varchar('rating').notNull(),
    userEmail:varchar('userEmail').notNull(),
    createdAt:varchar('createdAt').notNull(),
})
