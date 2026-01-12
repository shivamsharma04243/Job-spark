import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../components/toast";
import api from "../../../components/apiconfig/apiconfig";
import { stateOptions, citiesByState } from "../../../constants/locationData";

// Role-based auto-fill data
// Maps standardized role names to default field values
const ROLE_AUTO_FILL_DATA = {
  // IT / Development roles
  "Backend Developer": {
    description: `We are hiring a Backend Developer to build and maintain server-side applications.

Responsibilities:
• Develop and maintain APIs and server-side logic
• Design and manage databases
• Ensure application security and data protection
• Optimize application performance
• Write clean, maintainable code

Requirements:
• Knowledge of Node.js, Python, Java, or PHP
• Understanding of databases (MySQL, MongoDB)
• Basic knowledge of REST APIs
• Problem-solving mindset
• Freshers with good coding skills are welcome

Work Details:
• Full-time position
• Office-based work
• Learning opportunities provided`,
    skills: "Node.js, Express, SQL, MongoDB, REST APIs, Git",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "40000",
    vacancies: 1
  },
  "Computer Operator": {
    description: `We are hiring Computer Operators to manage computer systems and operations.

Responsibilities:
• Operate and monitor computer systems
• Perform data backups and system maintenance
• Troubleshoot basic computer issues
• Maintain system logs and records
• Assist users with computer-related problems

Requirements:
• Basic computer knowledge
• Typing skills (30+ WPM)
• Understanding of Windows/Linux OS
• Attention to detail
• Freshers with computer skills welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours
• Training provided`,
    skills: "Computer Basics, Windows, Linux, Typing, Troubleshooting, MS Office",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "20000",
    vacancies: 3
  },
  "Data Analyst Intern": {
    description: `We are looking for Data Analyst Interns to learn data analysis skills.

Responsibilities:
• Assist in data collection and cleaning
• Learn data analysis techniques
• Create basic reports and visualizations
• Support data-driven projects
• Learn industry tools and software

Requirements:
• Basic knowledge of Excel
• Interest in data analysis
• Analytical mindset
• Good learning attitude
• College students preferred

Work Details:
• Internship position (3-6 months)
• Office-based work
• Stipend provided
• Certificate on completion`,
    skills: "Excel, Data Analysis, Basic SQL, Analytical Thinking, MS Office",
    minExperience: "0",
    maxExperience: "0",
    jobType: "Internship",
    workMode: "Office",
    minSalary: "5000",
    maxSalary: "10000",
    vacancies: 2
  },
  "Data Entry Operator": {
    description: `We are hiring Data Entry Operators for back office operations.

Responsibilities:
• Enter data accurately into computer systems
• Verify and correct data errors
• Maintain data confidentiality
• Meet daily data entry targets
• Organize and file documents

Requirements:
• Good typing speed (30+ WPM)
• Basic computer knowledge
• Attention to detail
• 12th pass minimum
• Freshers welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours
• AC office environment`,
    skills: "Typing, MS Office, Data Entry, Accuracy, Computer Basics",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "18000",
    vacancies: 5
  },
  "Frontend Developer": {
    description: `We are looking for a Frontend Developer to join our team.

Responsibilities:
• Build and maintain user interfaces using modern web technologies
• Convert design mockups into responsive web pages
• Ensure website performance and cross-browser compatibility
• Collaborate with backend developers and designers
• Debug and fix frontend issues

Requirements:
• Knowledge of HTML, CSS, and JavaScript
• Experience with React, Angular, or Vue.js is a plus
• Basic understanding of responsive design
• Good problem-solving skills
• Freshers with strong fundamentals are welcome

Work Details:
• Full-time position
• Office/Remote work available
• Training provided for freshers`,
    skills: "HTML, CSS, JavaScript, React, Responsive Design, Git",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "35000",
    vacancies: 1
  },
  "Full Stack Developer": {
    description: `We are looking for a Full Stack Developer who can work on both frontend and backend.

Responsibilities:
• Build complete web applications from frontend to backend
• Develop user interfaces and server-side logic
• Manage databases and APIs
• Ensure application security and performance
• Collaborate with team members

Requirements:
• Knowledge of frontend (HTML, CSS, JavaScript, React)
• Knowledge of backend (Node.js or similar)
• Database management skills
• Good communication skills
• Freshers with strong projects are welcome

Work Details:
• Full-time position
• Office/Hybrid work options
• Fast-paced learning environment`,
    skills: "HTML, CSS, JavaScript, React, Node.js, MongoDB, SQL, Git",
    minExperience: "0",
    maxExperience: "3",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "20000",
    maxSalary: "50000",
    vacancies: 1
  },
  "IT Support Engineer": {
    description: `We are hiring IT Support Engineers to provide technical support.

Responsibilities:
• Troubleshoot hardware and software issues
• Install and configure computer systems
• Provide remote and on-site technical support
• Maintain IT inventory and documentation
• Assist users with technical problems

Requirements:
• Knowledge of computer hardware and software
• Basic networking concepts
• Problem-solving skills
• Good communication skills
• Freshers with IT background welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours
• Technical training provided`,
    skills: "Hardware, Software, Networking, Troubleshooting, Windows, Linux",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "30000",
    vacancies: 2
  },
  "MIS Executive": {
    description: `We are looking for MIS Executives to manage information systems.

Responsibilities:
• Maintain and update MIS reports
• Generate data reports and dashboards
• Analyze system performance and data
• Coordinate with IT and other departments
• Ensure data accuracy and security

Requirements:
• Knowledge of Excel and reporting tools
• Basic understanding of databases
• Analytical skills
• Attention to detail
• Freshers with computer skills welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours
• Training provided`,
    skills: "Excel, MIS, Reporting, Data Analysis, SQL, Dashboards",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "28000",
    vacancies: 1
  },
  "Network Technician": {
    description: `We are hiring Network Technicians to maintain network infrastructure.

Responsibilities:
• Install and configure network equipment
• Troubleshoot network connectivity issues
• Monitor network performance
• Maintain network documentation
• Ensure network security

Requirements:
• Basic knowledge of networking concepts
• Understanding of routers, switches, and cables
• Problem-solving skills
• ITI/Diploma in Electronics/Computer Science
• Freshers with technical aptitude welcome

Work Details:
• Full-time position
• Office/Site-based work
• Standard working hours
• Technical training provided`,
    skills: "Networking, Routers, Switches, Cabling, Troubleshooting, Network Security",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "28000",
    vacancies: 2
  },
  "QA Tester": {
    description: `We are looking for QA Testers to ensure software quality.

Responsibilities:
• Test software applications manually
• Write and execute test cases
• Report and track bugs
• Verify bug fixes
• Ensure quality standards are met

Requirements:
• Understanding of software testing concepts
• Attention to detail
• Good communication skills
• Basic computer knowledge
• Freshers with testing knowledge welcome

Work Details:
• Full-time position
• Office-based work
• Training on testing tools provided`,
    skills: "Manual Testing, Test Cases, Bug Tracking, SQL, JIRA, Documentation",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "30000",
    vacancies: 1
  },
  "Software Developer": {
    description: `We are hiring Software Developers to develop and maintain software applications.

Responsibilities:
• Write clean and efficient code
• Develop and test software applications
• Debug and fix software issues
• Participate in code reviews
• Document technical specifications

Requirements:
• Knowledge of programming languages (Java, Python, C++)
• Understanding of software development lifecycle
• Good analytical skills
• Freshers with good academics are welcome

Work Details:
• Full-time position
• Office-based work
• Career growth opportunities`,
    skills: "Java, Python, Data Structures, Algorithms, SQL, Git",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "20000",
    maxSalary: "45000",
    vacancies: 1
  },
  "Software Intern": {
    description: `We are looking for Software Interns to learn software development.

Responsibilities:
• Learn programming languages and concepts
• Assist in software development tasks
• Participate in code reviews and testing
• Work on assigned projects
• Learn development best practices

Requirements:
• Basic programming knowledge
• Interest in software development
• Good learning attitude
• College students preferred

Work Details:
• Internship position (3-6 months)
• Office-based work
• Stipend provided
• Certificate on completion`,
    skills: "Programming, Java, Python, HTML, CSS, Basic Algorithms",
    minExperience: "0",
    maxExperience: "0",
    jobType: "Internship",
    workMode: "Office",
    minSalary: "5000",
    maxSalary: "12000",
    vacancies: 3
  },
  "Web Developer": {
    description: `We are hiring Web Developers to create and maintain websites.

Responsibilities:
• Develop and maintain websites
• Write clean HTML, CSS, and JavaScript code
• Ensure website responsiveness and compatibility
• Collaborate with designers and backend developers
• Optimize website performance

Requirements:
• Knowledge of HTML, CSS, and JavaScript
• Understanding of web development concepts
• Basic knowledge of PHP/MySQL or similar
• Problem-solving skills
• Freshers with web development knowledge welcome

Work Details:
• Full-time position
• Office/Remote work options
• Training provided for freshers`,
    skills: "HTML, CSS, JavaScript, PHP, MySQL, Responsive Design, Git",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "35000",
    vacancies: 1
  },
  "Web Development Intern": {
    description: `We are looking for Web Development Interns to learn web development skills.

Responsibilities:
• Learn HTML, CSS, and JavaScript
• Assist in website development tasks
• Work on basic web projects
• Learn responsive design concepts
• Participate in development discussions

Requirements:
• Basic computer knowledge
• Interest in web development
• Good learning attitude
• College students preferred

Work Details:
• Internship position (3-6 months)
• Office-based work
• Stipend provided
• Certificate on completion`,
    skills: "HTML, CSS, JavaScript, Web Development, Responsive Design",
    minExperience: "0",
    maxExperience: "0",
    jobType: "Internship",
    workMode: "Office",
    minSalary: "5000",
    maxSalary: "10000",
    vacancies: 2
  },
  "Graphic Designer": {
    description: `We are hiring a Graphic Designer to create visual content and designs for our brand.

Responsibilities:
• Create visual designs for digital and print media
• Develop branding materials, logos, and marketing collateral
• Design user interfaces and user experiences for websites and apps
• Use design software to produce high-quality graphics
• Collaborate with marketing and product teams
• Ensure brand consistency across all design elements

Requirements:
• Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)
• Understanding of design principles and typography
• Experience with UI/UX design is a plus
• Portfolio showcasing design skills
• Knowledge of web design tools (Figma, Sketch)
• Freshers with strong portfolio are welcome

Work Details:
• Full-time position
• Office-based work with remote options
• Creative and collaborative environment`,
    skills: "Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Figma, Sketch, UI/UX Design, Branding, Typography",
    minExperience: "0",
    maxExperience: "3",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "35000",
    vacancies: 1
  },

  // Sales & Marketing roles
  "Business Development Executive": {
    description: `We are hiring Business Development Executives to expand our business.

Responsibilities:
• Identify new business opportunities
• Build and maintain client relationships
• Conduct market research
• Prepare business proposals
• Achieve business development targets

Requirements:
• Good communication and negotiation skills
• Understanding of business development
• Research and analytical skills
• Positive attitude
• Freshers with relevant skills welcome

Work Details:
• Full-time position
• Office-based work
• Dynamic work environment`,
    skills: "Communication, Negotiation, Business Development, Research, Client Relations",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "30000",
    vacancies: 2
  },
  "Marketing Executive": {
    description: `We are looking for Marketing Executives to promote our brand.

Responsibilities:
• Plan and execute marketing campaigns
• Manage social media accounts
• Create marketing content
• Track campaign performance
• Coordinate with sales team

Requirements:
• Knowledge of digital marketing
• Social media management skills
• Good written communication
• Creative thinking
• Freshers with marketing knowledge welcome

Work Details:
• Full-time position
• Office-based work
• Dynamic work environment`,
    skills: "Digital Marketing, Social Media, SEO, Content Writing, Analytics",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "30000",
    vacancies: 2
  },
  "Content Writer": {
    description: `We are hiring Content Writers to create engaging written content for our brand.

Responsibilities:
• Write high-quality content for websites, blogs, social media, and marketing materials
• Research topics and gather information to create accurate and informative content
• Edit and proofread content to ensure clarity, grammar, and brand consistency
• Optimize content for SEO to improve search engine visibility
• Collaborate with marketing and design teams to develop content strategies
• Adapt writing style for different platforms and target audiences

Requirements:
• Excellent writing skills in English
• Strong grammar and proofreading abilities
• Basic understanding of SEO principles
• Research and analytical skills
• Creativity and ability to write engaging content
• Freshers with strong writing skills and portfolio are welcome

Work Details:
• Full-time position
• Office/Remote/Hybrid work options available
• Creative and collaborative environment
• Opportunity to work on diverse content projects`,
    skills: "Content Writing, SEO, Copywriting, Blog Writing, Social Media Content, Proofreading, Research, Grammar, Creative Writing",
    minExperience: "0",
    maxExperience: "3",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "35000",
    vacancies: 1
  },
  "Marketing Intern": {
    description: `We are looking for Marketing Interns to learn marketing skills.

Responsibilities:
• Assist in marketing campaign planning
• Learn social media management
• Create basic marketing content
• Support market research activities
• Learn digital marketing tools

Requirements:
• Good communication skills
• Interest in marketing
• Creative thinking
• College students preferred

Work Details:
• Internship position (3-6 months)
• Office-based work
• Stipend provided
• Certificate on completion`,
    skills: "Digital Marketing, Social Media, Content Writing, Research, Creativity",
    minExperience: "0",
    maxExperience: "0",
    jobType: "Internship",
    workMode: "Office",
    minSalary: "5000",
    maxSalary: "10000",
    vacancies: 2
  },
  "Relationship Executive": {
    description: `We are hiring Relationship Executives to build customer relationships.

Responsibilities:
• Build and maintain customer relationships
• Handle customer inquiries and feedback
• Promote products/services to existing customers
• Conduct customer satisfaction surveys
• Provide excellent customer service

Requirements:
• Good communication skills
• Customer service orientation
• Relationship building skills
• Patience and empathy
• Freshers with good communication welcome

Work Details:
• Full-time position
• Office-based work
• Customer-focused role`,
    skills: "Communication, Customer Service, Relationship Building, Patience, Empathy",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "22000",
    vacancies: 3
  },
  "Sales Executive": {
    description: `We are hiring Sales Executives to grow our business.

Responsibilities:
• Meet potential customers and explain products/services
• Achieve monthly and quarterly sales targets
• Build and maintain customer relationships
• Follow up with leads and close deals
• Prepare daily sales reports

Requirements:
• Good communication skills in Hindi and English
• Convincing and negotiation abilities
• Basic computer knowledge
• Willingness to travel locally
• Freshers with positive attitude welcome

Work Details:
• Full-time field sales role
• Fixed salary + incentives
• Mobile and travel allowance provided`,
    skills: "Communication, Negotiation, Customer Handling, MS Office, Local Language",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "25000",
    vacancies: 5
  },
  "Telecaller": {
    description: `We are hiring Telecallers for our call center operations.

Responsibilities:
• Make outbound calls to customers
• Explain products/services clearly
• Handle customer queries
• Achieve daily calling targets
• Update customer information in system

Requirements:
• Good communication skills in Hindi/English
• Clear voice and speaking ability
• Basic computer knowledge
• Patience and positive attitude
• Freshers welcome, training provided

Work Details:
• Full-time position
• Office-based / Work from home options
• Fixed salary + incentives
• Day shift / Night shift available`,
    skills: "Communication, Hindi, English, Computer Basics, Customer Service",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "18000",
    vacancies: 10
  },

  // Operations & Support roles
  "Back Office Executive": {
    description: `We are hiring Back Office Executives for administrative support.

Responsibilities:
• Handle administrative and clerical tasks
• Maintain office records and documentation
• Coordinate with different departments
• Assist in data management and filing
• Support day-to-day office operations

Requirements:
• Good organizational skills
• Proficiency in MS Office
• Attention to detail
• Good communication skills
• Freshers with computer skills welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours`,
    skills: "MS Office, Organization, Communication, Data Management, Filing",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "22000",
    vacancies: 3
  },
  "Customer Support Executive": {
    description: `We are looking for Customer Support Executives to support our customers.

Responsibilities:
• Answer customer calls and emails
• Resolve customer complaints and queries
• Provide product/service information
• Escalate complex issues to seniors
• Maintain customer records

Requirements:
• Good communication skills
• Problem-solving ability
• Patience and empathy
• Basic computer skills
• Freshers with good communication welcome

Work Details:
• Full-time position
• Rotational shifts may apply
• Office-based work
• Training provided`,
    skills: "Communication, Problem Solving, CRM, Computer Basics, Patience",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "20000",
    vacancies: 5
  },
  "Field Executive": {
    description: `We are hiring Field Executives for field operations.

Responsibilities:
• Conduct field visits and surveys
• Collect data and information from field
• Coordinate with clients and customers
• Prepare field reports
• Ensure timely completion of field tasks

Requirements:
• Good communication skills
• Ability to work in field conditions
• Basic computer knowledge
• Valid driving license preferred
• Freshers with relevant skills welcome

Work Details:
• Full-time position
• Field-based work
• Travel may be required`,
    skills: "Communication, Field Work, Data Collection, Reporting, Coordination",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "22000",
    vacancies: 4
  },
  "Field Technician": {
    description: `We are hiring Field Technicians for technical field work.

Responsibilities:
• Perform technical installations and repairs
• Troubleshoot technical issues on-site
• Maintain equipment and tools
• Prepare service reports
• Ensure customer satisfaction

Requirements:
• Technical knowledge in relevant field
• Problem-solving skills
• Physical fitness for field work
• Valid driving license preferred
• Freshers with technical background welcome

Work Details:
• Full-time position
• Field-based work
• Travel and outdoor work`,
    skills: "Technical Skills, Troubleshooting, Field Work, Customer Service, Tools",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "25000",
    vacancies: 3
  },
  "HR Intern": {
    description: `We are looking for HR Interns to learn human resource management.

Responsibilities:
• Assist in recruitment activities
• Learn HR processes and policies
• Support employee onboarding
• Help maintain HR records
• Participate in HR training sessions

Requirements:
• Good communication skills
• Interest in HR field
• Organizational skills
• College students preferred

Work Details:
• Internship position (3-6 months)
• Office-based work
• Stipend provided
• Certificate on completion`,
    skills: "Communication, Organization, HR Processes, Recruitment, MS Office",
    minExperience: "0",
    maxExperience: "0",
    jobType: "Internship",
    workMode: "Office",
    minSalary: "5000",
    maxSalary: "10000",
    vacancies: 2
  },
  "Office Assistant": {
    description: `We are hiring Office Assistants for general office support.

Responsibilities:
• Provide general administrative support
• Handle office correspondence and filing
• Assist with office supplies management
• Coordinate meetings and appointments
• Support other office staff as needed

Requirements:
• Good organizational skills
• Basic computer knowledge
• Pleasant personality
• Good communication skills
• Freshers welcome

Work Details:
• Full-time position
• Office-based work
• Standard working hours`,
    skills: "Organization, Communication, Computer Basics, Filing, Coordination",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "18000",
    vacancies: 2
  },
  "Office Boy": {
    description: `We are hiring Office Boys for general office assistance.

Responsibilities:
• Maintain office cleanliness
• Handle office errands and deliveries
• Assist with office supplies
• Help with basic administrative tasks
• Support office staff as needed

Requirements:
• Basic education (8th pass)
• Physical fitness
• Punctuality
• Good work attitude
• No experience required

Work Details:
• Full-time position
• Office-based work
• Standard working hours`,
    skills: "Physical Fitness, Punctuality, Basic Tasks, Cleanliness, Reliability",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "8000",
    maxSalary: "12000",
    vacancies: 2
  },
  "Operations Executive": {
    description: `We are looking for Operations Executives to manage daily operations.

Responsibilities:
• Coordinate daily operational activities
• Monitor and improve processes
• Handle vendor coordination
• Prepare operational reports
• Ensure timely deliveries

Requirements:
• Graduate in any discipline
• Good organizational skills
• Basic computer knowledge
• Problem-solving ability
• Freshers with relevant skills welcome

Work Details:
• Full-time position
• Office-based work
• Dynamic work environment`,
    skills: "Operations, MS Office, Coordination, Problem Solving, Reporting",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "28000",
    vacancies: 2
  },
  "Packing Executive": {
    description: `We are hiring Packing Executives for packaging operations.

Responsibilities:
• Pack products according to specifications
• Ensure quality of packaging
• Maintain packing area cleanliness
• Meet packing targets and deadlines
• Report packaging issues

Requirements:
• Attention to detail
• Physical fitness
• Basic education
• Ability to work in standing position
• Freshers welcome

Work Details:
• Full-time position
• Warehouse-based work
• Shift-based work`,
    skills: "Packing, Attention to Detail, Physical Fitness, Quality Control, Team Work",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "16000",
    vacancies: 4
  },
  "Site Supervisor": {
    description: `We are hiring Site Supervisors to oversee site operations.

Responsibilities:
• Supervise site workers and activities
• Ensure safety standards are followed
• Monitor work progress and quality
• Coordinate with team members
• Prepare site reports

Requirements:
• Experience in relevant field
• Leadership skills
• Knowledge of safety procedures
• Good communication skills
• Physical fitness

Work Details:
• Full-time position
• Site-based work
• Field supervision role`,
    skills: "Supervision, Safety, Leadership, Communication, Site Management",
    minExperience: "1",
    maxExperience: "3",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "18000",
    maxSalary: "30000",
    vacancies: 2
  },

  // Logistics & Manual roles
  "Delivery Boy": {
    description: `We are hiring Delivery Boys for our delivery operations.

Responsibilities:
• Pick up and deliver packages on time
• Navigate using GPS/maps
• Collect payments if required
• Maintain delivery records
• Handle customer queries during delivery

Requirements:
• Own bike with valid driving license
• Smartphone with internet
• Knowledge of local area
• Good physical fitness
• No experience required, training provided

Work Details:
• Full-time / Part-time options
• Flexible working hours
• Per delivery incentives
• Fuel allowance provided`,
    skills: "Bike Riding, GPS Navigation, Smartphone Usage, Local Area Knowledge, Customer Service",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "22000",
    vacancies: 10
  },
  "Driver": {
    description: `We are hiring Drivers for transportation services.

Responsibilities:
• Drive safely and follow traffic rules
• Maintain vehicle cleanliness
• Pick up and drop passengers/goods on time
• Keep vehicle logs updated
• Report any vehicle issues

Requirements:
• Valid driving license (LMV/HMV as applicable)
• Knowledge of local routes
• Good driving record
• Basic vehicle maintenance knowledge
• Experience preferred but freshers considered

Work Details:
• Full-time position
• Flexible hours may apply
• Fuel and maintenance provided
• Overtime pay available`,
    skills: "Driving, Route Knowledge, Vehicle Maintenance, Traffic Rules, Time Management",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "25000",
    vacancies: 3
  },
  "Helper": {
    description: `We are hiring Helpers for general assistance work.

Responsibilities:
• Provide general assistance and support
• Help with loading and unloading
• Maintain cleanliness of work area
• Assist in basic operational tasks
• Follow safety instructions

Requirements:
• Physical fitness
• Basic education
• Willingness to do manual work
• Punctuality
• No experience required

Work Details:
• Full-time position
• General work environment
• Manual work involved`,
    skills: "Physical Fitness, Manual Work, Basic Tasks, Punctuality, Team Work",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "15000",
    vacancies: 5
  },
  "Housekeeping Staff": {
    description: `We are hiring Housekeeping Staff for cleaning and maintenance.

Responsibilities:
• Clean and maintain assigned areas
• Manage cleaning supplies
• Report maintenance issues
• Follow hygiene standards
• Dispose waste properly

Requirements:
• Physical fitness
• Attention to cleanliness
• Punctuality
• No formal education required
• No experience required

Work Details:
• Full-time position
• Shift-based work
• Uniform provided
• PF and ESI benefits`,
    skills: "Cleaning, Hygiene, Physical Fitness, Time Management, Attention to Detail",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "15000",
    vacancies: 5
  },
  "Loader": {
    description: `We are hiring Loaders for loading and unloading operations.

Responsibilities:
• Load and unload goods safely
• Handle materials and packages
• Maintain warehouse organization
• Follow safety procedures
• Report any damages or issues

Requirements:
• Physical fitness and strength
• Basic education
• Attention to safety
• Ability to lift heavy objects
• Freshers welcome

Work Details:
• Full-time position
• Warehouse-based work
• Physical work involved`,
    skills: "Physical Fitness, Loading, Unloading, Safety, Team Work",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "16000",
    vacancies: 6
  },
  "Machine Operator": {
    description: `We are hiring Machine Operators to operate industrial machinery.

Responsibilities:
• Operate assigned machinery safely
• Monitor machine performance
• Perform basic maintenance tasks
• Follow production procedures
• Report machine issues

Requirements:
• Basic understanding of machinery
• Physical fitness
• Attention to safety
• ITI or relevant training preferred
• Freshers with training welcome

Work Details:
• Full-time position
• Factory/Production-based work
• Shift-based work`,
    skills: "Machine Operation, Safety, Maintenance, Production, Quality Control",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "20000",
    vacancies: 4
  },
  "Store Helper": {
    description: `We are hiring Store Helpers for retail store assistance.

Responsibilities:
• Assist customers in store
• Maintain store cleanliness
• Help with inventory management
• Arrange products on shelves
• Support sales activities

Requirements:
• Good communication skills
• Physical fitness
• Customer service orientation
• Basic education
• Freshers welcome

Work Details:
• Full-time position
• Retail store environment
• Standing work`,
    skills: "Customer Service, Communication, Physical Fitness, Organization, Sales Support",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "16000",
    vacancies: 3
  },
  "Technician": {
    description: `We are hiring Technicians for maintenance and repair work.

Responsibilities:
• Perform maintenance and repairs
• Diagnose technical problems
• Install and service equipment
• Maintain service records
• Ensure customer satisfaction

Requirements:
• ITI/Diploma in relevant trade
• Technical knowledge
• Problem-solving skills
• Good with tools
• Freshers with technical background welcome

Work Details:
• Full-time position
• Field/Workshop-based work
• Tool kit provided
• Training available`,
    skills: "Technical Skills, Troubleshooting, Tool Usage, Customer Service, Record Keeping",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "25000",
    vacancies: 3
  },
  "Warehouse Helper": {
    description: `We are hiring Warehouse Helpers for warehouse operations.

Responsibilities:
• Assist in warehouse activities
• Help with loading and unloading
• Maintain warehouse organization
• Support inventory management
• Follow safety procedures

Requirements:
• Physical fitness
• Basic education
• Attention to detail
• Team player
• Freshers welcome

Work Details:
• Full-time position
• Warehouse-based work
• Shift-based work`,
    skills: "Physical Fitness, Organization, Inventory, Team Work, Safety",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "10000",
    maxSalary: "16000",
    vacancies: 4
  },

  // Skilled Trades
  "Electrician": {
    description: `We are hiring Electricians for electrical installation and maintenance.

Responsibilities:
• Install and repair electrical systems
• Read and follow electrical diagrams
• Ensure safety standards compliance
• Troubleshoot electrical problems
• Maintain electrical equipment

Requirements:
• ITI in Electrical or equivalent
• Knowledge of electrical systems
• Safety awareness
• Physical fitness
• Freshers with ITI certificate welcome

Work Details:
• Full-time position
• Site-based work
• Safety equipment provided
• Overtime may be required`,
    skills: "Electrical Wiring, Troubleshooting, Safety, Blueprint Reading, Hand Tools",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "28000",
    vacancies: 2
  },
  "Plumber": {
    description: `We are hiring Plumbers for plumbing installation and repairs.

Responsibilities:
• Install and repair plumbing systems
• Troubleshoot plumbing issues
• Ensure water system safety
• Maintain plumbing equipment
• Follow plumbing codes and standards

Requirements:
• ITI in Plumbing or equivalent
• Knowledge of plumbing systems
• Physical fitness
• Basic tools knowledge
• Freshers with training welcome

Work Details:
• Full-time position
• Site-based work
• Field work involved`,
    skills: "Plumbing, Installation, Repairs, Safety, Tools, Water Systems",
    minExperience: "0",
    maxExperience: "2",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "15000",
    maxSalary: "25000",
    vacancies: 2
  },
  "Security Guard": {
    description: `We are hiring Security Guards for premises security.

Responsibilities:
• Monitor and patrol assigned areas
• Control entry and exit of visitors
• Report security incidents
• Maintain visitor logs
• Ensure safety of premises

Requirements:
• Physical fitness
• Alertness and vigilance
• Basic communication skills
• 10th pass minimum
• Ex-servicemen preferred but not mandatory

Work Details:
• Full-time position
• 8/12 hour shifts
• Uniform provided
• PF and ESI benefits`,
    skills: "Vigilance, Physical Fitness, Communication, First Aid, Emergency Response",
    minExperience: "0",
    maxExperience: "1",
    jobType: "Full-time",
    workMode: "Office",
    minSalary: "12000",
    maxSalary: "18000",
    vacancies: 5
  }
};

// Location dropdown data for India
// INDIAN_STATES is now imported from constants/locationData.js as stateOptions

// Location data is now imported from constants/locationData.js

// Component for creating a new job posting
export default function AdminPostJob() {
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({
    roleId: "",
    company: "",
    jobType: "Full-time",
    workMode: "Office",
    city: "",
    state: "",
    country: "India",
    locality: "",
    skills: "",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    vacancies: 1,
    description: "",
    interviewAddress: "",
    contactEmail: "",
    contactPhone: "",
    showInterviewAddress: true,
    showContactPhone: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  // Searchable select state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Searchable select functions
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRoleName = roles.find(role => String(role.id) === String(form.roleId))?.name || "";

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // If the user is typing something different from the selected role, clear the selection
    const selectedRoleName = roles.find(role => String(role.id) === String(form.roleId))?.name || "";
    if (value && form.roleId && value !== selectedRoleName) {
      handleRoleChange({ target: { value: "" } });
    }
    // If the user clears the input completely, also clear the selected value
    else if (value === "") {
      handleRoleChange({ target: { value: "" } });
    }
  };

  const handleOptionSelect = (roleId) => {
    const selectedRole = roles.find(role => String(role.id) === String(roleId));

    // Set the search term first
    setSearchTerm(selectedRole?.name || "");

    // Then handle the role change
    handleRoleChange({ target: { value: roleId } });

    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    // Close dropdown when input loses focus
    setTimeout(() => setIsDropdownOpen(false), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  // Track which fields were auto-filled
  const [autoFilledFields, setAutoFilledFields] = useState(new Set());

  // Store recruiter profile data for reuse (reset, etc.)
  const [recruiterDefaults, setRecruiterDefaults] = useState({
    company: "",
    city: "",
    state: "",
    country: "India",
    interviewAddress: "",
    contactEmail: "",
    contactPhone: ""
  });

  // Apply auto-fill based on role name (always fills role-related fields)
  const applyRoleAutoFill = useCallback((roleName) => {
    if (!roleName) {
      setAutoFilledFields(new Set());
      return {
        description: "",
        skills: "",
        minExperience: "",
        maxExperience: "",
        minSalary: "",
        maxSalary: "",
        jobType: "Full-time",
        workMode: "Office",
        vacancies: 1,
      };
    }

    // Find auto-fill data for this role (case-insensitive)
    const normalizedRoleName = roleName?.trim();
    let autoFillData = ROLE_AUTO_FILL_DATA[normalizedRoleName];

    // If not found, try case-insensitive match
    if (!autoFillData) {
      const roleKeys = Object.keys(ROLE_AUTO_FILL_DATA);
      const matchingKey = roleKeys.find(key =>
        key.toLowerCase() === normalizedRoleName?.toLowerCase()
      );
      if (matchingKey) {
        autoFillData = ROLE_AUTO_FILL_DATA[matchingKey];
      }
    }

    const newAutoFilledFields = new Set();
    const updates = {
      description: "",
      skills: "",
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      jobType: "Full-time",
      workMode: "Office",
      vacancies: 1,
    };


    if (autoFillData) {
      // Description
      if (autoFillData.description) {
        updates.description = autoFillData.description;
        newAutoFilledFields.add("description");
      }

      // Skills
      if (autoFillData.skills) {
        updates.skills = autoFillData.skills;
        newAutoFilledFields.add("skills");
      }

      // Experience
      if (autoFillData.minExperience) {
        updates.minExperience = autoFillData.minExperience;
        newAutoFilledFields.add("minExperience");
      }
      if (autoFillData.maxExperience) {
        updates.maxExperience = autoFillData.maxExperience;
        newAutoFilledFields.add("maxExperience");
      }

      // Job Type
      if (autoFillData.jobType) {
        updates.jobType = autoFillData.jobType;
        if (autoFillData.jobType !== "Full-time") {
          newAutoFilledFields.add("jobType");
        }
      }

      // Work Mode
      if (autoFillData.workMode) {
        updates.workMode = autoFillData.workMode;
        if (autoFillData.workMode !== "Office") {
          newAutoFilledFields.add("workMode");
        }
      }

      // Salary
      if (autoFillData.minSalary) {
        updates.minSalary = autoFillData.minSalary;
        newAutoFilledFields.add("minSalary");
      }
      if (autoFillData.maxSalary) {
        updates.maxSalary = autoFillData.maxSalary;
        newAutoFilledFields.add("maxSalary");
      }

      // Vacancies
      if (autoFillData.vacancies) {
        updates.vacancies = autoFillData.vacancies;
        if (autoFillData.vacancies !== 1) {
          newAutoFilledFields.add("vacancies");
        }
      }
    }

    setAutoFilledFields(newAutoFilledFields);
    return updates;
  }, []);

  // Fetch job roles from backend
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/jobs/roles");
        if (!alive) return;
        if (data?.ok && Array.isArray(data.roles)) {
          setRoles(data.roles);
        } else {
          setRolesError("Unable to load job roles. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching job roles:", err);
        if (alive) {
          setRolesError("Unable to load job roles. Please try again later.");
        }
      } finally {
        if (alive) setRolesLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Fetch recruiter profile and user session to auto-fill company details
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Fetch recruiter profile and user session in parallel
        const [profileRes, sessionRes] = await Promise.all([
          api.get("/recruiter-profile/recruiter").catch(() => null),
          api.get("/auth/session").catch(() => null)
        ]);

        if (!alive) return;

        const recruiterProfile = profileRes?.data?.recruiter || null;
        const userSession = sessionRes?.data?.user || null;

        // Build default values from recruiter profile
        const defaults = {
          company: recruiterProfile?.company_name || "",
          city: recruiterProfile?.city || "",
          state: recruiterProfile?.state || "",
          country: recruiterProfile?.country || "India",
          interviewAddress: "",
          contactEmail: userSession?.email || "",
          contactPhone: recruiterProfile?.hr_mobile || ""
        };

        // Build interview address from profile
        if (recruiterProfile) {
          const addressParts = [
            recruiterProfile.address_line1,
            recruiterProfile.address_line2,
            recruiterProfile.city,
            recruiterProfile.state,
            recruiterProfile.pincode
          ].filter(Boolean);

          if (addressParts.length > 0) {
            defaults.interviewAddress = addressParts.join(", ");
          }
        }

        // Save defaults for reset functionality
        setRecruiterDefaults(defaults);

        // Auto-fill form fields (only if fields are empty)
        setForm((currentForm) => {
          const updates = {};

          if (!currentForm.company && defaults.company) {
            updates.company = defaults.company;
          }
          if (!currentForm.city && defaults.city) {
            updates.city = defaults.city;
          }
          if (!currentForm.state && defaults.state) {
            updates.state = defaults.state;
          }
          if (!currentForm.country) {
            updates.country = defaults.country || "India";
          }
          if (!currentForm.interviewAddress && defaults.interviewAddress) {
            updates.interviewAddress = defaults.interviewAddress;
          }
          if (!currentForm.contactEmail && defaults.contactEmail) {
            updates.contactEmail = defaults.contactEmail;
          }
          if (!currentForm.contactPhone && defaults.contactPhone) {
            updates.contactPhone = defaults.contactPhone;
          }

          if (Object.keys(updates).length > 0) {
            return { ...currentForm, ...updates };
          }
          return currentForm;
        });

      } catch (err) {
        // Silently fail - auto-fill is a convenience feature
        console.error("Error fetching recruiter profile for auto-fill:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update searchTerm when form.roleId changes externally
  useEffect(() => {
    if (form.roleId) {
      const selectedRole = roles.find(role => String(role.id) === String(form.roleId));
      if (selectedRole && searchTerm !== selectedRole.name) {
        setSearchTerm(selectedRole.name);
      }
    }
  }, [form.roleId, roles]);


  const [fieldTouched, setFieldTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) return ""; // Email is optional if phone is provided
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return ""; // Phone is optional if email is provided
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid 10-digit Indian mobile number (starting with 6-9)";
    return "";
  };

  const validateNumericRange = (min, max, fieldName) => {
    if (min && max) {
      const minNum = Number(min);
      const maxNum = Number(max);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        if (minNum > maxNum) return `${fieldName}: Minimum cannot exceed maximum`;
      }
    }
    return "";
  };

  const validateField = (name, value) => {
    let error = "";
    const formData = form;

    switch (name) {
      case "roleId":
        if (!value) error = "Job role is required";
        break;
      case "company":
        if (!value.trim()) error = "Company name is required";
        break;
      case "city":
        if (formData.workMode !== 'Remote' && !value.trim()) {
          error = "City is required (optional for remote jobs)";
        }
        break;
      case "description":
        if (!value.trim()) error = "Job description is required";
        else if (value.trim().length < 50) error = "Job description must be at least 50 characters";
        break;
      case "contactEmail":
        error = validateEmail(value);
        // If both email and phone are empty, show error on contact field
        if (!value.trim() && !formData.contactPhone.trim()) {
          error = "Please provide either email or phone";
        }
        break;
      case "contactPhone":
        error = validatePhone(value);
        // If both email and phone are empty, show error on contact field
        if (!value.trim() && !formData.contactEmail.trim()) {
          error = "Please provide either email or phone";
        }
        break;
      case "minExperience":
        if (value && (isNaN(value) || Number(value) < 0)) {
          error = "Minimum experience must be a number >= 0";
        } else if (formData.maxExperience && value && Number(value) > Number(formData.maxExperience)) {
          error = "Minimum experience cannot exceed maximum experience";
        }
        break;
      case "maxExperience":
        if (value && (isNaN(value) || Number(value) < 0)) {
          error = "Maximum experience must be a number >= 0";
        } else if (formData.minExperience && value && Number(value) < Number(formData.minExperience)) {
          error = "Maximum experience cannot be less than minimum experience";
        }
        break;
      case "minSalary":
        if (value && (isNaN(value) || Number(value) < 0)) {
          error = "Minimum salary must be a positive number";
        } else if (formData.maxSalary && value && Number(value) > Number(formData.maxSalary)) {
          error = "Minimum salary cannot exceed maximum salary";
        }
        break;
      case "maxSalary":
        if (value && (isNaN(value) || Number(value) < 0)) {
          error = "Maximum salary must be a positive number";
        } else if (formData.minSalary && value && Number(value) < Number(formData.minSalary)) {
          error = "Maximum salary cannot be less than minimum salary";
        }
        break;
      case "vacancies":
        const vacanciesNum = Number(value);
        if (isNaN(vacanciesNum) || vacanciesNum < 1 || !Number.isInteger(vacanciesNum)) {
          error = "Vacancies must be an integer >= 1";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Update form field with real-time validation
  function updateField(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    // Validate this field if it's been touched
    if (fieldTouched[name]) {
      validateField(name, value);
      // Also validate related fields for numeric ranges
      if (name === "minExperience" || name === "maxExperience") {
        if (fieldTouched.minExperience || fieldTouched.maxExperience) {
          validateField("minExperience", name === "minExperience" ? value : form.minExperience);
          validateField("maxExperience", name === "maxExperience" ? value : form.maxExperience);
        }
      }
      if (name === "minSalary" || name === "maxSalary") {
        if (fieldTouched.minSalary || fieldTouched.maxSalary) {
          validateField("minSalary", name === "minSalary" ? value : form.minSalary);
          validateField("maxSalary", name === "maxSalary" ? value : form.maxSalary);
        }
      }
      // Re-validate contact fields if one changes
      if (name === "contactEmail" || name === "contactPhone") {
        if (fieldTouched.contactEmail || fieldTouched.contactPhone) {
          validateField("contactEmail", name === "contactEmail" ? value : form.contactEmail);
          validateField("contactPhone", name === "contactPhone" ? value : form.contactPhone);
        }
      }
    }
    // Clear error when user starts typing
    setErrors((e) => ({ ...e, [name]: "" }));
  }

  const handleBlur = (name, value) => {
    setFieldTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value || form[name]);
  };

  function validate() {
    // Mark all required fields as touched
    const requiredFields = ["roleId", "company", "description", "contactEmail", "contactPhone"];
    requiredFields.forEach(field => {
      setFieldTouched(prev => ({ ...prev, [field]: true }));
      validateField(field, form[field]);
    });

    // Validate city if not remote
    if (form.workMode !== 'Remote') {
      setFieldTouched(prev => ({ ...prev, city: true }));
      validateField("city", form.city);
    }

    // Validate numeric fields if they have values
    if (form.minExperience || form.maxExperience) {
      setFieldTouched(prev => ({ ...prev, minExperience: true, maxExperience: true }));
      validateField("minExperience", form.minExperience);
      validateField("maxExperience", form.maxExperience);
    }

    if (form.minSalary || form.maxSalary) {
      setFieldTouched(prev => ({ ...prev, minSalary: true, maxSalary: true }));
      validateField("minSalary", form.minSalary);
      validateField("maxSalary", form.maxSalary);
    }

    if (form.vacancies) {
      setFieldTouched(prev => ({ ...prev, vacancies: true }));
      validateField("vacancies", form.vacancies);
    }

    const err = {};
    if (!form.roleId) err.roleId = "Job role is required";
    if (!form.company.trim()) err.company = "Company name is required";
    if (form.workMode !== 'Remote' && !form.city.trim()) err.city = "City required (optional for remote jobs)";
    if (!form.description.trim()) err.description = "Job description required";
    else if (form.description.trim().length < 50) err.description = "Job description must be at least 50 characters";
    if (!form.contactEmail.trim() && !form.contactPhone.trim()) err.contact = "Provide email or phone";
    if (form.contactEmail.trim() && validateEmail(form.contactEmail)) err.contactEmail = validateEmail(form.contactEmail);
    if (form.contactPhone.trim() && validatePhone(form.contactPhone)) err.contactPhone = validatePhone(form.contactPhone);
    if (form.vacancies <= 0 || !Number.isInteger(form.vacancies)) err.vacancies = "Vacancies must be >= 1";

    // Numeric range validations
    if (form.minExperience && form.maxExperience) {
      const minExp = Number(form.minExperience);
      const maxExp = Number(form.maxExperience);
      if (minExp > maxExp) err.maxExperience = "Maximum experience cannot be less than minimum experience";
    }
    if (form.minSalary && form.maxSalary) {
      const minSal = Number(form.minSalary);
      const maxSal = Number(form.maxSalary);
      if (minSal > maxSal) err.maxSalary = "Maximum salary cannot be less than minimum salary";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // Handle role change with auto-fill - resets and refills all role-related fields
  function handleRoleChange(e) {
    const selectedId = e.target.value;
    const selectedRole = roles.find(r => String(r.id) === String(selectedId));
    const roleName = selectedRole?.name || null;


    // Get auto-fill values for the selected role (resets all role-related fields)
    const autoFillUpdates = applyRoleAutoFill(roleName);

    // Update form: keep recruiter profile fields, reset and refill role-related fields
    const newForm = {
      roleId: selectedId,
      // Keep recruiter profile fields unchanged
      company: form.company,
      city: form.city,
      state: form.state,
      country: form.country,
      locality: form.locality,
      interviewAddress: form.interviewAddress,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      // Apply auto-fill for role-related fields
      ...autoFillUpdates,
    };

    setForm(newForm);

    setErrors({});
  }


  // Helper: capitalize first character and lowercase the rest
  function capitalizeFirst(str) {
    if (!str && str !== "") return "";
    const s = String(str).trim();
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(null);

    if (!termsAccepted) {
      showError("Please confirm that this is a genuine job opening and accept the Terms & Conditions.");
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      // normalize company name
      const normalizedCompany = capitalizeFirst(form.company);

      // Create formData for file upload
      const payload = new FormData();

      // Append all form fields
      payload.append("roleId", form.roleId);
      payload.append("company", normalizedCompany);
      payload.append("jobType", form.jobType);
      payload.append("workMode", form.workMode);
      payload.append("city", form.city);
      payload.append("state", form.state);
      payload.append("country", form.country);
      payload.append("locality", form.locality);
      payload.append("skills", form.skills);
      payload.append("minExperience", form.minExperience);
      payload.append("maxExperience", form.maxExperience);
      payload.append("minSalary", form.minSalary);
      payload.append("maxSalary", form.maxSalary);
      payload.append("vacancies", form.vacancies.toString());
      payload.append("description", form.description);
      payload.append("interviewAddress", form.interviewAddress);
      payload.append("contactEmail", form.contactEmail);
      payload.append("contactPhone", form.contactPhone);
      payload.append("showInterviewAddress", form.showInterviewAddress.toString());
      payload.append("showContactPhone", form.showContactPhone.toString());

      // send to backend using axios instance
      const { data } = await api.post("/recruiter/jobs/create", payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess(data?.message || "Job posted successfully.");

      // clear form - keep recruiter profile defaults for next posting
      setForm({
        roleId: "",
        company: recruiterDefaults.company,
        jobType: "Full-time",
        workMode: "Office",
        city: recruiterDefaults.city,
        state: recruiterDefaults.state,
        country: recruiterDefaults.country,
        locality: "",
        skills: "",
        minExperience: "",
        maxExperience: "",
        minSalary: "",
        maxSalary: "",
        vacancies: 1,
        description: "",
        interviewAddress: recruiterDefaults.interviewAddress,
        contactEmail: recruiterDefaults.contactEmail,
        contactPhone: recruiterDefaults.contactPhone,
        showInterviewAddress: true,
        showContactPhone: true,
      });
      setSearchTerm("");
      setErrors({});
      setAutoFilledFields(new Set());
    } catch (err) {
      setSuccess(null);
      const errorMessage = err?.response?.data?.message || err.message || "Submit failed";
      showError(errorMessage);
      console.error("Job creation error:", err);
    } finally {
      setSubmitting(false);
    }
  }


  // Input class for corporate styling
  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const inputErrorClass = "w-full px-4 py-3 bg-white border border-primary-400 rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const inputAutoClass = "w-full px-4 py-3 bg-primary-50 border border-primary-300 rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-xl font-semibold text-gray-900">Post a New Job</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a job posting</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Alerts */}
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
              {success}
            </div>
          )}
          {errors.submit && (
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-4 text-primary-800 text-sm">
              {errors.submit}
            </div>
          )}
          {autoFilledFields.size > 0 && (
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-4 text-primary-800 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-semibold">Fields auto-filled based on job role</strong>
                <p className="mt-0.5 text-xs opacity-80">You can edit any of these values as needed.</p>
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Job Role */}
              <div>
                <label className={labelClass}>Job Role <span className="text-primary-500">*</span></label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    // For job role, we rely on submit-time validation and role change,
                    // not on blur, to avoid race conditions with async state updates.
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={rolesLoading ? "Loading roles..." : "-- Select or type to search job role --"}
                    className={`${selectClass} ${errors.roleId && fieldTouched.roleId ? '!border-red-500' : ''}`}
                    disabled={rolesLoading || !!rolesError}
                    required={!!form.roleId}
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isDropdownOpen && !rolesLoading && !rolesError && (
                    <div
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking options
                    >
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                          <div
                            key={role.id}
                            onMouseDown={() => handleOptionSelect(role.id)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {role.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No roles found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {rolesError && <p className="text-xs text-primary-600 mt-1.5">{rolesError}</p>}
                {errors.roleId && fieldTouched.roleId && <p className="text-xs text-red-600 mt-1.5">{errors.roleId}</p>}
                <p className="text-xs text-gray-400 mt-1.5">Selecting a role will auto-fill related fields</p>
              </div>

              {/* Company, Job Type, Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Company <span className="text-primary-500">*</span></label>
                  <input
                    value={form.company}
                    readOnly
                    onChange={(e) => updateField("company", e.target.value)}
                    onBlur={() => handleBlur("company", form.company)}
                    placeholder="Enter company name"
                    className={errors.company && fieldTouched.company ? inputErrorClass.replace('border-primary-400', 'border-red-500') : inputClass}
                  />
                  {errors.company && fieldTouched.company && <p className="text-xs text-red-600 mt-1.5">{errors.company}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    Job Type
                    {autoFilledFields.has("jobType") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <select
                    value={form.jobType}
                    onChange={(e) => updateField("jobType", e.target.value)}
                    className={autoFilledFields.has("jobType") ? `${selectClass} !border-primary-300 !bg-primary-50` : selectClass}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Work from Home</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Work Mode
                    {autoFilledFields.has("workMode") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <select
                    value={form.workMode}
                    onChange={(e) => updateField("workMode", e.target.value)}
                    className={autoFilledFields.has("workMode") ? `${selectClass} !border-primary-300 !bg-primary-50` : selectClass}
                  >
                    <option>Office</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Openings */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">Location & Openings</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    value={form.country || "India"}
                    readOnly
                    className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <select
                    value={form.state}
                    onChange={(e) => {
                      updateField("state", e.target.value);
                      // Clear city when state changes
                      updateField("city", "");
                    }}
                    className={selectClass}
                  >
                    <option value="">Select State</option>
                    {stateOptions.slice(1).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    City {form.workMode !== 'Remote' && <span className="text-primary-500">*</span>}
                    {form.workMode === 'Remote' && <span className="text-xs text-gray-500 ml-1">(optional for remote jobs)</span>}
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    onBlur={() => handleBlur("city", form.city)}
                    className={errors.city && fieldTouched.city ? `${selectClass} border-red-500` : selectClass}
                    disabled={!form.state && form.workMode !== 'Remote'}
                  >
                    <option value="">
                      {form.state ? "Select City" : (form.workMode === 'Remote' ? "Optional for remote jobs" : "Select State first")}
                    </option>
                    {form.state && citiesByState[form.state]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && fieldTouched.city && <p className="text-xs text-red-600 mt-1.5">{errors.city}</p>}
                  {form.workMode === 'Remote' && (
                    <p className="text-xs text-gray-500 mt-1.5">City not required for remote positions</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Locality / Area</label>
                  <input
                    value={form.locality}
                    onChange={(e) => updateField("locality", e.target.value)}
                    placeholder="Enter locality (optional)"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Number of Openings
                  {autoFilledFields.has("vacancies") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                </label>
                <input
                  type="number"
                  value={form.vacancies}
                  onChange={(e) => updateField("vacancies", Math.max(1, Number(e.target.value || 1)))}
                  onBlur={() => handleBlur("vacancies", form.vacancies)}
                  className={errors.vacancies && fieldTouched.vacancies
                    ? (autoFilledFields.has("vacancies") ? inputAutoClass.replace('border-primary-300', 'border-red-500') : inputErrorClass.replace('border-primary-400', 'border-red-500'))
                    : (autoFilledFields.has("vacancies") ? inputAutoClass : inputClass)}
                />
                {errors.vacancies && fieldTouched.vacancies && <p className="text-xs text-red-600 mt-1.5">{errors.vacancies}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Experience & Salary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">Experience & Compensation</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className={labelClass}>
                    Min Experience (Yrs)
                    {autoFilledFields.has("minExperience") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <input
                    value={form.minExperience}
                    onChange={(e) => updateField("minExperience", e.target.value)}
                    onBlur={() => handleBlur("minExperience", form.minExperience)}
                    placeholder="0"
                    className={errors.minExperience && fieldTouched.minExperience
                      ? (autoFilledFields.has("minExperience") ? inputAutoClass.replace('border-primary-300', 'border-red-500') : inputErrorClass.replace('border-primary-400', 'border-red-500'))
                      : (autoFilledFields.has("minExperience") ? inputAutoClass : inputClass)}
                  />
                  {errors.minExperience && fieldTouched.minExperience && <p className="text-xs text-red-600 mt-1.5">{errors.minExperience}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    Max Experience (Yrs)
                    {autoFilledFields.has("maxExperience") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <input
                    value={form.maxExperience}
                    onChange={(e) => updateField("maxExperience", e.target.value)}
                    onBlur={() => handleBlur("maxExperience", form.maxExperience)}
                    placeholder="3"
                    className={errors.maxExperience && fieldTouched.maxExperience
                      ? (autoFilledFields.has("maxExperience") ? inputAutoClass.replace('border-primary-300', 'border-red-500') : inputErrorClass.replace('border-primary-400', 'border-red-500'))
                      : (autoFilledFields.has("maxExperience") ? inputAutoClass : inputClass)}
                  />
                  {errors.maxExperience && fieldTouched.maxExperience && <p className="text-xs text-red-600 mt-1.5">{errors.maxExperience}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    Min Salary / Month
                    {autoFilledFields.has("minSalary") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <input
                    type="number"
                    value={form.minSalary}
                    onChange={(e) => updateField("minSalary", e.target.value)}
                    onBlur={() => handleBlur("minSalary", form.minSalary)}
                    placeholder="20000"
                    className={errors.minSalary && fieldTouched.minSalary
                      ? (autoFilledFields.has("minSalary") ? inputAutoClass.replace('border-primary-300', 'border-red-500') : inputErrorClass.replace('border-primary-400', 'border-red-500'))
                      : (autoFilledFields.has("minSalary") ? inputAutoClass : inputClass)}
                  />
                  {errors.minSalary && fieldTouched.minSalary && <p className="text-xs text-red-600 mt-1.5">{errors.minSalary}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    Max Salary / Month
                    {autoFilledFields.has("maxSalary") && <span className="text-primary-500 ml-1 normal-case">(auto)</span>}
                  </label>
                  <input
                    type="number"
                    value={form.maxSalary}
                    onChange={(e) => updateField("maxSalary", e.target.value)}
                    onBlur={() => handleBlur("maxSalary", form.maxSalary)}
                    placeholder="40000"
                    className={errors.maxSalary && fieldTouched.maxSalary
                      ? (autoFilledFields.has("maxSalary") ? inputAutoClass.replace('border-primary-300', 'border-red-500') : inputErrorClass.replace('border-primary-400', 'border-red-500'))
                      : (autoFilledFields.has("maxSalary") ? inputAutoClass : inputClass)}
                  />
                  {errors.maxSalary && fieldTouched.maxSalary && <p className="text-xs text-red-600 mt-1.5">{errors.maxSalary}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Job Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">Job Details</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClass}>
                  Job Description <span className="text-primary-500">*</span>
                  {autoFilledFields.has("description") && <span className="text-primary-500 ml-1 normal-case">(auto-filled)</span>}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  onBlur={() => handleBlur("description", form.description)}
                  placeholder="Enter job responsibilities, requirements, benefits, and other details..."
                  rows={10}
                  className={`${errors.description && fieldTouched.description
                    ? inputErrorClass.replace('border-primary-400', 'border-red-500')
                    : autoFilledFields.has("description")
                      ? inputAutoClass
                      : inputClass
                    } resize-y`}
                />
                {errors.description && fieldTouched.description && <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>}
                {!errors.description && fieldTouched.description && form.description.trim().length > 0 && form.description.trim().length < 50 && (
                  <p className="text-xs text-gray-500 mt-1.5">Description must be at least 50 characters (currently {form.description.trim().length})</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Skills & Technologies
                  {autoFilledFields.has("skills") && <span className="text-primary-500 ml-1 normal-case">(auto-filled)</span>}
                </label>
                <input
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="Enter skills separated by commas (e.g., React, Node.js, SQL)"
                  className={autoFilledFields.has("skills") ? inputAutoClass : inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-800">Contact Information</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Interview / Office Address</label>
                  <button
                    type="button"
                    onClick={() => updateField("showInterviewAddress", !form.showInterviewAddress)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      form.showInterviewAddress
                        ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                        : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {form.showInterviewAddress ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Show to Candidates
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                        Hidden from Candidates
                      </>
                    )}
                  </button>
                </div>
                <input
                  value={form.interviewAddress}
                  onChange={(e) => updateField("interviewAddress", e.target.value)}
                  placeholder="Enter full address for interviews"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input
                    value={form.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                    onBlur={() => handleBlur("contactEmail", form.contactEmail)}
                    placeholder="hr@company.com"
                    type="email"
                    className={errors.contactEmail && fieldTouched.contactEmail
                      ? inputErrorClass.replace('border-primary-400', 'border-red-500')
                      : inputClass}
                  />
                  {errors.contactEmail && fieldTouched.contactEmail && <p className="text-xs text-red-600 mt-1.5">{errors.contactEmail}</p>}
                  {errors.contact && !form.contactEmail.trim() && !form.contactPhone.trim() && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.contact}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Contact Phone</label>
                    <button
                      type="button"
                      onClick={() => updateField("showContactPhone", !form.showContactPhone)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        form.showContactPhone
                          ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                          : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {form.showContactPhone ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                          Show to Candidates
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                          Hidden from Candidates
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    value={form.contactPhone}
                    readOnly
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                    onBlur={() => handleBlur("contactPhone", form.contactPhone)}
                    placeholder="9876543210"
                    type="tel"
                    className={errors.contactPhone && fieldTouched.contactPhone
                      ? inputErrorClass.replace('border-primary-400', 'border-red-500')
                      : inputClass}
                  />
                  {errors.contactPhone && fieldTouched.contactPhone && <p className="text-xs text-red-600 mt-1.5">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">
              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms-checkbox-job"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  required
                />
                <label htmlFor="terms-checkbox-job" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  I confirm this is a genuine job opening and I agree to Jobion's{" "}
                  <Link to="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                    job posting policies
                  </Link>.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      roleId: "",
                      company: recruiterDefaults.company,
                      jobType: "Full-time",
                      workMode: "Office",
                      city: recruiterDefaults.city,
                      state: recruiterDefaults.state,
                      country: recruiterDefaults.country,
                      locality: "",
                      skills: "",
                      minExperience: "",
                      maxExperience: "",
                      minSalary: "",
                      maxSalary: "",
                      vacancies: 1,
                      description: "",
                      interviewAddress: recruiterDefaults.interviewAddress,
                      contactEmail: recruiterDefaults.contactEmail,
                      contactPhone: recruiterDefaults.contactPhone,
                      showInterviewAddress: true,
                      showContactPhone: true,
                    });
                    setSearchTerm("");
                    setErrors({});
                    setSuccess(null);
                    setTermsAccepted(false);
                    setAutoFilledFields(new Set());
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={submitting || !termsAccepted}
                  className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

