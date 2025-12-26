import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  azureId: string;
  email: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    azureId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      select: false, // Don't return token by default
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

