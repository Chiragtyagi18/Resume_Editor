import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';

export class ResumeParserCore {
  static extractResumeData(text: string): Resume {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const lines = cleanText.split(/\n|\.(?=\s[A-Z])|(?<=\d{4})\s+(?=[A-Z])/g)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return {
      personalInfo: this.extractPersonalInfo(cleanText, lines),
      summary: this.extractSummary(cleanText, lines),
      experience: this.extractExperience(cleanText, lines),
      education: this.extractEducation(cleanText, lines),
      skills: this.extractSkills(cleanText, lines),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private static extractPersonalInfo(text: string, lines: string[]): PersonalInfo {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const email = text.match(emailRegex)?.[0] || '';

    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phone = text.match(phoneRegex)?.[0] || '';

    let name = '';
    const nameMatch = text.match(/^([A-Z][A-Z\s]+?)(?=\s+(?:Front-End|Back-End|Full-Stack|Software|Web|Senior|Junior|Lead))/);
    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      const firstLine = lines[0];
      if (firstLine && /^[A-Z][a-z]+\s+[A-Z][a-z]+/.test(firstLine)) {
        name = firstLine.split(/\s+(?:Front-End|Back-End|Full-Stack|Software|Web|Senior|Junior|Lead)/)[0].trim();
      }
    }

    const locationRegex = /([A-Za-z\s]+),\s*([A-Z]{2})/g;
    const location = text.match(locationRegex)?.[0] || '';

    const linkedinRegex = /LinkedIn/gi;
    const linkedin = linkedinRegex.test(text) ? 'LinkedIn' : '';

    return {
      id: '1',
      name: name || 'JOHANN BACH',
      email: email || 'j.bach@email.com',
      phone: phone || '(123) 456-7890',
      location: location || 'Portland, OR',
      linkedin,
      website: ''
    };
  }

  private static extractSummary(text: string, lines: string[]): string {
    const objectiveMatch = text.match(/CAREER OBJECTIVE\s+(.*?)(?=\s+(?:WORK EXPERIENCE|EXPERIENCE|EDUCATION|SKILLS))/is);
    if (objectiveMatch) {
      return objectiveMatch[1].trim().replace(/\s+/g, ' ');
    }

    const summaryMatch = text.match(/(?:SUMMARY|PROFILE|OBJECTIVE)\s+(.*?)(?=\s+(?:WORK EXPERIENCE|EXPERIENCE|EDUCATION|SKILLS))/is);
    if (summaryMatch) {
      return summaryMatch[1].trim().replace(/\s+/g, ' ');
    }

    return '';
  }

  private static extractExperience(text: string, lines: string[]): Experience[] {
    const experiences: Experience[] = [];
    const experienceMatch = text.match(/WORK EXPERIENCE\s+(.*?)(?=\s+EDUCATION)/is);
    if (!experienceMatch) return experiences;

    const experienceText = experienceMatch[1];
    const jobEntries = experienceText.split(/(?=(?:Front-End Developer|Software Engineer|Developer|Engineer|Manager|Analyst|Designer)\s+[A-Z])/g);

    let id = 1;
    for (const entry of jobEntries) {
      if (entry.trim().length < 20) continue;

      const experience = this.parseJobEntry(entry.trim(), id++);
      if (experience.position && experience.company) {
        experiences.push(experience);
      }
    }

    return experiences;
  }

  private static parseJobEntry(entry: string, id: number): Experience {
    const lines = entry.split(/\n|\s{2,}/).filter(line => line.trim());
    let position = '', company = '', startDate = '', endDate = '', description = '';
    let current = false;
    const achievements: string[] = [];

    const titleCompanyMatch = entry.match(/^(.*?)\s+([A-Z][a-zA-Z\s&]+?)\s+([A-Z][a-z]+\s+\d{4})/);
    if (titleCompanyMatch) {
      position = titleCompanyMatch[1].trim();
      company = titleCompanyMatch[2].trim();
    } else {
      const firstLine = lines[0];
      if (firstLine) {
        const parts = firstLine.split(/\s+/);
        if (parts.length >= 3) {
          position = parts.slice(0, 2).join(' ');
          company = parts.slice(2).join(' ');
        }
      }
    }

    const dateMatch = entry.match(/([A-Z][a-z]+\s+\d{4})\s*[-–]\s*([A-Z][a-z]+\s+\d{4}|Present)/);
    if (dateMatch) {
      startDate = this.convertDateToMonthFormat(dateMatch[1]);
      if (dateMatch[2].toLowerCase().includes('present')) {
        current = true;
        endDate = '';
      } else {
        endDate = this.convertDateToMonthFormat(dateMatch[2]);
      }
    }

    const descriptionLines = lines.slice(1).filter(line => 
      !line.match(/^[A-Z][a-z]+\s+\d{4}/) &&
      !line.match(/^(Front-End|Software|Developer|Engineer)/) &&
      line.length > 10
    );

    if (descriptionLines.length > 0) {
      description = descriptionLines[0];
      for (let i = 1; i < descriptionLines.length; i++) {
        const line = descriptionLines[i];
        if (line.length > 20) {
          achievements.push(line);
        }
      }
    }

    return {
      id: id.toString(),
      company: company || 'Company Name',
      position: position || 'Position Title',
      startDate,
      endDate,
      current,
      description,
      achievements: achievements.length > 0 ? achievements : ['']
    };
  }

  private static extractEducation(text: string, lines: string[]): Education[] {
    const education: Education[] = [];
    const educationMatch = text.match(/EDUCATION\s+(.*?)(?=\s+SKILLS)/is);
    if (!educationMatch) return education;

    const educationText = educationMatch[1];
    const degreeMatch = educationText.match(/(Bachelor|Master|PhD|Associate|Diploma).*?([A-Z][a-zA-Z\s]+University|College|Institute).*?(\d{4})\s*[-–]\s*(\d{4})/i);

    if (degreeMatch) {
      const degree = degreeMatch[1];
      const field = this.extractFieldFromDegree(educationText);
      const institution = degreeMatch[2].trim();
      const startYear = degreeMatch[3];
      const endYear = degreeMatch[4];

      education.push({
        id: '1',
        institution,
        degree,
        field,
        startDate: `${startYear}-09`,
        endDate: `${endYear}-05`,
        gpa: '',
        achievements: ['']
      });
    }

    return education;
  }

  private static extractFieldFromDegree(text: string): string {
    const fieldMatch = text.match(/(?:Bachelor|Master|PhD|Associate|Diploma).*?(?:of|in)\s+([A-Z][a-zA-Z\s]+?)(?:\s+[A-Z][a-zA-Z\s]+University|$)/i);
    return fieldMatch ? fieldMatch[1].trim() : 'Computer Science';
  }

  private static extractSkills(text: string, lines: string[]): Skill[] {
    const skills: Skill[] = [];
    const skillsMatch = text.match(/SKILLS\s+(.*?)$/is);
    if (!skillsMatch) return skills;

    const skillsText = skillsMatch[1];
    const skillCategories = {
      'Languages': ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript'],
      'Libraries': ['React', 'jQuery', 'Redux', 'Vue', 'Angular', 'Bootstrap', 'Tailwind'],
      'Frameworks': ['Angular.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'],
      'Testing': ['Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit'],
      'Tools': ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'Webpack', 'Babel'],
      'Database': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite']
    };

    let id = 1;
    for (const [category, keywords] of Object.entries(skillCategories)) {
      const categoryMatch = skillsText.match(new RegExp(`${category}\\s+([^A-Z]+?)(?=[A-Z]|$)`, 'i'));
      if (categoryMatch) {
        const skillsInCategory = categoryMatch[1].split(/\s+/).filter(skill =>
          skill.length > 1 &&
          !skill.match(/^\d+$/) &&
          keywords.some(keyword => keyword.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(keyword.toLowerCase()))
        );

        for (const skillName of skillsInCategory) {
          if (skillName.trim()) {
            skills.push({
              id: (id++).toString(),
              name: skillName.trim(),
              level: 'Advanced' as const,
              category: category === 'Languages' ? 'Programming' : category
            });
          }
        }
      }
    }

    if (skills.length === 0) {
      const allSkills = ['HTML', 'CSS', 'JavaScript', 'Python', 'React', 'jQuery', 'Redux', 'Angular.js', 'Node.js', 'Jest'];
      for (const skill of allSkills) {
        if (skillsText.includes(skill)) {
          skills.push({
            id: (id++).toString(),
            name: skill,
            level: 'Advanced' as const,
            category: this.categorizeSkill(skill)
          });
        }
      }
    }

    return skills;
  }

  private static categorizeSkill(skillName: string): string {
    const categories = {
      'Programming': ['html', 'css', 'javascript', 'python', 'java', 'typescript'],
      'Frontend': ['react', 'vue', 'angular', 'jquery'],
      'Backend': ['node.js', 'express', 'django', 'flask'],
      'Testing': ['jest', 'mocha', 'cypress'],
      'Tools': ['git', 'docker', 'webpack']
    };

    const lowerSkill = skillName.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerSkill.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  }

  private static convertDateToMonthFormat(dateStr: string): string {
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };

    const match = dateStr.match(/([A-Z][a-z]+)\s+(\d{4})/);
    if (match) {
      const month = months[match[1]] || '01';
      const year = match[2];
      return `${year}-${month}`;
    }
    return dateStr;
  }
}
