# 📝 Resume Editor Web App

A full-stack web application that allows users to upload, edit, enhance, and download resumes using AI suggestions. Built with **Next.js (App Router)** on the frontend and **FastAPI** on the backend, this app provides smart resume parsing, editing, and AI enhancement features.

---

## 🔧 Tech Stack

### Frontend (Next.js + TypeScript)
- **Next.js 15+** (App Router, SSR/CSR)
- **TypeScript**
- **TailwindCSS** (for modern UI)
- **React Hooks**
- **Axios** (for API calls)
- **pdfjs-dist** (PDF parsing)
- **mammoth.js** (DOCX parsing)

### Backend (FastAPI)
- **FastAPI** (Python 3.11+)
- **Pydantic** (request/response schema validation)
- **CORS Middleware**

---

## 🚀 Features

- ✅ Upload resume in `.pdf` or `.docx` format
- ✅ Auto-parsing of personal info, summary, experience, education, and skills
- ✅ Editable UI for all parsed resume sections
- ✅ Enhance any section with mock AI suggestions
- ✅ Download resume data as `.json` (optionally extend to `.pdf` or `.docx`)
- ✅ Resume history tracking (future scope)
- ✅ Light/Dark mode toggle (optional UI polish)

---

## 📁 Project Structure

```plaintext
resume-editor/
│
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable components (Sections, Uploaders, Panels)
│   ├── hooks/                # useResume.ts for global state
│   ├── services/             # resumeParser.client.ts, api.ts
│   ├── types/                # resume.d.ts
│   ├── public/               # Icons, logos
│   └── tailwind.config.ts    # Tailwind config
│
├── backend/
│   ├── main.py               # FastAPI entry point
│   └── models.py             # (Optional) Schema definitions
│
├── .gitignore
├── README.md
├── package.json
└── vercel.json               # For deployment (if needed)


## 🧠 Challenges Faced

### 1. PDF Parsing on Server Crashes
- `pdfjs-dist` throws `ReferenceError: DOMMatrix is not defined` on SSR.
- ✅ **Solution:** Created a `resumeParser.client.ts` to isolate `pdfjs-dist` for client-side usage only.

### 2. PDF Worker Fails on Vercel
- CDN-loaded `pdf.worker.min.js` fails with 404.
- ✅ **Solution:** Removed `GlobalWorkerOptions.workerSrc`, relied on default worker or inline one if needed.

### 3. CORS Issues Between Frontend & Backend
- FastAPI rejected frontend requests.
- ✅ **Solution:** Added `CORSMiddleware` to allow both localhost and Vercel domain.

### 4. Vercel Build Failure (Linting Errors)
- ESLint errors like:
  - `@typescript-eslint/no-unused-vars`
  - `react/no-unescaped-entities`
- ✅ **Solution:** Removed unused variables and escaped JSX quotes (`"` → `&quot;`)

### 5. Resume Extraction Inconsistency
- User resumes have inconsistent formats.
- ✅ **Solution:** Built resilient regex matchers for experience, education, skills, and summary.

---

## 🔄 Deployment Instructions

### 🔹 Frontend (Next.js on Vercel)

1. Push your code to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and import the project.
3. Select the frontend folder (`/frontend`) as root.
4. Configure **Environment Variables** (if any).
5. Deploy!

✅ Your app will be live at `https://resume-editor-vert.vercel.app/`

---

### 🔹 Backend (FastAPI on Render)

1. Push your backend to GitHub.
2. Create a new **Web Service** on Render.
3. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Add CORS settings to allow the Vercel domain:
```python
allow_origins = ["https://resume-editor-vert.vercel.app/"]
