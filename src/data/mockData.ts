import { AccessCenterOrganization, Opportunity } from "../types"

// Clean initial data for real production foundation.
// No fake students, no fake conversations, no fake notifications, no fake posts.

export const INITIAL_ACCESS_CENTERS: AccessCenterOrganization[] = [
  {
    id: "center-yan-digital",
    name: "Youth Awareness Network",
    tagline: "Digitizing for All — Free Digital Services & Transformation",
    logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    type: "youth_org",
    description:
      "A flagship free digital enablement initiative dedicated to closing the digital divide by equipping small businesses, schools, hospitals, clinics, and student initiatives with modern digital infrastructure at zero cost.",
    mission:
      "Empower every community institution, local clinic, and emerging student venture with dignified, secure, and modern digital presence without economic barriers.",
    website: "https://youthawarenessnetwork.org/digitizing",
    email: "digital@youthawarenessnetwork.org",
    phone: "+1 (800) 524-YAN1",
    location: "Global Support / Regional Community Hubs",
    targetBeneficiaries: [
      "Small Businesses",
      "Schools & Educators",
      "Hospitals & Clinics",
      "Community Initiatives",
      "Student Non-Profits",
    ],
    serviceDeliveryMode: "online",
    status: "approved",
    verified: true,
    createdAt: "2026-01-15",
    managerEmail: "digital@youthawarenessnetwork.org",
    services: [
      {
        id: "svc-yan-web",
        centerId: "center-yan-digital",
        title: "Free Website Creation & Deployment",
        category: "digital_tech",
        description:
          "End-to-end design, responsive development, and hosting setup of a professional website for qualifying schools, clinics, community groups, and local small enterprises.",
        targetBeneficiaries: [
          "Schools & Educators",
          "Hospitals & Clinics",
          "Small Businesses",
          "Community Initiatives",
        ],
        deliveryMode: "online",
        isFree: true,
        leadTime: "5-7 business days",
        eligibilityCriteria:
          "Open to small local businesses, accredited schools, community health clinics, and grassroots non-profits.",
        active: true,
      },
      {
        id: "svc-yan-setup",
        centerId: "center-yan-digital",
        title: "Digital Setup & Infrastructure Assistance",
        category: "digital_tech",
        description:
          "Hands-on assistance setting up custom domain names, professional email systems (Google Workspace / MS 365 non-profit), secure backups, and cloud storage.",
        targetBeneficiaries: [
          "Schools & Educators",
          "Small Businesses",
          "Student Non-Profits",
        ],
        deliveryMode: "online",
        isFree: true,
        leadTime: "2-3 business days",
        eligibilityCriteria:
          "Any community organization or small business needing modernization support.",
        active: true,
      },
      {
        id: "svc-yan-consult",
        centerId: "center-yan-digital",
        title: "Basic Digital Consulting & Cybersecurity Awareness",
        category: "consulting_guidance",
        description:
          "Comprehensive assessment of existing digital tools, recommendations for open-source workflow improvements, data privacy fundamentals, and cybersecurity posture review.",
        targetBeneficiaries: [
          "Small Businesses",
          "Schools & Educators",
          "Hospitals & Clinics",
        ],
        deliveryMode: "online",
        isFree: true,
        leadTime: "3 business days",
        eligibilityCriteria: "All eligible community organizations.",
        active: true,
      },
      {
        id: "svc-yan-awareness",
        centerId: "center-yan-digital",
        title: "Digital Awareness & Student Skill Workshops",
        category: "education",
        description:
          "Interactive seminars for students and community members covering digital literacy, collaborative productivity software, and online safety.",
        targetBeneficiaries: [
          "Students",
          "Schools & Educators",
          "Community Initiatives",
        ],
        deliveryMode: "hybrid",
        isFree: true,
        leadTime: "Weekly scheduled sessions",
        eligibilityCriteria: "Open to all enrolled students and educators.",
        active: true,
      },
    ],
  },
  {
    id: "center-yan-consulting",
    name: "Free Consulting & Awareness Center",
    tagline: "Educational Guidance, Student Mentorship & Community Strategy",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    type: "consulting",
    description:
      "A dedicated community consulting branch operated by Youth Awareness Network, offering free 1-on-1 advisory sessions, research guidance, collegiate planning, and community workshops.",
    mission:
      "Democratize access to professional consulting, academic pathway planning, and community leadership training for high school and university scholars.",
    website: "https://youthawarenessnetwork.org/consulting",
    email: "consulting@youthawarenessnetwork.org",
    phone: "+1 (800) 524-YAN2",
    location: "Global Remote / Virtual Clinics",
    targetBeneficiaries: [
      "Students",
      "Youth Organizations",
      "Schools & Educators",
      "Community Initiatives",
    ],
    serviceDeliveryMode: "online",
    status: "approved",
    verified: true,
    createdAt: "2026-01-20",
    managerEmail: "consulting@youthawarenessnetwork.org",
    services: [
      {
        id: "svc-yan-advisory",
        centerId: "center-yan-consulting",
        title: "1-on-1 Academic & Career Pathway Advisory",
        category: "consulting_guidance",
        description:
          "Direct 45-minute confidential session with experienced academic advisors to review graduate school applications, fellowship statements, and career pivots.",
        targetBeneficiaries: ["Students"],
        deliveryMode: "online",
        isFree: true,
        leadTime: "Booked 2-4 days in advance",
        eligibilityCriteria:
          "Current undergraduate, graduate, or secondary school students.",
        active: true,
      },
      {
        id: "svc-yan-workshops",
        centerId: "center-yan-consulting",
        title: "Community Awareness & Educational Strategy Sessions",
        category: "education",
        description:
          "Structured workshops designed for youth clubs and community groups on project leadership, grant proposal drafting, and impact measurement.",
        targetBeneficiaries: [
          "Youth Organizations",
          "Community Initiatives",
          "Students",
        ],
        deliveryMode: "online",
        isFree: true,
        leadTime: "Bi-weekly cohort intake",
        eligibilityCriteria: "Registered student clubs or community groups.",
        active: true,
      },
    ],
  },
  {
    id: "center-greenroots-pending",
    name: "GreenRoots Environmental Education Collective",
    tagline:
      "Free Sustainability Audits & Environmental Curriculum for Schools",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    type: "ngo",
    description:
      "An environmental non-profit coalition providing free energy and waste audits, climate science kits, and interactive environmental workshops for primary and secondary public schools.",
    mission:
      "Equip public education institutions with practical sustainability tools and youth environmental advocacy curriculum at zero cost.",
    website: "https://greenrootscollective.org",
    email: "admissions@greenrootscollective.org",
    phone: "+1 (555) 392-8810",
    location: "Pacific Northwest & Virtual",
    targetBeneficiaries: [
      "Schools & Educators",
      "Students",
      "Community Initiatives",
    ],
    serviceDeliveryMode: "hybrid",
    status: "pending",
    verified: false,
    createdAt: "2026-02-18",
    applicantName: "Dr. Evelyn Reed",
    applicantEmail: "e.reed@greenrootscollective.org",
    services: [
      {
        id: "svc-greenroots-audit",
        centerId: "center-greenroots-pending",
        title: "Campus Sustainability & Waste Minimization Audit",
        category: "community_support",
        description:
          "Virtual or on-site analysis of school resource usage with actionable reduction blueprints.",
        targetBeneficiaries: ["Schools & Educators"],
        deliveryMode: "hybrid",
        isFree: true,
        leadTime: "10 business days",
        active: true,
      },
    ],
  },
]

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Rhodes Scholarship at Oxford University",
    provider: "Rhodes Trust",
    providerLogo:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
    category: "scholarship",
    description:
      "The world's oldest graduate scholarship, fully funding postgraduate study at the University of Oxford. Covers full university fees, annual living stipend, and worldwide networking with global scholar community.",
    eligibility: [
      "Undergraduate degree completed with first-class honors or GPA >= 3.8",
      "Ages 18-25 at time of application",
      "Demonstrated literary and scholastic attainments",
      "Energy to use one's talents to the full",
    ],
    location: "Oxford, United Kingdom",
    mode: "On-site",
    deadline: "2026-10-01",
    applicationUrl:
      "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/",
    compensation: "Full tuition + £19,000/yr living stipend + flights",
    postedBy: "Credento Opportunities Desk",
    createdAt: "2026-01-10",
  },
  {
    id: "opp-2",
    title: "Google Summer of Code (GSoC) 2026",
    provider: "Google Open Source",
    providerLogo:
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=200&q=80",
    category: "internship",
    description:
      "Global online mentoring program bringing student and beginner developers into open source software development. Spend 12-22 weeks writing code for prominent open-source organizations under experienced 1-on-1 mentorship.",
    eligibility: [
      "Enrolled in university or vocational program, or new contributor to open source",
      "18 years or older",
      "Proficiency in languages such as C++, Python, Rust, Go, or TypeScript",
    ],
    location: "Global Remote",
    mode: "Remote",
    deadline: "2026-04-14",
    applicationUrl: "https://summerofcode.withgoogle.com/",
    compensation:
      "Stipend adjusted by purchasing power parity ($1,500 - $6,600)",
    postedBy: "Credento Opportunities Desk",
    createdAt: "2026-01-12",
  },
  {
    id: "opp-3",
    title: "CERN Summer Student Programme 2026",
    provider: "European Organization for Nuclear Research (CERN)",
    providerLogo:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=200&q=80",
    category: "fellowship",
    description:
      "Join day-to-day experimental and theoretical work at the world's leading particle physics laboratory in Geneva. Attend high-level lectures by eminent physicists and collaborate with research teams on real particle collision datasets.",
    eligibility: [
      "Completed at least 3 years of full-time physics, computing, mathematics, or engineering studies",
      "Fluent in English or French",
      "Good academic record",
    ],
    location: "Geneva, Switzerland",
    mode: "On-site",
    deadline: "2026-01-31",
    applicationUrl: "https://careers.cern/summer-student-programme",
    compensation: "CHF 92 per day subsistence allowance + travel coverage",
    postedBy: "Credento Opportunities Desk",
    createdAt: "2026-01-05",
  },
  {
    id: "opp-4",
    title: "Stanford Biodesign Innovation Fellowship",
    provider: "Stanford Byers Center for Biodesign",
    providerLogo:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=200&q=80",
    category: "fellowship",
    description:
      "Intensive 10-month fellowship bringing together engineers, physicians, and business scholars to invent high-impact healthcare technologies through clinical immersion and prototype validation.",
    eligibility: [
      "Advanced degree in engineering, medicine, biology, or related discipline",
      "Passion for medical device and health technology innovation",
    ],
    location: "Stanford, CA, USA",
    mode: "On-site",
    deadline: "2026-08-15",
    applicationUrl:
      "https://biodesign.stanford.edu/programs/fellowships/innovation.html",
    compensation: "Competitive annual stipend + full health benefits",
    postedBy: "Credento Opportunities Desk",
    createdAt: "2026-01-20",
  },
]
