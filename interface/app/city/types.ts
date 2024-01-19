type ActivityStatus = 'high' | 'medium' | 'low';

export interface Performer {
  performerId: string,
  name: string,
  activityStatus: ActivityStatus,
  email: string,
  dateJoined: string,
  performanceStyles: string[],
  totalPerformances: number,
  avgPerformanceTime: number,
  recentSpots: string[],
};

export const samplePerformerData: Performer[] = [
  {
    performerId: '674e45dc-38a8-4b39-a010-4b09c8c37716',
    name: 'Performer One Name',
    activityStatus: 'high',
    email: 'performer@gmail.com',
    dateJoined: '03/14/2024',
    performanceStyles: ['Singing', 'Electric Guitar', 'Juggling'],
    totalPerformances: 10,
    avgPerformanceTime: 0.5,
    recentSpots: ['The Hills', 'Salandia', 'Pouring Rain']
  },
  {
    performerId: '58588cb6-5e87-4e56-8e94-6c7c23f6eb8c',
    name: 'Performer Two Name',
    activityStatus: 'medium',
    email: 'performer@gmail.com',
    dateJoined: '03/14/2024',
    performanceStyles: ['Singing', 'Electric Guitar', 'Juggling'],
    totalPerformances: 20,
    avgPerformanceTime: 1.0,
    recentSpots: ['The Hills', 'Salandia', 'Pouring Rain']
  },
  {
    performerId: '27f82f22-c9ba-43d8-92f6-450c30c304aa',
    name: 'Performer Three Name',
    activityStatus: 'high',
    email: 'performer@gmail.com',
    dateJoined: '03/14/2024',
    performanceStyles: ['Singing', 'Electric Guitar', 'Juggling'],
    totalPerformances: 15,
    avgPerformanceTime: 1.5,
    recentSpots: ['The Hills', 'Salandia', 'Pouring Rain']
  },
  {
    performerId: '61b0110b-8942-4b5f-bc4b-7c335beb019e',
    name: 'Performer Four Name',
    activityStatus: 'high',
    email: 'performer@gmail.com',
    dateJoined: '03/14/2024',
    performanceStyles: ['Singing', 'Electric Guitar', 'Juggling'],
    totalPerformances: 30,
    avgPerformanceTime: 2.5,
    recentSpots: ['The Hills', 'Salandia', 'Pouring Rain']
  },
  {
    performerId: '01e1da11-9634-4595-a185-b0c3d3743ef0',
    name: 'Performer Five Name',
    activityStatus: 'low',
    email: 'performer@gmail.com',
    dateJoined: '03/14/2024',
    performanceStyles: ['Singing', 'Electric Guitar', 'Juggling'],
    totalPerformances: 25,
    avgPerformanceTime: 1.5,
    recentSpots: ['The Hills', 'Salandia', 'Pouring Rain']
  },
];