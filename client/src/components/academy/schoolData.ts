import { Brain, Shield, Code, Rocket } from "lucide-react";
import type { Track } from "./TrackCards";
import type { RoadmapStep } from "./LearningRoadmap";
import type { FAQItem } from "./FAQAccordion";
import type { ValuePropData } from "./ValueProposition";

export interface SchoolConfig {
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  icon: any;
  gradient: string;
  tracks: Track[];
  roadmap: RoadmapStep[];
  faqs: FAQItem[];
  value: ValuePropData;
}

export const schoolsData: Record<string, SchoolConfig> = {
  "ai-and-data-science": {
    slug: "ai-and-data-science",
    title: "School of AI & Data Science",
    titleAr: "كلية الذكاء الاصطناعي وعلوم البيانات",
    subtitle: "Master neural networks, computer vision, NLP, and predictive analytics.",
    subtitleAr: "أتقن الشبكات العصبية والرؤية الحاسوبية ومعالجة اللغة الطبيعية والتحليلات التنبؤية.",
    image: "/uploads/school_ai_cover.webp",
    icon: Brain,
    gradient: "from-cyan-500 to-blue-600",
    tracks: [
      { title: "Machine Learning Foundations", titleAr: "أساسيات تعلم الآلة", description: "Supervised/unsupervised learning, feature engineering, model evaluation and optimization.", descriptionAr: "التعلم بإشراف وبدون إشراف، هندسة المميزات، تقييم النماذج وتحسينها.", level: "Beginner", levelAr: "مبتدئ", duration: "8 weeks", tools: ["Python", "Scikit-learn", "Pandas", "NumPy"], gradient: "from-cyan-500 to-blue-500" },
      { title: "Deep Learning & Neural Networks", titleAr: "التعلم العميق والشبكات العصبية", description: "CNNs, RNNs, Transformers, and transfer learning for production AI systems.", descriptionAr: "شبكات CNN وRNN وTransformers ونقل التعلم لأنظمة الذكاء الاصطناعي الإنتاجية.", level: "Intermediate", levelAr: "متوسط", duration: "10 weeks", tools: ["PyTorch", "TensorFlow", "Keras", "CUDA"], gradient: "from-blue-500 to-indigo-500" },
      { title: "Computer Vision Engineering", titleAr: "هندسة الرؤية الحاسوبية", description: "Object detection, segmentation, tracking, and real-time video analytics pipelines.", descriptionAr: "اكتشاف الأجسام والتجزئة والتتبع وأنابيب تحليل الفيديو في الوقت الفعلي.", level: "Advanced", levelAr: "متقدم", duration: "12 weeks", tools: ["OpenCV", "YOLOv11", "TensorRT", "DeepStream"], gradient: "from-indigo-500 to-purple-500" },
    ],
    roadmap: [
      { title: "Phase 1: Python & Math Foundations", titleAr: "المرحلة ١: أساسيات بايثون والرياضيات", description: "Linear algebra, statistics, probability, and Python programming fundamentals.", descriptionAr: "الجبر الخطي والإحصاء والاحتمالات وأساسيات برمجة بايثون.", skills: ["Python", "NumPy", "Statistics", "Linear Algebra"] },
      { title: "Phase 2: Data Analysis & ML", titleAr: "المرحلة ٢: تحليل البيانات وتعلم الآلة", description: "Data wrangling, visualization, classical ML algorithms, and model evaluation.", descriptionAr: "معالجة البيانات والتصور البياني وخوارزميات ML الكلاسيكية وتقييم النماذج.", skills: ["Pandas", "Matplotlib", "Scikit-learn", "Feature Engineering"] },
      { title: "Phase 3: Deep Learning", titleAr: "المرحلة ٣: التعلم العميق", description: "Neural network architectures, training strategies, and GPU-accelerated workflows.", descriptionAr: "بنى الشبكات العصبية واستراتيجيات التدريب وسير العمل المُسرّع بالـ GPU.", skills: ["PyTorch", "CNNs", "RNNs", "Transformers"] },
      { title: "Phase 4: Specialization & Deployment", titleAr: "المرحلة ٤: التخصص والنشر", description: "Choose CV, NLP, or Analytics. Build production pipelines with MLOps.", descriptionAr: "اختر الرؤية الحاسوبية أو معالجة اللغة أو التحليلات. ابنِ أنابيب إنتاجية مع MLOps.", skills: ["Docker", "FastAPI", "MLflow", "TensorRT"] },
    ],
    faqs: [
      { question: "Do I need a math background?", questionAr: "هل أحتاج خلفية رياضية؟", answer: "We cover the essential math (linear algebra, statistics) from scratch. A basic understanding of algebra is helpful but not required.", answerAr: "نغطي الرياضيات الأساسية (الجبر الخطي والإحصاء) من الصفر. فهم أساسي للجبر مفيد لكنه ليس مطلوباً." },
      { question: "What hardware do I need?", questionAr: "ما الأجهزة التي أحتاجها؟", answer: "A modern laptop is sufficient. We provide cloud GPU access (Google Colab Pro) for all deep learning assignments.", answerAr: "حاسوب محمول حديث يكفي. نوفر وصولاً سحابياً لـ GPU (Google Colab Pro) لجميع مهام التعلم العميق." },
      { question: "Will I build real projects?", questionAr: "هل سأبني مشاريع حقيقية؟", answer: "Absolutely. Every track ends with a capstone project. Past students have built traffic monitoring systems, medical image classifiers, and sentiment analysis engines.", answerAr: "بالتأكيد. كل مسار ينتهي بمشروع تخرج. بنى طلاب سابقون أنظمة مراقبة مرور ومصنفات صور طبية ومحركات تحليل مشاعر." },
      { question: "Is the certificate recognized?", questionAr: "هل الشهادة معترف بها؟", answer: "Our certificates are verifiable on our platform and recognized by our industry partners across the MENA region.", answerAr: "شهاداتنا قابلة للتحقق على منصتنا ومعترف بها من شركائنا في الصناعة عبر منطقة الشرق الأوسط." },
    ],
    value: {
      learningOutcomes: [
        { en: "Design, train, and deploy production ML models", ar: "تصميم وتدريب ونشر نماذج تعلم آلة إنتاجية" },
        { en: "Build end-to-end computer vision pipelines", ar: "بناء أنابيب رؤية حاسوبية متكاملة من البداية للنهاية" },
        { en: "Implement NLP systems with Transformers", ar: "تنفيذ أنظمة معالجة لغة طبيعية باستخدام المحولات" },
        { en: "Optimize models for edge deployment", ar: "تحسين النماذج للنشر على الأجهزة الطرفية" },
        { en: "Apply MLOps best practices", ar: "تطبيق أفضل ممارسات MLOps" },
      ],
      tools: ["Python", "PyTorch", "TensorFlow", "OpenCV", "Scikit-learn", "Docker", "FastAPI", "MLflow", "Pandas", "YOLOv11", "HuggingFace", "TensorRT"],
    },
  },

  "cybersecurity": {
    slug: "cybersecurity",
    title: "School of Cybersecurity",
    titleAr: "كلية الأمن السيبراني",
    subtitle: "Ethical hacking, penetration testing, SOC analysis, and digital forensics.",
    subtitleAr: "الاختراق الأخلاقي واختبار الاختراق وتحليل مراكز العمليات الأمنية والتحقيق الرقمي.",
    image: "/uploads/school_cyber_cover.webp",
    icon: Shield,
    gradient: "from-red-500 to-amber-500",
    tracks: [
      { title: "Cybersecurity Fundamentals", titleAr: "أساسيات الأمن السيبراني", description: "Networking, Linux, cryptography, and security principles for aspiring defenders.", descriptionAr: "الشبكات ولينكس والتشفير ومبادئ الأمن للمدافعين الطموحين.", level: "Beginner", levelAr: "مبتدئ", duration: "6 weeks", tools: ["Linux", "Wireshark", "Nmap", "TCP/IP"], gradient: "from-red-500 to-rose-500" },
      { title: "Penetration Testing", titleAr: "اختبار الاختراق", description: "Web app pentesting, network exploitation, and vulnerability assessment methodologies.", descriptionAr: "اختبار اختراق تطبيقات الويب واستغلال الشبكات ومنهجيات تقييم الثغرات.", level: "Intermediate", levelAr: "متوسط", duration: "10 weeks", tools: ["Burp Suite", "Metasploit", "Kali Linux", "OWASP"], gradient: "from-rose-500 to-amber-500" },
      { title: "SOC Analysis & Incident Response", titleAr: "تحليل مراكز العمليات الأمنية", description: "SIEM operations, threat hunting, malware analysis, and incident response frameworks.", descriptionAr: "عمليات SIEM وصيد التهديدات وتحليل البرامج الضارة وأطر الاستجابة للحوادث.", level: "Advanced", levelAr: "متقدم", duration: "12 weeks", tools: ["Splunk", "ELK Stack", "Snort", "YARA"], gradient: "from-amber-500 to-orange-500" },
    ],
    roadmap: [
      { title: "Phase 1: Networking & Linux", titleAr: "المرحلة ١: الشبكات ولينكس", description: "TCP/IP, subnetting, Linux administration, and basic scripting.", descriptionAr: "بروتوكولات TCP/IP وتقسيم الشبكات وإدارة لينكس والبرمجة النصية الأساسية.", skills: ["Linux", "Bash", "TCP/IP", "Networking"] },
      { title: "Phase 2: Security Foundations", titleAr: "المرحلة ٢: أسس الأمن", description: "Cryptography, authentication, access control, and security frameworks.", descriptionAr: "التشفير والمصادقة والتحكم في الوصول وأطر الأمن.", skills: ["Cryptography", "IAM", "NIST", "ISO 27001"] },
      { title: "Phase 3: Offensive Security", titleAr: "المرحلة ٣: الأمن الهجومي", description: "Vulnerability scanning, exploitation, web app pentesting, and report writing.", descriptionAr: "فحص الثغرات والاستغلال واختبار اختراق تطبيقات الويب وكتابة التقارير.", skills: ["Metasploit", "Burp Suite", "SQLi", "XSS"] },
      { title: "Phase 4: Blue Team & SOC", titleAr: "المرحلة ٤: الفريق الأزرق ومراكز SOC", description: "SIEM, log analysis, threat intelligence, and incident response procedures.", descriptionAr: "أنظمة SIEM وتحليل السجلات واستخبارات التهديدات وإجراءات الاستجابة للحوادث.", skills: ["Splunk", "Threat Hunting", "DFIR", "Malware Analysis"] },
    ],
    faqs: [
      { question: "Do I need programming experience?", questionAr: "هل أحتاج خبرة في البرمجة؟", answer: "Basic scripting helps but isn't required. We teach Python and Bash scripting as part of the fundamentals track.", answerAr: "البرمجة النصية الأساسية تساعد لكنها ليست مطلوبة. نُعلّم بايثون وباش كجزء من مسار الأساسيات." },
      { question: "What certifications does this prepare me for?", questionAr: "لأي شهادات يؤهلني هذا البرنامج؟", answer: "Our curriculum aligns with CompTIA Security+, CEH, and OSCP certification objectives.", answerAr: "منهجنا يتوافق مع أهداف شهادات CompTIA Security+ وCEH وOSCP." },
      { question: "Is pentesting legal?", questionAr: "هل اختبار الاختراق قانوني؟", answer: "All labs are conducted in controlled, legal environments. We teach ethical hacking within strict legal and professional boundaries.", answerAr: "جميع المعامل تُجرى في بيئات مُتحكم بها وقانونية. نُعلّم الاختراق الأخلاقي ضمن حدود قانونية ومهنية صارمة." },
      { question: "What career paths are available?", questionAr: "ما المسارات الوظيفية المتاحة؟", answer: "SOC Analyst, Penetration Tester, Security Engineer, Incident Responder, and Security Consultant.", answerAr: "محلل SOC، مختبر اختراق، مهندس أمن، مستجيب حوادث، ومستشار أمني." },
    ],
    value: {
      learningOutcomes: [
        { en: "Conduct professional penetration tests", ar: "إجراء اختبارات اختراق احترافية" },
        { en: "Operate and manage SIEM platforms", ar: "تشغيل وإدارة منصات SIEM" },
        { en: "Perform digital forensics investigations", ar: "إجراء تحقيقات الطب الشرعي الرقمي" },
        { en: "Implement security frameworks (NIST, ISO)", ar: "تطبيق أطر الأمن (NIST، ISO)" },
        { en: "Write professional security reports", ar: "كتابة تقارير أمنية احترافية" },
      ],
      tools: ["Kali Linux", "Burp Suite", "Metasploit", "Wireshark", "Splunk", "Nmap", "Snort", "YARA", "Volatility", "Autopsy", "Nessus", "John the Ripper"],
    },
  },

  "full-stack-solutions": {
    slug: "full-stack-solutions",
    title: "School of Full Stack Solutions",
    titleAr: "كلية تطوير النظم المتكاملة",
    subtitle: "React, Node.js, cloud architecture, databases, and DevOps.",
    subtitleAr: "React وNode.js والبنية السحابية وقواعد البيانات وDevOps.",
    image: "/uploads/school_fullstack_cover.webp",
    icon: Code,
    gradient: "from-emerald-500 to-teal-500",
    tracks: [
      { title: "Frontend Engineering", titleAr: "هندسة الواجهات الأمامية", description: "React, TypeScript, state management, responsive design, and modern CSS.", descriptionAr: "React وTypeScript وإدارة الحالة والتصميم المتجاوب وCSS الحديثة.", level: "Beginner", levelAr: "مبتدئ", duration: "8 weeks", tools: ["React", "TypeScript", "Tailwind CSS", "Vite"], gradient: "from-emerald-500 to-green-500" },
      { title: "Backend & API Engineering", titleAr: "هندسة الخوادم وواجهات البرمجة", description: "Node.js, Express, PostgreSQL, REST APIs, authentication, and server architecture.", descriptionAr: "Node.js وExpress وPostgreSQL وواجهات REST والمصادقة وبنية الخوادم.", level: "Intermediate", levelAr: "متوسط", duration: "10 weeks", tools: ["Node.js", "Express", "PostgreSQL", "Redis"], gradient: "from-green-500 to-teal-500" },
      { title: "Cloud & DevOps", titleAr: "السحابة وDevOps", description: "Docker, CI/CD, AWS, Kubernetes, monitoring, and infrastructure as code.", descriptionAr: "Docker وCI/CD وAWS وKubernetes والمراقبة والبنية التحتية ككود.", level: "Advanced", levelAr: "متقدم", duration: "10 weeks", tools: ["Docker", "AWS", "Kubernetes", "GitHub Actions"], gradient: "from-teal-500 to-cyan-500" },
    ],
    roadmap: [
      { title: "Phase 1: Web Fundamentals", titleAr: "المرحلة ١: أساسيات الويب", description: "HTML, CSS, JavaScript, Git, and responsive design principles.", descriptionAr: "HTML وCSS وJavaScript وGit ومبادئ التصميم المتجاوب.", skills: ["HTML/CSS", "JavaScript", "Git", "Responsive Design"] },
      { title: "Phase 2: Frontend Mastery", titleAr: "المرحلة ٢: إتقان الواجهة الأمامية", description: "React ecosystem, TypeScript, state management, and component architecture.", descriptionAr: "منظومة React وTypeScript وإدارة الحالة وبنية المكونات.", skills: ["React", "TypeScript", "Redux/Zustand", "Testing"] },
      { title: "Phase 3: Backend & Databases", titleAr: "المرحلة ٣: الخوادم وقواعد البيانات", description: "Node.js APIs, database design, authentication, and server-side patterns.", descriptionAr: "واجهات Node.js وتصميم قواعد البيانات والمصادقة وأنماط جانب الخادم.", skills: ["Node.js", "PostgreSQL", "REST APIs", "JWT Auth"] },
      { title: "Phase 4: DevOps & Deployment", titleAr: "المرحلة ٤: DevOps والنشر", description: "Containerization, CI/CD pipelines, cloud deployment, and monitoring.", descriptionAr: "الحاويات وأنابيب CI/CD والنشر السحابي والمراقبة.", skills: ["Docker", "AWS", "CI/CD", "Monitoring"] },
    ],
    faqs: [
      { question: "Is this for complete beginners?", questionAr: "هل هذا للمبتدئين تماماً؟", answer: "Yes! The Frontend track starts from HTML/CSS basics. No prior coding experience needed.", answerAr: "نعم! مسار الواجهة الأمامية يبدأ من أساسيات HTML/CSS. لا حاجة لخبرة برمجية سابقة." },
      { question: "Which tech stack do you teach?", questionAr: "ما التقنيات التي تُدرّسونها؟", answer: "Our primary stack is React + TypeScript (frontend), Node.js + Express (backend), and PostgreSQL (database), with Docker and AWS for deployment.", answerAr: "تقنياتنا الأساسية هي React + TypeScript (واجهة)، Node.js + Express (خادم)، وPostgreSQL (قاعدة بيانات)، مع Docker وAWS للنشر." },
      { question: "Will I be job-ready after completing?", questionAr: "هل سأكون جاهزاً لسوق العمل بعد الإتمام؟", answer: "Graduates leave with a portfolio of 5+ production-quality projects and the skills expected by MENA tech companies.", answerAr: "يتخرج الطلاب بمعرض أعمال يضم 5+ مشاريع بجودة إنتاجية والمهارات المتوقعة من شركات التقنية في المنطقة." },
      { question: "Do you cover system design?", questionAr: "هل تغطون تصميم الأنظمة؟", answer: "Yes, the advanced track covers system design patterns, scalability, and architectural decision-making for production systems.", answerAr: "نعم، المسار المتقدم يغطي أنماط تصميم الأنظمة وقابلية التوسع واتخاذ القرارات المعمارية لأنظمة الإنتاج." },
    ],
    value: {
      learningOutcomes: [
        { en: "Build full-stack web applications from scratch", ar: "بناء تطبيقات ويب متكاملة من الصفر" },
        { en: "Design and implement RESTful APIs", ar: "تصميم وتنفيذ واجهات RESTful" },
        { en: "Deploy applications with Docker and CI/CD", ar: "نشر التطبيقات باستخدام Docker وCI/CD" },
        { en: "Manage cloud infrastructure on AWS", ar: "إدارة البنية التحتية السحابية على AWS" },
        { en: "Write clean, testable, production-grade code", ar: "كتابة كود نظيف وقابل للاختبار وبمستوى الإنتاج" },
      ],
      tools: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Kubernetes", "Redis", "Vite", "GitHub Actions", "Tailwind CSS"],
    },
  },

  "space-solutions": {
    slug: "space-solutions",
    title: "School of Space Solutions",
    titleAr: "كلية تكنولوجيا الفضاء",
    subtitle: "Satellite systems, Earth observation AI, and aerospace data pipelines.",
    subtitleAr: "أنظمة الأقمار الاصطناعية وذكاء رصد الأرض وأنابيب بيانات الفضاء.",
    image: "/uploads/school_space_cover.webp",
    icon: Rocket,
    gradient: "from-indigo-500 to-purple-600",
    tracks: [
      { title: "Earth Observation & Remote Sensing", titleAr: "رصد الأرض والاستشعار عن بُعد", description: "Satellite imagery processing, spectral analysis, and geospatial data pipelines.", descriptionAr: "معالجة صور الأقمار الاصطناعية والتحليل الطيفي وأنابيب البيانات الجغرافية المكانية.", level: "Beginner", levelAr: "مبتدئ", duration: "8 weeks", tools: ["QGIS", "Google Earth Engine", "Python", "GDAL"], gradient: "from-indigo-500 to-blue-500" },
      { title: "Space AI & Autonomous Systems", titleAr: "الذكاء الاصطناعي الفضائي والأنظمة الذاتية", description: "AI for satellite operations, autonomous navigation, and orbital mechanics.", descriptionAr: "الذكاء الاصطناعي لعمليات الأقمار الاصطناعية والملاحة الذاتية وميكانيكا المدارات.", level: "Advanced", levelAr: "متقدم", duration: "12 weeks", tools: ["ROS2", "PyTorch", "STK", "MATLAB"], gradient: "from-blue-500 to-purple-500" },
    ],
    roadmap: [
      { title: "Phase 1: Space Fundamentals", titleAr: "المرحلة ١: أساسيات الفضاء", description: "Orbital mechanics, satellite subsystems, and space mission design.", descriptionAr: "ميكانيكا المدارات وأنظمة الأقمار الاصطناعية الفرعية وتصميم المهام الفضائية.", skills: ["Orbital Mechanics", "Mission Design", "Physics"] },
      { title: "Phase 2: Remote Sensing", titleAr: "المرحلة ٢: الاستشعار عن بُعد", description: "Satellite imagery, spectral analysis, and geospatial data processing.", descriptionAr: "صور الأقمار الاصطناعية والتحليل الطيفي ومعالجة البيانات الجغرافية المكانية.", skills: ["QGIS", "Google Earth Engine", "GDAL", "Rasterio"] },
      { title: "Phase 3: Space AI Applications", titleAr: "المرحلة ٣: تطبيقات الذكاء الاصطناعي الفضائي", description: "AI for Earth observation, satellite anomaly detection, and autonomous systems.", descriptionAr: "الذكاء الاصطناعي لرصد الأرض وكشف شذوذ الأقمار الاصطناعية والأنظمة الذاتية.", skills: ["PyTorch", "Computer Vision", "ROS2", "Edge AI"] },
    ],
    faqs: [
      { question: "Do I need an aerospace background?", questionAr: "هل أحتاج خلفية في هندسة الفضاء؟", answer: "No. We start from fundamentals and build up. A background in engineering, physics, or computer science is helpful but not required.", answerAr: "لا. نبدأ من الأساسيات ونبني تدريجياً. خلفية في الهندسة أو الفيزياء أو علوم الحاسوب مفيدة لكنها ليست مطلوبة." },
      { question: "What makes this program unique in the MENA region?", questionAr: "ما الذي يميز هذا البرنامج في منطقة الشرق الأوسط؟", answer: "We are the first academy in the region to offer hands-on space technology training with real satellite data and industry-standard tools.", answerAr: "نحن أول أكاديمية في المنطقة تقدم تدريباً عملياً في تكنولوجيا الفضاء ببيانات أقمار اصطناعية حقيقية وأدوات بمعايير الصناعة." },
      { question: "What career opportunities exist?", questionAr: "ما الفرص الوظيفية المتاحة؟", answer: "Remote sensing analyst, GIS engineer, satellite operations engineer, and space AI researcher.", answerAr: "محلل استشعار عن بُعد، مهندس GIS، مهندس عمليات أقمار اصطناعية، وباحث ذكاء اصطناعي فضائي." },
    ],
    value: {
      learningOutcomes: [
        { en: "Process and analyze satellite imagery", ar: "معالجة وتحليل صور الأقمار الاصطناعية" },
        { en: "Build geospatial data pipelines", ar: "بناء أنابيب بيانات جغرافية مكانية" },
        { en: "Apply AI to Earth observation data", ar: "تطبيق الذكاء الاصطناعي على بيانات رصد الأرض" },
        { en: "Design autonomous navigation systems", ar: "تصميم أنظمة ملاحة ذاتية" },
      ],
      tools: ["Python", "QGIS", "Google Earth Engine", "PyTorch", "GDAL", "ROS2", "STK", "MATLAB", "Docker", "TensorFlow"],
    },
  },
};
