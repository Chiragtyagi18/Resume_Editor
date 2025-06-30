from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(title="Resume Builder API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class AIEnhanceResponse(BaseModel):
    enhanced_content: str
    suggestions: List[str]

# Mock AI enhancement data
MOCK_ENHANCEMENTS = {
    "summary": {
        "enhanced_content": "Dynamic and results-driven Full-Stack Developer with 5+ years of experience architecting and implementing scalable web solutions. Demonstrated expertise in React, Node.js, and cloud technologies, with a proven track record of delivering exceptional user experiences that drive business growth and customer satisfaction.",
        "suggestions": [
            "Consider adding specific metrics to quantify your impact",
            "Highlight your leadership and collaboration skills",
            "Mention any relevant certifications or awards"
        ]
    },
    "experience": {
        "enhanced_content": "Spearheaded the end-to-end development of mission-critical customer-facing web applications, successfully serving 100,000+ daily active users while maintaining 99.9% uptime. Collaborated cross-functionally with product, design, and DevOps teams to deliver innovative solutions that exceeded performance benchmarks and user satisfaction metrics.\n\nKey Achievements:\n• Optimized application performance, reducing page load times by 40% through strategic code refactoring and caching implementation\n• Led a high-performing team of 4 developers through major product redesign, delivering ahead of schedule and under budget\n• Architected and implemented comprehensive CI/CD pipeline, reducing deployment time by 60% and eliminating production errors",
        "suggestions": [
            "Use strong action verbs to start each bullet point",
            "Include specific technologies and tools used",
            "Quantify achievements with percentages and numbers"
        ]
    },
    "education": {
        "enhanced_content": "Bachelor of Science in Computer Science from University of California, Berkeley. Graduated with a 3.8 GPA, consistently earning Dean's List recognition for academic excellence. Demonstrated leadership as President of the Programming Club, fostering collaboration and technical growth among 50+ members. Showcased technical excellence and innovation by winning the prestigious Annual Hackathon in 2019, competing against 200+ participants with a groundbreaking web application solution.",
        "suggestions": [
            "Highlight relevant coursework for the target role",
            "Include any research projects or publications",
            "Mention specific technologies learned during studies"
        ]
    }
}

@app.get("/")
async def root():
    return {"message": "Resume Builder API is running"}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def enhance_content(request: AIEnhanceRequest):
    """
    Enhance resume content using AI (mocked implementation)
    """
    try:
        # Get enhancement based on section type
        if request.section.lower() in MOCK_ENHANCEMENTS:
            enhancement = MOCK_ENHANCEMENTS[request.section.lower()]
        else:
            # Generic enhancement for unknown sections
            enhanced_content = f"Enhanced: {request.content}"
            if len(request.content) > 50:
                enhanced_content = request.content.replace(
                    request.content.split('.')[0],
                    f"Professional and accomplished {request.content.split('.')[0].lower()}"
                )
            
            enhancement = {
                "enhanced_content": enhanced_content,
                "suggestions": [
                    "Use more specific and quantifiable metrics",
                    "Include relevant keywords for your industry",
                    "Highlight unique achievements and contributions"
                ]
            }
        
        return AIEnhanceResponse(**enhancement)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Resume Builder API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)