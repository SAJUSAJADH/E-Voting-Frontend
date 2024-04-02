import {
  TwitterOutlined,
  GithubOutlined,
  RedditOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  IeOutlined,
} from '@ant-design/icons'

export const navigate = (path) => {
  if (typeof window !== 'undefined') {
    window.open(path, '_blank')
  }
}

export const communities = [
  {
    icon: <GithubOutlined className='mb-1 text-2xl' />,
    title: 'Github',
    description: 'Make your contribution to the Votechain Community',
    Link: 'https://github.com',
  },
  {
    icon: <TwitterOutlined className='mb-1 text-2xl' />,
    title: 'Votechain twitter Labs',
    description: 'Follow the latest news from Votechain Team',
    Link: 'https://twitter.com/',
  },
  {
    icon: <LinkedinOutlined className='mb-1 text-2xl' />,
    title: 'Votechain Linkedin',
    description: 'Share ideas and participate in Votechain Governance',
    Link: 'https://www.linkedin.com',
  },
  {
    icon: <InstagramOutlined className='mb-1 text-2xl' />,
    title: 'Instagram',
    description:
      'Stay up to date with announcements from the public Education Fund',
    Link: 'https://www.instagram.com',
  },
  {
    icon: <RedditOutlined className='mb-1 text-2xl' />,
    title: 'Reddit',
    description: 'Contribute to wide-ranging Votechain discussions',
    Link: 'https://www.reddit.com/',
  },
  {
    icon: <IeOutlined className='mb-1 text-2xl' />,
    title: 'Blogs',
    description: 'Learn about recent grants recipients and program updates',
    Link: 'https://techsnoobs.vercel.app/',
  },
]

export const posts = [
  {
    title: 'Blockchain for Electronic Voting System',
    image:
      'https://www.aranca.com/assets/uploads/blogs/blockchanihelpovrban.jpg',
    date: '22-04-2024',
    summary:
      'Online voting is a trend that is gaining momentum in modern society. It has great potential to decrease organizational costs and increase voter turnout.',
    route: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8434614/',
  },
  {
    title: 'Blockchain in Voting Systems: The Future of Secure Elections',
    image:
      'https://blog.emb.global/wp-content/uploads/2024/01/blockchain-in-voting-system-768x430.webp',
    date: '22-04-2024',
    summary:
      'As technology continues to advance, the integration of blockchain in voting systems is poised to revolutionize the way elections are conducted, ensuring a future of secure and transparent electoral processes.',
    route: 'https://blog.emb.global/blockchain-in-voting-systems/',
  },
  {
    title:
      'Meta-Analysis on Scalable Blockchain-Based Electronic Voting Systems',
    image:
      'https://image.slidesharecdn.com/3-181108170200/85/blockchain-on-aws-6-320.jpg?cb=1667865671',
    date: '22-04-2024',
    summary:
      'The scalability of Blockchain has arisen as a fundamental barrier to realizing the promise of this technology, especially in electronic voting.',
    route: 'https://www.mdpi.com/1424-8220/22/19/7585',
  },
  {
    title: 'The Future of Voting: Blockchain based e-voting system',
    image:
      'https://www.zenledger.io/wp-content/uploads/2023/11/The-Future-of-Voting-How-Blockchain-Voting-Technology-Can-Enhance-Electoral-Integrity.png',
    date: '22-04-2024',
    summary:
      'Discover how blockchain voting offers a secure, transparent solution to modern electoral challenges. Explore its impact on election integrity and security. conducting of secure elctions on blockchain.',
    route:
      'https://www.zenledger.io/blog/the-future-of-voting-how-blockchain-voting-technology-can-enhance-electoral-integrity/',
  },
  {
    title: 'E-Voting Via Blockchain: A Case Study on E-Voting Via Blockchain',
    image: 'https://i.ytimg.com/vi/d0iLN8LDJ8g/maxresdefault.jpg',
    date: '24-01-2024',
    summary:
      'A case study on how blockchain brings unprecedented transparency to the general elections along with the pros and cons of using it. Examine the elction process. analyse various strategies avilable.',
    route:
      'https://techblog.geekyants.com/e-voting-via-blockchain-a-case-study',
  },
  {
    title:
      'Implementing Blockchain for Voting: An Indepth Look at the Technical Issues',
    image:
      'https://blockonomi.com/wp-content/uploads/2018/11/blockchain-voting-1024x682.jpg',
    date: '24-01-2024',
    summary:
      'The current criticisms of blockchain-based voting systems largely stem from their functionality as online/e-voting models that have received their fair share of criticism over the years as vulnerable to hacking and manipulation.',
    route: 'https://blockonomi.com/implementing-blockchain-voting/',
  },
]

