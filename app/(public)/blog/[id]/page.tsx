'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa';

const blogContent: Record<number, { title: string; date: string; category: string; content: string[] }> = {
  1: {
    title: 'How to Learn Web Development in 2025',
    date: 'Jan 15, 2025',
    category: 'Learning',
    content: [
      'Web development is one of the most sought-after skills in the tech industry today. Whether you are a complete beginner or someone looking to enhance your skills, 2025 offers more resources than ever before.',
      'In this comprehensive guide, we will walk you through the essential steps to start your web development journey with the right mindset and resources.',
      'First and foremost, understand the fundamentals. Web development consists of three main pillars: HTML, CSS, and JavaScript. HTML provides the structure, CSS handles the styling, and JavaScript adds interactivity to your web pages.',
      'Start with HTML basics such as tags, semantic HTML, and forms. Spend at least 1-2 weeks understanding how HTML works. Then move on to CSS where you will learn selectors, flexbox, grid, and responsive design principles.',
      'Once you have mastered HTML and CSS, dive into JavaScript. This is where things get exciting as you will learn to create interactive and dynamic web applications. Focus on variables, functions, DOM manipulation, and async programming.',
      'After mastering the fundamentals, learn frameworks. React, Vue, and Angular are the most popular frameworks in 2025. We recommend starting with React as it has the largest community and most job opportunities.',
      'Next, learn backend development. Node.js with Express is an excellent choice for beginners. Understand databases like MongoDB or PostgreSQL, and learn how to build RESTful APIs.',
      'Finally, practice by building real projects. Start with simple projects like a to-do app, then move on to more complex projects. GitHub is your best friend for showcasing your work to potential employers.',
      'Remember, consistency is key. Dedicate at least 3-4 hours daily to learning and practicing. Join communities, ask questions, and never stop learning.',
    ],
  },
  2: {
    title: 'Top 10 Programming Languages for Career Growth',
    date: 'Jan 10, 2025',
    category: 'Career',
    content: [
      'The job market for programmers is more competitive than ever. Choosing the right programming language can significantly impact your career prospects. In this article, we explore the top 10 programming languages that can boost your tech career in 2025.',
      '1. Python - Python remains the most versatile language with applications in web development, data science, AI, and automation. Its simplicity and readability make it perfect for beginners.',
      '2. JavaScript - JavaScript is essential for web development. With frameworks like React and Vue, it is indispensable for frontend developers.',
      '3. TypeScript - TypeScript adds type safety to JavaScript and is increasingly popular for large-scale applications. Learning TypeScript makes you more marketable.',
      '4. Java - Java is still widely used in enterprise applications. Many large companies use Java for their backend systems.',
      '5. C++ - For systems programming and game development, C++ is unbeatable. It offers high performance and control.',
      '6. C# - C# is the language for building Windows applications and games with Unity. The demand for C# developers remains strong.',
      '7. Go - Go is designed for concurrent programming and cloud applications. It is gaining popularity in DevOps and backend development.',
      '8. Rust - Rust offers memory safety without garbage collection. It is becoming popular for systems programming and embedded development.',
      '9. Kotlin - Kotlin is the preferred language for Android app development. Google recommends Kotlin for Android projects.',
      '10. SQL - While not a general-purpose language, SQL is essential for any developer. Database knowledge is crucial in 2025.',
      'Choose a language based on your interests and career goals. Master one or two languages deeply rather than learning many superficially.',
    ],
  },
  3: {
    title: 'The Future of AI in Education',
    date: 'Jan 5, 2025',
    category: 'AI',
    content: [
      'Artificial Intelligence is revolutionizing education as we know it. From personalized learning paths to automated grading, AI is transforming how students learn and teachers teach.',
      'Personalized Learning: AI algorithms analyze student performance and adapt the curriculum to individual needs. This means each student gets a unique learning experience tailored to their pace and style.',
      'Intelligent Tutoring Systems: AI-powered tutors can provide instant feedback and explanations. These systems understand where a student is struggling and provide targeted help.',
      'Automated Assessment: Grading is becoming faster and more objective with AI. Teachers can focus on teaching while AI handles routine grading tasks.',
      'Content Creation: AI can generate educational content, practice problems, and explanations in multiple languages. This helps make education more accessible globally.',
      'Predictive Analytics: AI can identify at-risk students early and recommend interventions. This proactive approach helps reduce dropout rates.',
      'Language Learning: AI-powered language learning apps are becoming increasingly sophisticated. They can correct pronunciation, assess grammar, and suggest improvements in real-time.',
      'However, challenges remain. Concerns about data privacy, algorithmic bias, and the digital divide need to be addressed. Education institutions must ensure that AI is used ethically and inclusively.',
      'The future of education is not about replacing teachers with AI, but about augmenting their capabilities. Teachers will become facilitators, guiding students through personalized learning journeys powered by AI.',
    ],
  },
  4: {
    title: 'Digital Skills That Employers Want Most',
    date: 'Dec 28, 2024',
    category: 'Skills',
    content: [
      'The job market is evolving rapidly. Employers are looking for candidates with a combination of technical and soft skills. Let us explore the digital skills that are in highest demand.',
      'Cloud Computing: Knowledge of AWS, Azure, or Google Cloud Platform is highly valuable. Companies are migrating to the cloud, and professionals with cloud expertise command premium salaries.',
      'Data Science and Analytics: Companies are drowning in data. They need professionals who can extract insights from data and make data-driven decisions.',
      'Cybersecurity: With increasing cyber threats, cybersecurity professionals are in high demand. This field offers competitive salaries and job security.',
      'Full-Stack Development: Employers prefer developers who can handle both frontend and backend. Full-stack developers are more versatile and valuable.',
      'DevOps: DevOps professionals who can automate deployment and manage infrastructure are highly sought after.',
      'AI and Machine Learning: As AI becomes mainstream, professionals with AI and ML expertise are in great demand.',
      'Soft Skills: Beyond technical skills, employers value communication, teamwork, and problem-solving abilities. These soft skills often determine career progression.',
      'Continuous Learning: The tech industry evolves rapidly. Employers value candidates who are committed to continuous learning and staying updated with the latest technologies.',
      'To stay competitive, invest in learning these skills. Take online courses, work on real projects, and build a strong portfolio.',
    ],
  },
  5: {
    title: 'Freelancing vs Full-Time: Which Path is Right?',
    date: 'Dec 20, 2024',
    category: 'Career',
    content: [
      'One of the biggest decisions in your tech career is choosing between freelancing and full-time employment. Each path has its advantages and challenges.',
      'Freelancing Advantages: Freedom and flexibility to choose your projects and working hours. Potential for higher income, especially once you build a client base. You are your own boss and make decisions independently.',
      'Freelancing Challenges: Irregular income and no job security. You need to handle your own taxes and benefits. Finding consistent clients can be challenging, especially starting out.',
      'Full-Time Advantages: Stable income and benefits like health insurance and retirement plans. Career growth opportunities and mentorship from experienced colleagues. Job security and predictable work schedule.',
      'Full-Time Challenges: Less flexibility in work hours and projects. Limited personal growth if the company does not invest in employee development. Potential for burnout if the work-life balance is poor.',
      'Consider Your Priorities: Are you seeking financial stability or maximum income potential? Do you value work-life balance or career growth? Are you self-motivated or do you thrive with structure and guidance?',
      'Hybrid Approach: Many professionals choose a hybrid approach. Working full-time while freelancing on side projects can provide both stability and additional income.',
      'Getting Started: If choosing freelancing, start with platforms like Upwork or Fiverr. Build a strong portfolio showcasing your best work. Get testimonials from satisfied clients.',
      'The Right Choice: There is no universal right answer. Your choice depends on your personality, financial situation, and career goals. Both paths can lead to success and fulfillment.',
    ],
  },
  6: {
    title: 'Best Practices for Remote Learning',
    date: 'Dec 15, 2024',
    category: 'Learning',
    content: [
      'Remote learning has become the norm in 2025. Whether you are taking online courses or attending webinars, remote learning requires a different approach than traditional classroom learning.',
      'Create a Dedicated Workspace: Set up a quiet, distraction-free space for learning. This helps your brain recognize that it is time to focus.',
      'Stick to a Schedule: Treat remote learning like a traditional class. Attend sessions at scheduled times and dedicate specific hours for studying.',
      'Minimize Distractions: Put your phone away, close unnecessary browser tabs, and inform others that you should not be disturbed.',
      'Take Regular Breaks: Use the Pomodoro technique: study for 25 minutes, then take a 5-minute break. This improves focus and retention.',
      'Engage Actively: Do not just passively watch lectures. Take notes, ask questions, and participate in discussions.',
      'Interact with Peers: Join study groups or forums to discuss concepts with other learners. Teaching others is a great way to solidify your understanding.',
      'Review and Reinforce: Regularly review what you have learned. Use flashcards, quizzes, or teach someone else to reinforce concepts.',
      'Stay Motivated: Set clear goals and track your progress. Celebrate small wins along the way.',
      'Seek Help: Do not hesitate to reach out to instructors or tutors when you are struggling. Many online courses offer support channels for this purpose.',
    ],
  },
};

export default function BlogDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string) || 1;

  const post = blogContent[id as keyof typeof blogContent];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70 text-lg mb-4">Blog post not found</p>
            <Link href="/blog" className="text-primary hover:underline font-semibold">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 border-b border-border/20 bg-card">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="flex items-center gap-2 text-primary hover:underline mb-6">
              <FaArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex gap-6 text-foreground/70">
              <div className="flex items-center gap-2">
                <FaCalendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTag className="w-4 h-4" />
                <span className="text-primary font-medium">{post.category}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              {post.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/80 text-lg leading-relaxed mb-6 first-letter:capitalize"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Links */}
            <div className="mt-12 pt-8 border-t border-border/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6]
                  .filter((postId) => postId !== id)
                  .slice(0, 4)
                  .map((postId) => (
                    <Link key={postId} href={`/blog/${postId}`}>
                      <div className="p-4 bg-card rounded-lg border border-border/20 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                        <p className="text-sm text-primary font-medium mb-1">
                          {blogContent[postId as keyof typeof blogContent].category}
                        </p>
                        <p className="font-semibold text-foreground hover:text-primary transition-colors">
                          {blogContent[postId as keyof typeof blogContent].title}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
