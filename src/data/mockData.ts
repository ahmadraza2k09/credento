import {
  AppNotification,
  Conversation,
  Opportunity,
  Post,
  StudentProfile,
  StudyGroup,
} from "../types"

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: "user-marcus",
    name: "Marcus Vance",
    email: "marcus.vance@mit.edu",
    headline:
      "Undergraduate Researcher in AI Systems @ MIT CSAIL | Open Source Lead | Aspiring AI Ethicist",
    institution: "Massachusetts Institute of Technology",
    facultyOrDepartment:
      "Department of Electrical Engineering and Computer Science",
    degree: "B.S. in Artificial Intelligence & Computer Science",
    graduationYear: 2026,
    location: "Cambridge, MA",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    about:
      "I am a third-year computer science student at MIT fascinated by efficient machine learning architectures, sparse attention mechanisms, and ethical algorithmic governance. When not in the lab or benchmarking neural networks, I organize peer-led seminars on research reproducibility and mentor high school coders in Greater Boston.",
    isPublic: true,
    openToBadges: ["research", "internships"],
    skillEndorsements: {
      PyTorch: ["user-priya", "user-jordan", "user-david"],
      "Distributed Systems": ["user-jordan", "user-elena"],
      "AI Ethics": ["user-elena"],
      Python: ["user-priya", "user-david"],
    },
    skills: [
      "PyTorch",
      "Python",
      "TypeScript",
      "Distributed Systems",
      "Graph Neural Networks",
      "Technical Writing",
      "AI Ethics",
      "C++",
      "Linux Kernel Tuning",
    ],
    interests: [
      "Computational Biology",
      "Decentralized AI",
      "Open Science",
      "Clean Tech Innovation",
      "Collegiate Debate",
    ],
    education: [
      {
        id: "edu-1",
        institution: "Massachusetts Institute of Technology",
        degree: "Bachelor of Science (B.S.)",
        fieldOfStudy: "Artificial Intelligence & Computer Science",
        startYear: 2022,
        endYear: 2026,
        gradeOrGpa: "4.95 / 5.00 GPA",
        activities:
          "President of MIT Undergraduate Computing Club, CSAIL Research Assistant, Teaching Assistant for 6.006 (Algorithms).",
      },
      {
        id: "edu-2",
        institution: "Newton North High School",
        degree: "High School Diploma with Highest Honors",
        fieldOfStudy: "Advanced STEM Track",
        startYear: 2018,
        endYear: 2022,
        gradeOrGpa: "Valedictorian",
        activities:
          "Captain of Science Olympiad, Math Team Co-founder, FIRST Robotics programming lead.",
      },
    ],
    portfolioItems: [
      {
        id: "port-1",
        type: "project",
        title: "SparseAttention-X: Memory-Efficient Transformer Kernels",
        organization: "MIT CSAIL Lab",
        date: "Fall 2025",
        description:
          "Developed custom CUDA kernels reducing memory footprint for long-context sequence modeling by 38% with negligible perplexity trade-off. Benchmark code adopted by 2 research labs.",
        linkUrl: "https://github.com/example/sparse-attention-x",
        skills: ["PyTorch", "CUDA", "C++", "Benchmarking"],
      },
      {
        id: "port-2",
        type: "publication",
        title: "Quantized Latent Embeddings for Real-time Micro-sensor Fusion",
        organization: "IEEE Student Conference on Sensor Intelligence",
        date: "Spring 2025",
        description:
          "Primary student author on low-power inference on edge devices, accepted with oral presentation.",
        linkUrl: "https://doi.org/10.1109/example.2025.0123",
        credentialId: "IEEE-2025-PUB-891",
      },
      {
        id: "port-3",
        type: "award",
        title: "1st Place Grand Winner — MIT Energy & Climate Hackathon",
        organization: "MIT Energy Initiative",
        date: "Nov 2025",
        description:
          "Led cross-disciplinary team of 4 engineers and economists predicting building thermal load using localized micro-weather data, earning $10,000 deployment grant.",
      },
      {
        id: "port-4",
        type: "leadership",
        title: "President & Seminar Director",
        organization: "Undergraduate Association of Computing (UAC)",
        date: "2024 - Present",
        description:
          "Overseeing weekly academic reading groups, career workshops with alumni mentors, and annual student symposium with 350+ attendees.",
      },
      {
        id: "port-5",
        type: "certificate",
        title: "Deep Learning Specialization with Honors",
        organization: "DeepLearning.AI",
        date: "June 2024",
        description:
          "Comprehensive curriculum covering recurrent nets, attention mechanisms, hyperparameter tuning, and production ML pipelines.",
        credentialId: "DLAI-HONORS-99482",
      },
    ],
    connectionsCount: 84,
    followersCount: 142,
    connectionStatus: "self",
    isFollowing: false,
  },
  {
    id: "user-priya",
    name: "Priya Sharma",
    email: "priya.sharma@stanford.edu",
    headline:
      "Bioengineering & Biomedical Data Science @ Stanford | BioDesign Fellow | Health Equity Advocate",
    institution: "Stanford University",
    facultyOrDepartment: "Department of Bioengineering",
    degree: "B.S. in Bioengineering & Data Science",
    graduationYear: 2025,
    location: "Palo Alto, CA",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    about:
      "Senior bioengineer bridging wet lab assays and multi-omics statistical pipelines. Passionate about affordable diagnostics in developing nations and transparent medical device regulation.",
    isPublic: true,
    skills: [
      "Bioinformatics",
      "Python",
      "R",
      "CRISPR Screening",
      "NextGen Sequencing",
      "FDA Regulatory Basics",
    ],
    interests: [
      "Synthetic Biology",
      "Precision Medicine",
      "Global Health",
      "Microfluidics",
    ],
    education: [
      {
        id: "edu-priya-1",
        institution: "Stanford University",
        degree: "Bachelor of Science (B.S.)",
        fieldOfStudy: "Bioengineering with Data Science Focus",
        startYear: 2021,
        endYear: 2025,
        gradeOrGpa: "3.94 GPA",
        activities:
          "Stanford Biodesign Student Fellow, Tau Beta Pi Engineering Honor Society.",
      },
    ],
    portfolioItems: [
      {
        id: "port-priya-1",
        type: "project",
        title: "MicroCap: Paper-Based Microfluidic Sepsis Biomarker Assay",
        organization: "Stanford Biodesign Lab",
        date: "Winter 2025",
        description:
          "Designed a $2 strip test for rapid lactate and procalcitonin detection in emergency rural clinics.",
        linkUrl: "https://biodesign.stanford.edu/projects/microcap",
      },
      {
        id: "port-priya-2",
        type: "award",
        title: "Gates Cambridge Finalist & Goldwater Scholar",
        organization:
          "Barry Goldwater Scholarship and Excellence in Education Foundation",
        date: "2024",
        description:
          "Recognized for undergraduate biomedical research in automated single-cell sequencing pipelines.",
      },
    ],
    connectionsCount: 168,
    followersCount: 310,
    connectionStatus: "connected",
    isFollowing: true,
  },
  {
    id: "user-elena",
    name: "Elena Rostova",
    email: "elena.rostova@ox.ac.uk",
    headline:
      "Oxford PPE Scholar | Former Policy Intern @ OECD | Chair, Oxford Inter-Collegiate Debating Union",
    institution: "University of Oxford",
    facultyOrDepartment: "Department of Politics and International Relations",
    degree: "B.A. in Philosophy, Politics and Economics (PPE)",
    graduationYear: 2026,
    location: "Oxford, United Kingdom",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    about:
      "Reading PPE at Balliol College, Oxford. Focused on European energy security policies, cross-border carbon border adjustment mechanisms (CBAM), and digital platform antitrust law.",
    isPublic: true,
    skills: [
      "Econometric Modeling",
      "Stata",
      "Public Policy Analysis",
      "Diplomatic Drafting",
      "Comparative Governance",
    ],
    interests: [
      "International Trade",
      "Energy Geopolitics",
      "Climate Finance",
      "EU Digital Markets Act",
    ],
    education: [
      {
        id: "edu-elena-1",
        institution: "University of Oxford (Balliol College)",
        degree: "Bachelor of Arts (B.A.)",
        fieldOfStudy: "Philosophy, Politics and Economics (PPE)",
        startYear: 2023,
        endYear: 2026,
        gradeOrGpa: "First Class Honours expected",
        activities:
          "President, Oxford Debating Union; Editor-in-Chief, The Oxford Student Policy Journal.",
      },
    ],
    portfolioItems: [
      {
        id: "port-elena-1",
        type: "publication",
        title: "Assessing Carbon Border Tariffs on Developing Exporters",
        organization: "Oxford Review of Economic Policy (Student Edition)",
        date: "Jan 2026",
        description:
          "Empirical assessment of CBAM phase-in impacts on South Asian steel manufacturers.",
      },
      {
        id: "port-elena-2",
        type: "leadership",
        title: "President, Oxford European Affairs Society",
        organization: "Balliol College",
        date: "2024 - 2025",
        description:
          "Organized policy debates hosting ambassadors from France, Germany, and Poland.",
      },
    ],
    connectionsCount: 220,
    followersCount: 490,
    connectionStatus: "pending_received", // Incoming request to Marcus!
    isFollowing: false,
  },
  {
    id: "user-jordan",
    name: "Jordan Lee",
    email: "jordan.lee@berkeley.edu",
    headline:
      "Robotics Engineer @ Berkeley AutoLab | Autonomous Navigation & SLAM | IEEE Student Chair",
    institution: "University of California, Berkeley",
    facultyOrDepartment:
      "Department of Electrical Engineering and Computer Sciences",
    degree: "B.S. in Electrical Engineering & Robotics",
    graduationYear: 2025,
    location: "Berkeley, CA",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    about:
      "Senior at Cal building perception and motion planning algorithms for quadruped and warehouse robots. Interested in high-speed visual-inertial odometry and hardware acceleration on FPGA chips.",
    isPublic: true,
    skills: [
      "ROS 2",
      "C++",
      "SLAM",
      "Computer Vision",
      "PyTorch",
      "FPGA Verilog",
      "SolidWorks",
    ],
    interests: [
      "Field Robotics",
      "Spatial Computing",
      "Autonomous Drones",
      "Maker Culture",
    ],
    education: [
      {
        id: "edu-jordan-1",
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science (B.S.)",
        fieldOfStudy: "Electrical Engineering & Computer Sciences (EECS)",
        startYear: 2021,
        endYear: 2025,
        gradeOrGpa: "3.91 GPA",
        activities:
          "Cal Robotics Competition Lead, IEEE Student Branch Secretary.",
      },
    ],
    portfolioItems: [
      {
        id: "port-jordan-1",
        type: "project",
        title:
          "QuadNav: Agile Obstacle Avoidance for Low-Cost Quadruped Robots",
        organization: "Berkeley AutoLab",
        date: "Fall 2025",
        description:
          "Implemented end-to-end LiDAR SLAM running at 60Hz on an onboard Jetson Orin Nano.",
        linkUrl: "https://autolab.berkeley.edu/quadnav",
      },
    ],
    connectionsCount: 145,
    followersCount: 210,
    connectionStatus: "none",
    isFollowing: false,
  },
  {
    id: "user-amara",
    name: "Amara Okafor",
    email: "amara.okafor@cmu.edu",
    headline:
      "Product & Systems Designer @ CMU HCI Institute | Accessibility Advocate | Design Systems Lead",
    institution: "Carnegie Mellon University",
    facultyOrDepartment:
      "School of Design & Human-Computer Interaction Institute",
    degree: "B.Des in Product Design & HCI",
    graduationYear: 2026,
    location: "Pittsburgh, PA",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    about:
      "Design student at CMU specializing in accessible user interfaces for neurodiverse learners and educational platforms. Firm believer in quiet software, restrained typography, and functional craftsmanship.",
    isPublic: true,
    skills: [
      "Figma",
      "Design Systems",
      "WCAG 2.2 AA",
      "User Testing",
      "Front-End Prototyping",
      "Typography",
    ],
    interests: [
      "Universal Design",
      "Assistive Technology",
      "Design Ethics",
      "Letterpress Printing",
    ],
    education: [
      {
        id: "edu-amara-1",
        institution: "Carnegie Mellon University",
        degree: "Bachelor of Design (B.Des)",
        fieldOfStudy: "Communication Design & HCI Double Major",
        startYear: 2022,
        endYear: 2026,
        gradeOrGpa: "3.96 GPA",
        activities:
          "Lead Designer for CMU Tartan Press, Student Advisory Council on Accessibility.",
      },
    ],
    portfolioItems: [
      {
        id: "port-amara-1",
        type: "project",
        title: "SenseFont: Low-Vision Adaptive Reading System",
        organization: "CMU HCI Capstone",
        date: "Dec 2025",
        description:
          "Conducted 40+ user interviews with visually impaired students to establish dynamic typographic contrast scalers.",
        linkUrl: "https://amara-okafor.design/sensefont",
      },
      {
        id: "port-amara-2",
        type: "award",
        title: "Kauffman Student Design Excellence Award",
        organization: "Carnegie Mellon University",
        date: "May 2025",
        description:
          "Awarded for best undergraduate interface design tackling digital literacy.",
      },
    ],
    connectionsCount: 112,
    followersCount: 280,
    connectionStatus: "pending_sent", // Marcus already sent request to Amara
    isFollowing: true,
  },
  {
    id: "user-david",
    name: "David Chen",
    email: "david.chen@college.harvard.edu",
    headline:
      "Quantitative Economics Researcher @ Harvard College | Student Investment Fund Director",
    institution: "Harvard University",
    facultyOrDepartment: "Department of Economics",
    degree: "A.B. in Applied Mathematics & Economics",
    graduationYear: 2026,
    location: "Cambridge, MA",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    about:
      "Junior at Harvard studying stochastic processes, market microstructure, and monetary policy transmission mechanisms. Research fellow at the Opportunity Insights initiative.",
    isPublic: true,
    skills: [
      "Applied Econometrics",
      "Python",
      "Stata",
      "Fixed Income Analytics",
      "R",
      "Mathematical Statistics",
    ],
    interests: [
      "Economic Mobility",
      "Central Banking",
      "Algorithmic Trading",
      "Rowing",
    ],
    education: [
      {
        id: "edu-david-1",
        institution: "Harvard University",
        degree: "Bachelor of Arts (A.B.)",
        fieldOfStudy: "Applied Mathematics with Economics Track",
        startYear: 2022,
        endYear: 2026,
        gradeOrGpa: "3.98 GPA",
        activities:
          "Chief Investment Officer, Harvard Financial Analysts Club; Varsity Lightweight Crew.",
      },
    ],
    portfolioItems: [
      {
        id: "port-david-1",
        type: "project",
        title: "MacroPulse: Open-Source High-Frequency Yield Curve Predictor",
        organization: "Independent Academic Project",
        date: "Jan 2026",
        description:
          "Built a vectorized pipeline backtesting Fed statement NLP sentiment against 2-year and 10-year Treasury shifts.",
      },
    ],
    connectionsCount: 195,
    followersCount: 320,
    connectionStatus: "connected",
    isFollowing: false,
  },
]

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorId: "user-priya",
    authorName: "Priya Sharma",
    authorHeadline:
      "Bioengineering & Biomedical Data Science @ Stanford | BioDesign Fellow",
    authorInstitution: "Stanford University",
    authorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    content: `Thrilled to share that our paper on low-cost paper microfluidics for rural healthcare clinics was just accepted into the Journal of Open Biomaterials! 🧪✨\n\nWhen we started this project in the lab 18 months ago, the goal seemed almost idealistic: create an assay capable of detecting bacterial endotoxins in under 12 minutes for less than $1.50 per unit.\n\nHuge shout-out to my undergraduate lab co-authors, our PI Dr. Katherine Zhang, and the community health workers in Oaxaca who field-tested our prototype strips during clinical validation. Science is truly a collaborative endeavor. Open-access preprint link below!`,
    linkPreview: {
      title: "Microfluidic Point-of-Care Assays for Rural Clinical Diagnostics",
      url: "https://openbiomaterials.org/papers/2026/microfluidics-poc",
      domain: "openbiomaterials.org",
      description:
        "Peer-reviewed study detailing low-cost paper matrix fabrication for rapid septic biomarker assays.",
    },
    createdAt: "2 hours ago",
    likes: ["user-marcus", "user-david", "user-elena"],
    sharesCount: 14,
    comments: [
      {
        id: "comm-1",
        postId: "post-1",
        authorId: "user-marcus",
        authorName: "Marcus Vance",
        authorHeadline: "Undergraduate Researcher in AI Systems @ MIT CSAIL",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        content:
          "Huge congratulations Priya! The $1.50 cost barrier is massive for real-world impact. Did you run any spectrophotometric calibration with mobile phone cameras, or is it purely colorimetric readout?",
        createdAt: "1 hour ago",
        likes: ["user-priya"],
        replies: [
          {
            id: "reply-1",
            authorId: "user-priya",
            authorName: "Priya Sharma",
            authorHeadline:
              "Biomedical Engineering Honors Senior @ Stanford | Biodesign Fellow",
            authorAvatar:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            content:
              "Great question Marcus! We built an open-source Android app that uses standard phone camera sensors to normalize ambient lighting and read color density within 3% variance of benchtop spectrophotometers.",
            createdAt: "45 minutes ago",
            likes: ["user-marcus"],
          },
        ],
      },
      {
        id: "comm-2",
        postId: "post-1",
        authorId: "user-david",
        authorName: "David Chen",
        authorHeadline: "Quantitative Economics Researcher @ Harvard College",
        authorAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        content:
          "Fascinating implications for public healthcare budgets. Would love to read your unit economics breakdown in section 4.",
        createdAt: "30 minutes ago",
        likes: [],
        replies: [],
      },
    ],
  },
  {
    id: "post-2",
    authorId: "user-marcus",
    authorName: "Marcus Vance",
    authorHeadline: "Undergraduate Researcher in AI Systems @ MIT CSAIL",
    authorInstitution: "Massachusetts Institute of Technology",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    content: `Quick reflection on undergraduate research: It is tempting to spend all semester chasing complex model architectures, but 80% of our breakthrough last week on sparse attention came from cleaning our dataset and rewriting the baseline memory profiler from scratch.\n\nNever underestimate the power of clean fundamentals, deep instrumentation, and good old-fashioned benchmark profiling before adding complexity. What is one lesson you learned the hard way in your labs this semester?`,
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1000&q=80",
    topic: "Research",
    poll: {
      question: "What is your team's biggest bottleneck in university research projects?",
      options: [
        {
          id: "opt-1",
          text: "Reproducibility & dataset hygiene",
          votes: ["user-priya", "user-jordan", "user-david"],
        },
        {
          id: "opt-2",
          text: "Compute cluster / GPU queuing time",
          votes: ["user-elena"],
        },
        {
          id: "opt-3",
          text: "Finding cross-faculty student collaborators",
          votes: ["user-amara"],
        },
      ],
    },
    createdAt: "5 hours ago",
    likes: ["user-jordan", "user-amara", "user-priya"],
    sharesCount: 8,
    comments: [
      {
        id: "comm-3",
        postId: "post-2",
        authorId: "user-jordan",
        authorName: "Jordan Lee",
        authorHeadline: "Robotics Engineer @ Berkeley AutoLab",
        authorAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        content:
          "100% this. Spent 3 weeks debugging a robot drifting during SLAM before realizing our IMU calibration timestamp was off by 4 milliseconds. Fundamentals beat magic every single time.",
        createdAt: "3 hours ago",
        likes: ["user-marcus"],
        replies: [],
      },
    ],
  },
  {
    id: "post-3",
    authorId: "user-elena",
    authorName: "Elena Rostova",
    authorHeadline: "Oxford PPE Scholar | Former Policy Intern @ OECD",
    authorInstitution: "University of Oxford",
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    content: `Attending the European Youth Forum on Cross-Border Governance in Brussels today. Fascinating discussions on how universities across the continent can recognize student credentials and micro-degrees without getting bogged down in 4-year bureaucratic accreditation cycles.\n\nCredential portability across European universities isn't just an administrative convenience; it's a foundational prerequisite for equitable youth mobility and cross-disciplinary academic discovery.`,
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
    createdAt: "Yesterday",
    likes: ["user-marcus", "user-priya"],
    sharesCount: 19,
    comments: [],
  },
  {
    id: "post-4",
    authorId: "user-amara",
    authorName: "Amara Okafor",
    authorHeadline: "Product & Systems Designer @ CMU HCI Institute",
    authorInstitution: "Carnegie Mellon University",
    authorAvatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    content: `Finished compiling the Open Accessible Education System design guidelines! 📚\n\nKey takeaways for student-facing web platforms:\n1. Keep interactive targets at least 44px for mobility considerations.\n2. Do not rely solely on color for state indicators (always pair with text or clear icons).\n3. Avoid erratic motion that induces cognitive fatigue during late-night study sessions.\n\nSimplicity is not a lack of effort; it is the ultimate expression of respect for the user's focus.`,
    createdAt: "2 days ago",
    likes: ["user-marcus", "user-elena", "user-jordan"],
    sharesCount: 31,
    comments: [],
  },
]

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Rhodes Scholarship 2027 (Global & Regional Nominations)",
    provider: "The Rhodes Trust",
    providerLogo:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
    category: "scholarship",
    description:
      "The Rhodes Scholarship is the oldest and perhaps most prestigious international scholarship programme, enabling outstanding young people from around the world to study postgraduate degrees at the University of Oxford. Covers all University and College fees, an annual living stipend (£19,092), and economy flight travel.",
    eligibility: [
      "Undergraduate degree completed with First Class or equivalent (GPA 3.8+)",
      "Aged 18 to 24 by October 1, 2026",
      "Demonstrated moral character, leadership capacity, and academic excellence",
      "Endorsement from current university dean or fellowship office",
    ],
    location: "Oxford, United Kingdom",
    mode: "On-site",
    deadline: "2026-10-01",
    applicationUrl:
      "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/",
    compensation: "Fully Funded (£19,092/yr stipend + tuition)",
    postedBy: "Credento Official Editorial",
    createdAt: "2026-03-01",
    isSaved: true,
  },
  {
    id: "opp-2",
    title: "Google Summer of Code (GSoC) 2026 — Open Source Fellow",
    provider: "Google Open Source Programs Office",
    providerLogo:
      "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80",
    category: "fellowship",
    description:
      "An international online program designed to bring new student developers into open source software development. Contributors work on a 12-week programming project under the mentorship of senior open source organization maintainers.",
    eligibility: [
      "Must be at least 18 years of age at registration",
      "Enrolled student or newcomer to open source development",
      "Proficiency in at least one modern language (Python, C++, Rust, Go, TypeScript)",
      "Submitting a detailed technical proposal to an approved mentoring org",
    ],
    location: "Global / Virtual",
    mode: "Remote",
    deadline: "2026-04-08",
    applicationUrl: "https://summerofcode.withgoogle.com/",
    compensation: "$3,000 – $6,600 Stipend (Purchasing Power Parity)",
    postedBy: "Google OSPO",
    createdAt: "2026-02-15",
    isSaved: true,
  },
  {
    id: "opp-3",
    title:
      "NASA Jet Propulsion Laboratory (JPL) Summer Undergraduate Internship",
    provider: "NASA JPL & Caltech",
    providerLogo:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    category: "internship",
    description:
      "Join JPL missions supporting planetary exploration, Mars sample return analysis, Earth-observing satellite payloads, and space robotics algorithms. 10-week immersive research internship alongside world-class scientists and aerospace engineers.",
    eligibility: [
      "Enrolled undergraduate or graduate student in STEM (Engineering, CS, Physics, Math, Geology)",
      "Minimum cumulative GPA of 3.0 on a 4.0 scale",
      "Strong analytical and collaborative problem-solving skills",
      "Available for 10 consecutive weeks full-time during Summer 2026",
    ],
    location: "Pasadena, CA",
    mode: "Hybrid",
    deadline: "2026-03-30",
    applicationUrl: "https://www.jpl.nasa.gov/edu/intern/apply/",
    compensation: "$28 - $36/hr + Housing Subsidy",
    postedBy: "JPL University Relations",
    createdAt: "2026-01-10",
    isSaved: false,
  },
  {
    id: "opp-4",
    title:
      "Jane Street Graduate & Undergraduate Quantitative Research Fellowship",
    provider: "Jane Street Capital",
    providerLogo:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80",
    category: "fellowship",
    description:
      "Spend 12 weeks exploring mathematical modeling, statistical analysis, and algorithmic trading mechanisms. Fellows tackle novel computational problems using OCaml and quantitative finance theory in an open, academic environment.",
    eligibility: [
      "Undergraduate or Masters student graduating in late 2026 or 2027",
      "Strong foundations in probability, discrete mathematics, and algorithms",
      "No prior financial knowledge required — emphasis on rigorous problem-solving",
    ],
    location: "New York, NY / London",
    mode: "On-site",
    deadline: "2026-06-15",
    applicationUrl:
      "https://www.janestreet.com/join-jane-street/programs-and-internships/",
    compensation: "$50,000 / Summer + Furnished Housing + Sign-on",
    postedBy: "Jane Street Campus Recruiting",
    createdAt: "2026-01-20",
    isSaved: false,
  },
  {
    id: "opp-5",
    title: "MIT Clean Energy Prize & Global Innovation Challenge",
    provider: "MIT Energy Initiative (MITEI)",
    providerLogo:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=120&q=80",
    category: "competition",
    description:
      "The nation’s premier student-led clean energy business plan competition. University student teams compete for up to $100,000 in non-dilutive grant funding across clean power, agriculture, grid resilience, and carbon removal tracks.",
    eligibility: [
      "Teams must have at least one currently enrolled university student as a founder",
      "Early-stage technological or business innovation in clean energy",
      "Submission includes an executive summary and 5-page pitch deck",
    ],
    location: "Cambridge, MA",
    mode: "Hybrid",
    deadline: "2026-04-30",
    applicationUrl: "https://cep.mit.edu/",
    compensation: "$100,000 Grand Prize Pool",
    postedBy: "MIT Student Association",
    createdAt: "2026-02-01",
    isSaved: false,
  },
  {
    id: "opp-6",
    title: "United Nations Youth Assembly & SDG Student Delegate Program",
    provider: "United Nations Academic Impact (UNAI)",
    providerLogo:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80",
    category: "volunteer",
    description:
      "Represent student voices at the annual United Nations Youth Assembly at UN Headquarters in New York. Delegates draft policy recommendations for multilateral diplomats on Sustainable Development Goals 4 (Education), 9 (Innovation), and 13 (Climate Action).",
    eligibility: [
      "Ages 18-28 enrolled in accredited higher education institutions",
      "Demonstrated commitment to grassroots community service or policy advocacy",
      "Fluency in English or one of the six official UN languages",
    ],
    location: "New York, NY (UN HQ)",
    mode: "On-site",
    deadline: "2026-05-10",
    applicationUrl: "https://www.un.org/en/academic-impact",
    compensation: "Travel Grant & UN Credentialing",
    postedBy: "UNAI Student Secretariat",
    createdAt: "2026-02-10",
    isSaved: false,
  },
  {
    id: "opp-7",
    title: "Stanford Biodesign Innovation & Prototyping Short Course",
    provider: "Stanford Center for Biodesign",
    providerLogo:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=120&q=80",
    category: "course",
    description:
      "Intensive 6-week online training certification covering clinical need identification, biomedical patent searching, prototype testing, and medical device regulatory pathways for engineering and pre-med students.",
    eligibility: [
      "Open to any enrolled university student with interest in med-tech or bioengineering",
      "No formal prerequisites; verified certificate awarded upon completion of capstone project",
    ],
    location: "Online",
    mode: "Remote",
    deadline: "2026-05-30",
    applicationUrl: "https://biodesign.stanford.edu/courses.html",
    compensation: "Free Tuition for Verified Students",
    postedBy: "Stanford Center for Biodesign",
    createdAt: "2026-02-20",
    isSaved: false,
  },
]

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-priya",
    participantIds: ["user-marcus", "user-priya"],
    otherUser: {
      id: "user-priya",
      name: "Priya Sharma",
      headline: "Bioengineering & Biomedical Data Science @ Stanford",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      institution: "Stanford University",
      isOnline: true,
    },
    lastMessage:
      "Let me know if you would like me to send over the raw calibration CSV files!",
    lastMessageAt: "12:30 PM",
    unreadCount: 1,
    messages: [
      {
        id: "msg-1",
        senderId: "user-marcus",
        text: "Hi Priya, saw your paper announcement on Credento! Truly fantastic work on the point-of-care microfluidics sensor.",
        sentAt: "11:15 AM",
      },
      {
        id: "msg-2",
        senderId: "user-priya",
        text: "Thank you Marcus! We spent months getting the substrate porosity right so blood clotting wouldn’t obstruct the optical channel.",
        sentAt: "11:42 AM",
      },
      {
        id: "msg-3",
        senderId: "user-marcus",
        text: "Our lab at CSAIL has been experimenting with neural calibration models that compensate for low-cost CMOS sensor noise. Could be an interesting bridge between our teams.",
        sentAt: "12:05 PM",
      },
      {
        id: "msg-4",
        senderId: "user-priya",
        text: "That sounds really promising! Let me know if you would like me to send over the raw calibration CSV files!",
        sentAt: "12:30 PM",
      },
    ],
  },
  {
    id: "conv-david",
    participantIds: ["user-marcus", "user-david"],
    otherUser: {
      id: "user-david",
      name: "David Chen",
      headline: "Quantitative Economics Researcher @ Harvard College",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      institution: "Harvard University",
      isOnline: false,
    },
    lastMessage:
      "Are you heading to the MIT-Harvard Energy Summit on Thursday?",
    lastMessageAt: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "msg-d1",
        senderId: "user-david",
        text: "Hey Marcus, hope your midterms went well. Are you heading to the MIT-Harvard Energy Summit on Thursday?",
        sentAt: "Yesterday 3:15 PM",
      },
      {
        id: "msg-d2",
        senderId: "user-marcus",
        text: "Hey David! Yes, presenting our building energy forecasting model at 2 PM. Hope to see you there!",
        sentAt: "Yesterday 4:00 PM",
      },
    ],
  },
]

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "connection_request",
    actorId: "user-elena",
    actorName: "Elena Rostova",
    actorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    title: "New Connection Request",
    description:
      "Elena Rostova (Oxford PPE Scholar) wants to connect with you.",
    createdAt: "15 minutes ago",
    isRead: false,
    requestId: "req-elena",
  },
  {
    id: "notif-2",
    type: "comment",
    actorId: "user-jordan",
    actorName: "Jordan Lee",
    actorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    title: "Comment on your post",
    description:
      'Jordan Lee commented: "100% this. Spent 3 weeks debugging a robot drifting during SLAM..."',
    createdAt: "3 hours ago",
    isRead: false,
    targetId: "post-2",
  },
  {
    id: "notif-3",
    type: "like",
    actorId: "user-priya",
    actorName: "Priya Sharma",
    actorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    title: "Liked your post",
    description:
      "Priya Sharma liked your post on undergraduate research fundamentals.",
    createdAt: "4 hours ago",
    isRead: true,
    targetId: "post-2",
  },
  {
    id: "notif-4",
    type: "opportunity_alert",
    title: "Opportunity Deadline Approaching",
    description:
      "NASA JPL Summer Undergraduate Internship application closes in 6 days.",
    createdAt: "1 day ago",
    isRead: true,
    targetId: "opp-3",
  },
  {
    id: "notif-5",
    type: "announcement",
    title: "Credento Spring Student Research Showcase",
    description:
      "Publish your independent or lab research to be featured in the inter-university digest.",
    createdAt: "3 days ago",
    isRead: true,
  },
]

export const INITIAL_GROUPS: StudyGroup[] = [
  {
    id: "grp-1",
    name: "MIT CSAIL Autonomous Systems & Robotics",
    category: "Research Lab",
    description:
      "Undergraduate and graduate research working group focused on multi-agent perception, embodied intelligence, and low-latency robotics kernels.",
    institution: "Massachusetts Institute of Technology",
    memberCount: 38,
    avatar:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Robotics", "Reinforcement Learning", "CUDA", "ROS2"],
    isJoined: true,
    recentDiscussion:
      "Benchmarking micro-SLAM algorithms on Jetson Orin Nano hardware",
    meetingSchedule: "Wednesdays @ 5:30 PM (Stata Center 32-D463)",
    leadName: "Marcus Vance",
  },
  {
    id: "grp-2",
    name: "Collegiate AI Ethics & Governance Forum",
    category: "Student Chapter",
    description:
      "Inter-collegiate association of students analyzing generative model biases, fair-use datasets, and AI accountability policies.",
    institution: "Inter-University Consortium",
    memberCount: 94,
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    tags: ["Policy", "Ethics", "Algorithmic Justice", "Public Interest Tech"],
    isJoined: false,
    recentDiscussion:
      "Drafting student submission to the US Copyright Office on academic pre-training",
    meetingSchedule: "Bi-weekly Thursdays @ 7:00 PM EST (Virtual)",
    leadName: "Elena Rostova",
  },
  {
    id: "grp-3",
    name: "Stanford BioDesign & Health Innovation Circle",
    category: "Study Circle",
    description:
      "Collaborative incubator for biomedical device design, point-of-care microfluidics, and translational medicine hackathons.",
    institution: "Stanford University",
    memberCount: 52,
    avatar:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    tags: ["MedTech", "Biomaterials", "Clinical Trials", "Diagnostics"],
    isJoined: false,
    recentDiscussion:
      "Testing lateral flow strip sensitivity with ambient phone cameras",
    meetingSchedule: "Mondays @ 6:00 PM (Clark Center S360)",
    leadName: "Priya Sharma",
  },
  {
    id: "grp-4",
    name: "Quantum Computing & Quantum Information Syndicate",
    category: "Research Lab",
    description:
      "Student group researching noisy intermediate-scale quantum (NISQ) algorithms, error mitigation, and quantum chemistry simulations.",
    institution: "Harvard & MIT Joint Chapter",
    memberCount: 29,
    avatar:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Qiskit", "Quantum Algorithms", "Linear Algebra", "Physics"],
    isJoined: false,
    recentDiscussion: "VQE optimization landscapes with parameterized ansatzes",
    meetingSchedule: "Fridays @ 4:00 PM (Jefferson Physical Lab)",
    leadName: "David Chen",
  },
  {
    id: "grp-5",
    name: "Collegiate Solar Car & Clean Energy Team",
    category: "Competition Team",
    description:
      "Designing, building, and racing high-efficiency solar vehicles for the American Solar Challenge.",
    institution: "UC Berkeley & Stanford",
    memberCount: 67,
    avatar:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    tags: ["Clean Energy", "Embedded Systems", "Aerodynamics", "Battery Tech"],
    isJoined: true,
    recentDiscussion:
      "Maximizing regenerative braking telemetry using CAN bus packet sniffing",
    meetingSchedule: "Saturdays @ 11:00 AM (Etcheverry Machine Shop)",
    leadName: "Jordan Lee",
  },
]
