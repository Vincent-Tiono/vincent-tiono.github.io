module.exports = {
  // pathPrefix: '/gatsby-theme-academic',
  // siteUrl: 'https://tc-imba.github.io',
  pathPrefix: '',
  siteUrl: 'https://vincent-tiono.github.io',
  title: 'Vincent Tiono',
  description: 'Personal Website of Vincent Tiono',
  author: 'Vincent Tiono',
  authorAlternative: '張甡源',
  introduction: [
    'I am a fourth-year [Electrical Engineering](https://web.ee.ntu.edu.tw/eng/index.php) student at [National Taiwan University](https://www.ntu.edu.tw/english/), advised by Professor [Shao-Hua Sun](https://shaohua0116.github.io/) as part of [NTU Robot Learning Lab](https://nturll.xyz/about). My current research focuses on **Programmatic Reinforcement Learning** and **Robot Learning**, aiming to enhance *interpretability*, *efficiency*, and *safety* in human-robot interaction.',
    // 'In this site, almost everything supports Markdown Syntax. For example, you can add hyperlinks in the introduction such as [fxhsb](https://github.com/Reapor-Yurnero) with\n```markdown\n[fxhsb](https://github.com/Reapor-Yurnero)\n```',
    'Beyond my work in Machine Learning, I\'ve had the privilege of interning at [VICI Holdings](https://www.viciholdings.com/en/) as a **Quantitative Research Intern**, [EY-Parthenon](https://www.ey.com/zh_tw/services/strategy-transactions) as a **Strategy and Transactions Summer Associate**, and [Walsin Lihwa](https://www.walsin.com/en/) as a **Business Administration Intern**. Broadly, I am passionate about the intersection of **AI**, **Quant Trading**, and **Business Strategy**.',
  ],
  avatar: 'avatar-new.png',
  professions: [],
  tocMaxDepth: 2,
  excerptMaxLength: 500,
  // birthday: 'Some day',
  location: 'Taipei, Taiwan',
  email: 'b11901123@ntu.edu.tw',
  postsForArchivePage: 3,
  defaultLanguage: 'en',
  disqusScript: process.env.DISQUS_SCRIPT
    || 'https://tc-imba.disqus.com/embed.js',
  pages: {
    home: '/',
    posts: 'posts',
    contact: 'contact',
    resume: 'resume',
    tags: 'tags',
    research: 'research',
  },
  social: [
    {
      url: '/resume.pdf',
      icon: ['ai', 'cv'],
    }, {
      url: 'https://www.linkedin.com/in/vincent-tiono/',
      icon: ['fab', 'linkedin'],
    }, {
      url: 'https://github.com/Vincent-Tiono',
      icon: ['fab', 'github'],
    }, {
      url: 'https://medium.com/@vincent_tiono',
      icon: ['fa-brands', 'fa-medium'],
    },
    // {
    //   url: 'https://twitter.com/',
    //   icon: ['fab', 'twitter'],
    // }, {
    //   url: 'https://scholar.google.com/',
    //   icon: ['fab', 'google-scholar'],
    // },
  ],
  // facebook: 'https://www.facebook.com/rolwin.monteiro',
  // instagram: 'https://www.instagram.com/reevan100/',
  // rss: '/rss.xml',
  wakatime: {
    username: 'tcimba',
    activity: '7add4047-08f9-4da8-b649-aa114503678f',
    language: '460a84ab-722a-4b80-b896-cabaa13ad7eb',
    editor: 'd851639a-28d8-4884-949f-d338a858f7e9',
    os: 'caf7d0d1-8fd2-4595-a991-363c8583fea9',
  },
  contactFormUrl: process.env.CONTACT_FORM_ENDPOINT
    || 'https://getform.io/f/09a3066f-c638-40db-ad59-05e4ed71e451',
  googleAnalyticTrackingId: process.env.GA_TRACKING_ID || 'G-L0KPV6MLMV',
  education: [
    {
      date: 'Sept 2022 - Present',
      icon: 'university',
      title: 'B.S. in Electrical Engineering',
      location: 'National Taiwan University',
    },
    {
      date: 'Sept 2019 - June 2022',
      icon: 'school',
      title: 'High School Diploma',
      location: 'Jakarta Taipei School',
      // location: 'Some University, Somewhere',
    },
    // {
    //   date: 'Sept 2008 - June 2015',
    //   icon: 'school',
    //   title: 'Middle School',
    //   location: 'Some Middle School, Somewhere',
    // },
  ],
  interests: [
    {
      icon: ['fas', 'robot'],
      title: 'Robot Learning',
    }, {
      icon: ['fas', 'laptop-code'],
      title: 'Algorithmic Trading',
    }, {
      icon: ['fas', 'handshake'],
      // icon: 'linux',
      title: 'Engineering Management',
    }],
  experience: [
    {
      title: 'Research Experience',
      position: 'left',
      data: [
        {
          date: '(Incoming) Nov. 2025',
          title: 'Visiting Scholar',
          location: '[**The Institute for Solid State Physics, The University of Tokyo**](https://www.issp.u-tokyo.ac.jp/index_en.html)',
          description: [
            '• Advisor: [Lung-Han Peng](https://gipo.ntu.edu.tw/en/member/faculty/Lung-Han-Peng-6188140), [Akiyama Hidefumi](https://www.issp.u-tokyo.ac.jp/maincontents/organization/labs/akiyama_group_en.html), [Yohei Kobayashi](https://www.issp.u-tokyo.ac.jp/maincontents/organization/labs/kobayashi_group_en.html), [Shinji Miwa](https://www.issp.u-tokyo.ac.jp/maincontents/organization/labs/miwa_group_en.html)',
          ],
        }, {
          date: 'Feb. 2025 - Present',
          title: 'Undergraduate Researcher',
          location: '[**NTU Robot Learning Lab**](https://nturll.xyz/about)',
          description: [
            '• Advisor: [Shao-Hua Sun](https://shaohua0116.github.io/)',
            '• Project: [**Synthesizing Programmatic Reinforcement Learning Policies with Demonstrations Guided Search**](/research/DRL-GS)',
          ],
        }, {
          date: 'June 2024 - Dec. 2024',
          title: 'Undergraduate Researcher',
          location: '[**NTU Design Verification Lab**](https://dvlab.ee.ntu.edu.tw/)',
          description: [
            '• Advisor: [Chung-Yang (Ric) Huang](https://cc.ee.ntu.edu.tw/~ric/)',
            '• Project: [**Solving Graeco-Latin Squares Using MiniSAT**](https://github.com/Vincent-Tiono/graeco-latin)',
          ],
        },
      ],
    },
    {
      title: 'Industry Experience',
      position: 'left',
      data: [
        {
          date: '(Incoming) Oct. 2025',
          title: 'Quantitative Research Intern',
          location: '[**VICI Holdings**](https://www.viciholdings.com/en/)',
          description: [],
        }, {        
          date: 'June 2025 - Aug. 2025',
          title: 'Strategy and Transactions Summer Associate',
          location: '[**EY-Parthenon**](https://www.ey.com/zh_tw/services/strategy-transactions)',
          description: [],
        }, {
          date: 'Mar. 2025 - June 2025',
          title: 'AI and Data Analytics Intern',
          location: '[**Ubiik**](https://www.ubiik.com/)',
          description: [],
        }, {
          date: 'June 2024 - Aug. 2024',
          title: 'Business Administration Intern',
          location: '[**Walsin Lihwa**](https://www.walsin.com/en/)',
          description: [],
        },
      ],
    }, 
    {
      title: 'Teaching',
      position: 'right',
      data: [
        {
          date: 'Fall 2025',
          title: 'Teaching Assistant — [EE4058 Photonics Lab](https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=901%2040800&class=&dpt_code=9010&ser_no=21716&semester=114-1)',
          location: 'National Taiwan University',
          description: ['An undergraduate-level laboratory course on optical signal processing.'],
        }, 
        // {
        //   date: 'Aug 2018',
        //   title: 'Teaching Assistant of XXX',
        //   location: 'Somewhere',
        // }, {
        //   date: 'Aug 2017',
        //   title: 'Teaching Assistant of XXX',
        //   location: 'Somewhere',
        // }, {
        //   date: 'Aug 2018',
        //   title: 'Teaching Assistant of XXX',
        //   location: 'Somewhere',
        // }, {
        //   date: 'Aug 2017',
        //   title: 'Teaching Assistant of XXX',
        //   location: 'Somewhere',
        // },
      ],
    }, {
      title: 'Professional Service',
      position: 'right',
      data: [
        {
          // date: 'Aug 2019',
          title: 'Public Relations',
          // location: 'Somewhere',
          description: [
            '• [NTU EE Student Assoc. (2025)](https://www.facebook.com/ntuee.org/?locale=zh_TW)',
            '• [NTU iOS Club (2024)](https://www.instagram.com/ntu.iosclub/?hl=en)', 
            '• [NTU Indonesian Student Assoc. (2023)](https://www.instagram.com/ntuisa/?hl=en)',
          ],
        }, {
          // date: 'Aug 2018',
          title: 'Campus Ambassador',
          description: [
            '• Kennesaw State University, Dept. of ECE — School visit to NTU (2025)',
            '• NTU College of Management Exchange Tour (2024)',
          ],
        }, {
          // date: 'Aug 2017',
          title: 'Program Committee',
          description: [
            '• [National Programming Contest, Malaysia (2025)](https://nsspc.io/)',
            '• [Indonesian Students Assoc. in Taiwan (2024)](https://ppitaiwan.id/)',
            '• [NTU Orientation Camp (2023)](https://ntuorientation.com/home-en/)',
            '• NTU EE Camp (2023)',
          ],
        },
      ],
    },
  ],
  awards: [
    {
      date: 'June 2025',
      title: 'Merit Award — CHT × NTU GMBA AI–Business Competition',
    }, {
      date: '2025',
      title: 'Academic and Conduct Excellence Scholarship',
    }, {
      date: '2024, 2023',
      title: 'Outstanding Overseas Chinese Students Scholarship',
    },
  ],
  tagColors: [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
  ],
  tags: [
    {
      id: 'javascript',
      name: 'javascript',
      description: 'JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.',
      color: '#f0da50',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'Node.js is a tool for executing JavaScript in a variety of environments.',
      color: '#90c53f',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'RxJS is a library for reactive programming using Observables, for asynchronous operations.',
      color: '#eb428e',
    },
    {
      id: 'typescript',
      name: 'typescript',
      description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
      color: '#257acc',
    },
    {
      id: 'reactjs',
      name: 'reactjs',
      description: 'React is an open source JavaScript library used for designing user interfaces.',
      color: '#61dbfa',
    },
    {
      id: 'gatsby',
      name: 'Gatsby.js',
      description: 'A framework built over ReactJS to generate static page web application.  ',
      color: '#6f309f',
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'A markup language that powers the web. All websites use HTML for structuring the content.',
      color: '#dd3431',
    },
    {
      id: 'css',
      name: 'css',
      description: 'CSS is used to style the HTML element and to give a very fancy look for the web application.',
      color: '#43ace0',
    },
    {
      id: 'python',
      name: 'python',
      description: 'A general purpose programming language that is widely used for developing various applications.',
      color: '#f9c646',
    },
  ],
};
