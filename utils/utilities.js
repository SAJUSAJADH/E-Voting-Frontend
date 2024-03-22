import {
    TwitterOutlined,
    GithubOutlined,
    RedditOutlined,
    LinkedinOutlined,
    InstagramOutlined,
    IeOutlined,
  } from "@ant-design/icons";

export const navigate = (path) => {
    if (typeof window !== "undefined") {
      window.open(path, "_blank");
    }
  };

export const communities = [
    {
      icon: <GithubOutlined className="mb-1 text-2xl" />,
      title: "Github",
      description: "Make your contribution to the Votechain Community",
      Link: "https://github.com",
    },
    {
      icon: <TwitterOutlined className="mb-1 text-2xl" />,
      title: "Votechain twitter Labs",
      description: "Follow the latest news from Votechain Team",
      Link: "https://twitter.com/r",
    },
    {
      icon: <LinkedinOutlined className="mb-1 text-2xl" />,
      title: "Votechain Linkedin",
      description: "Share ideas and participate in Votechain Governance",
      Link: "https://www.linkedin.com",
    },
    {
      icon: <InstagramOutlined className="mb-1 text-2xl" />,
      title: "Instagram",
      description:
        "Stay up to date with announcements from the public Education Fund",
      Link: "https://www.instagram.com",
    },
    {
      icon: <RedditOutlined className="mb-1 text-2xl" />,
      title: "Reddit",
      description: "Contribute to wide-ranging Votechain discussions",
      Link: "https://www.reddit.com/",
    },
    {
      icon: <IeOutlined className="mb-1 text-2xl" />,
      title: "Blogs",
      description: "Learn about recent grants recipients and program updates",
      Link: "https://techsnoobs.vercel.app/",
    },
  ];