export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit 2024",
    slug: "react-summit-2024",
    location: "Amsterdam, Netherlands",
    date: "2024-06-14",
    time: "09:00",
  },
  {
    image: "/images/event2.png",
    title: "JSConf EU",
    slug: "jsconf-eu-2024",
    location: "Berlin, Germany",
    date: "2024-09-10",
    time: "10:00",
  },
  {
    image: "/images/event3.png",
    title: "HackMIT",
    slug: "hackmit-2024",
    location: "Cambridge, MA, USA",
    date: "2024-09-21",
    time: "08:00",
  },
  {
    image: "/images/event4.png",
    title: "Next.js Conf",
    slug: "nextjs-conf-2024",
    location: "San Francisco, CA, USA",
    date: "2024-10-15",
    time: "09:30",
  },
  {
    image: "/images/event5.png",
    title: "PyCon US",
    slug: "pycon-us-2024",
    location: "Pittsburgh, PA, USA",
    date: "2024-05-15",
    time: "09:00",
  },
];
