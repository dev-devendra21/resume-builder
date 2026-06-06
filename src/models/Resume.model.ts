import mongoose from "mongoose";
import { IResume } from "@/types/resume.type";

const resumeSchema = new mongoose.Schema<IResume>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    personalInfo: {
      type: {
        fullname: String,
        email: String,
        mobile: String,
        location: String,
        github: String,
        linkedin: String,
        portfolio: String,
      },
      default: {},
    },
    workExperience: {
      type: [
        {
          company: String,
          position: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          techStack: [String],
          githubLink: String,
          liveLink: String,
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          institute: String,
          degree: String,
          startDate: String,
          endDate: String,
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const ResumeModel = mongoose.model<IResume>("Resume", resumeSchema);

export default ResumeModel;
