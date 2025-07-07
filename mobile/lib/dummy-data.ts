import { Event, User } from '../types/index_';

export const DUMMY_USER: Partial<User> = {
  firstName: 'Bob',
  lastName: 'Smith',
  userType: 'organizer',
  image:
    'https://images.unsplash.com/photo-1518882570151-157128e78fa1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

export const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    name: 'F.C. Barcelona VS Chipolopolo Legends',
    host: 'Football Association of Zambia',
    date: '2024-04-09',
    type: 'fundraiser',
    location: 'Heros Stadium, Lusaka',
    bannerImage: '/events/1.jpg', // 16/9 RATIO - LANDSCAPE
    thumbnail: '/events/1.jpg', // SQUARE IMAGE
    description:
      'A football event for the F.C. Barcelona and Chipolopolo Legends You can still secure your spot! Hurry and grab your online tickets now using BGS E-TICKETY! Save the number +260961696458 to purchase tickets. Join us for an unforgettable football experience.',
    min_price: 100,
    tags: ['Family', 'Soccer', 'football'],
    ticketTypes: [
      {
        id: '1',
        name: 'Regular Ticket',
        price: 100,
        slots: 10000,
        quantity: 0,
      },
      {
        id: '2',
        name: 'VIP Ticket',
        price: 1000,
        slots: 1000,
        quantity: 0,
      },
      {
        id: '3',
        name: 'Premium Ticket',
        price: 3000,
        slots: 100,
        quantity: 0,
      },
    ],
  },
  {
    id: '2',
    name: 'Ngoma Awards 2024',
    host: 'National Awards Council of Zambia',
    date: '2024-04-15',
    type: 'gala',
    location: 'Mulungushi Conference Centre',
    bannerImage: '/events/2.jpg',
    thumbnail: '/events/2.jpg',
    description:
      "Zambia's biggest Awards festival returns! Three days of incredible music featuring international and local artists. Early bird tickets available until April 30th. Visit https://arts.gov.zm/ for details.",
    min_price: 250,
    tags: ['Music', 'Jazz', 'Festival'],
    ticketTypes: [
      {
        id: '4',
        name: 'Single Day Pass',
        price: 250,
        slots: 5000,
      },
      {
        id: '5',
        name: 'Weekend Pass',
        price: 600,
        slots: 2000,
      },
      {
        id: '6',
        name: 'VIP Weekend Pass (includes backstage access)',
        price: 2000,
        slots: 200,
      },
    ],
  },
  {
    id: '3',
    name: 'Lusaka Culinary Challenge',
    host: 'The Lozi Kitchen',
    date: '2024-04-08',
    type: 'conference',
    location: 'Matebeto Park',
    bannerImage: '/events/4.jpg',
    thumbnail: '/events/4.jpg',
    description:
      "Calling all foodies! Join us for the Lusaka Culinary Challenge, a showcase of Zambia's finest Chefs. Sample dishes, enjoy live music, and vote for your favorite! Free entry.",
    min_price: 0,
    tags: ['Food', 'Festival', 'Competition'],
    ticketTypes: [],
  },
  {
    id: '4',
    name: 'Victoria Falls Music Festival',
    host: 'Zambezi Expeditions',
    date: '2024-04-13',
    type: 'festival',
    location: 'Victoria Falls',
    bannerImage: '/events/7.jpg',
    thumbnail: '/events/7.jpg',
    description:
      'Experience the thrill of white water rafting on the mighty Zambezi River!  Half-day and full-day trips available.  All skill levels welcome.  Book your adventure today!',
    min_price: 1500,
    tags: ['Adventure', 'Water Sports', 'Victoria Falls'],
    ticketTypes: [
      {
        id: '7',
        name: 'Half-Day Rafting',
        price: 1500,
        quantity: 100,
      },
      {
        id: '8',
        name: 'Full-Day Rafting',
        price: 2500,
        slots: 50,
      },
    ],
  },
  {
    id: '5',
    name: 'Ncwala Ceremony',
    host: 'Ngoni Culture Expeditions',
    date: '2024-04-14',
    type: 'expo',
    location: 'Chipata',
    bannerImage: '/events/8.jpg',
    thumbnail: '/events/8.jpg',
    description:
      'Experience the thrill of white water rafting on the mighty Zambezi River!  Half-day and full-day trips available.  All skill levels welcome.  Book your adventure today!',
    min_price: 1500,
    tags: ['Adventure', 'Water Sports', 'Victoria Falls'],
    ticketTypes: [
      {
        id: '7',
        name: 'Children',
        price: 1500,
        slots: 100,
      },
      {
        id: '8',
        name: 'Adult',
        price: 2500,
        slots: 500,
      },
    ],
  },
  {
    id: '9',
    name: 'Breakfast with the GIRLS',
    host: 'LSKGAALS',
    date: '2024-04-05',
    type: 'conference',
    location: 'EastPark Mall',
    thumbnail: '/events/10.jpg',
    bannerImage: '/events/10.jpg',
    description:
      'Breakfast the thrill of white water rafting on the mighty Zambezi River!  Half-day and full-day trips available.  All skill levels welcome.  Book your adventure today!',
    min_price: 1500,
    tags: ['Adventure', 'Water Sports', 'Victoria Falls'],
    ticketTypes: [
      {
        id: '7',
        name: 'Virtual',
        price: 15,
        slots: 100,
      },
    ],
  },
];
