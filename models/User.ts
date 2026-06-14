import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string; email: string; password: string;
  createdAt: Date; updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name:     { type: String, required: [true, 'Name is required'], trim: true, maxlength: 60 },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);
export default User;