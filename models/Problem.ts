import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IProblem extends Document {
  userId: Types.ObjectId;
  title: string; platform: string; link: string;
  difficulty: string; status: string;
  tags: string[]; notes: string; mistakes: string;
  createdAt: Date; updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title:      { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  platform:   { type: String, enum: ['LeetCode','GeeksForGeeks','HackerRank','CodeForces','Other'], default: 'LeetCode' },
  link:       { type: String, default: '', trim: true },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Medium' },
  status:     { type: String, enum: ['Solved','Unsolved','Revision'], default: 'Unsolved' },
  tags:       { type: [String], default: [] },
  notes:      { type: String, default: '' },
  mistakes:   { type: String, default: '' },
}, { timestamps: true });

const Problem: Model<IProblem> = mongoose.models.Problem ?? mongoose.model<IProblem>('Problem', ProblemSchema);
export default Problem;