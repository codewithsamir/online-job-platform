📘 Job Portal Web App – Documentation
🚀 Overview

This project is a Job Portal Platform that connects Job Seekers with Job Providers.
It allows users to create profiles, post and apply for jobs, and manage applications.
The platform also integrates AI (Google Gemini API) for smart features such as recommendations, content generation, and user assistance.

Built with Next.js, TailwindCSS, shadcn/ui, Redux Toolkit, and Appwrite.

🛠️ Tech Stack
🔹 Frontend

Next.js (App Router) → Modern React framework for routing & SSR/CSR.

React + TypeScript → Type-safe components & hooks.

Tailwind CSS → Utility-first styling.

shadcn/ui → Prebuilt, accessible, and customizable UI components.

🔹 State Management

Redux Toolkit for centralized state:

authSlice → manages authentication and preferences (roles).

candidateSlice → manages candidate profiles.

applicationSlice → handles job applications.

jobSlice → fetches and manages job data.

Custom hooks: useAppDispatch, useAppSelector.

🔹 Backend / Database

Appwrite (node-appwrite SDK) → Authentication, Database, Permissions.

Collections:

Candidates → stores profile data (fullName, gender, skills, etc.).

Jobs → stores job postings.

Applications → stores job applications.

Permissions:

Permission.create("users")

Permission.read("users")

Permission.update("users")

Permission.delete("users")

🔹 AI Integration

Google Gemini API:

Used for AI-driven features (e.g., resume parsing, smart job matching, chat assistant, or content generation).

🔑 Core Features
👤 User Roles

Job Seeker → Can create profile, browse jobs, apply, and track applications.

Job Provider → Can post jobs, view candidates, and manage hiring.

📋 Candidate Features

Profile creation with details like Full Name, Email, Phone, Skills, Education, Experience.

Update profile information anytime.

Apply for jobs directly.

View applied jobs and status.

🏢 Company Features

Post new job listings.

View applicants for posted jobs.

Manage application statuses.

📊 Dashboard

Job Seeker Dashboard → Shows applied jobs, profile status.

Company Dashboard → Shows posted jobs, applications.

Sidebar navigation with Dashboard, Jobs, Applied Jobs, Profile.

🔍 AI Assistance

Smart recommendations & AI chat features powered by Gemini API.

Potential integration for resume parsing or auto-suggestions in forms.