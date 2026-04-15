// mockChats.ts
// Drop this file anywhere convenient, e.g. constants/mockChats.ts
// Replace with real Supabase queries when you're ready.

export interface MockUser {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string; // one of your theme colors
  online: boolean;
}

export interface MockMessage {
  id: string;
  senderId: string; // 'me' | user id
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface MockConversation {
  id: string;
  participant: MockUser;
  messages: MockMessage[];
}

// Simulated "current user" id
export const MOCK_ME_ID = 'me';

export const mockUsers: MockUser[] = [
  { id: '1', name: 'Alex Chen',     avatarInitials: 'AC', avatarColor: '#378ADD', online: true  },
  { id: '2', name: 'Jordan Lee',    avatarInitials: 'JL', avatarColor: '#7F77DD', online: false },
  { id: '3', name: 'Priya Sharma',  avatarInitials: 'PS', avatarColor: '#1D9E75', online: true  },
  { id: '4', name: 'Marcus Webb',   avatarInitials: 'MW', avatarColor: '#BA7517', online: false },
  { id: '5', name: 'Sofia Nguyen',  avatarInitials: 'SN', avatarColor: '#E24B4A', online: true  },
];

const now = Date.now();
const mins = (n: number) => new Date(now - n * 60 * 1000);

export const mockConversations: MockConversation[] = [
  {
    id: 'convo_1',
    participant: mockUsers[0],
    messages: [
      { id: 'm1', senderId: '1',  text: 'Hey! Did you finish the wireframes?',           timestamp: mins(120), read: true  },
      { id: 'm2', senderId: 'me', text: 'Almost! Should be done by tonight.',             timestamp: mins(115), read: true  },
      { id: 'm3', senderId: '1',  text: 'Perfect, I\'ll review them first thing tomorrow.', timestamp: mins(110), read: true  },
      { id: 'm4', senderId: 'me', text: 'Sounds good 👍',                                 timestamp: mins(105), read: true  },
      { id: 'm5', senderId: '1',  text: 'Also, are you coming to the group meeting at 3?', timestamp: mins(10),  read: false },
    ],
  },
  {
    id: 'convo_2',
    participant: mockUsers[1],
    messages: [
      { id: 'm1', senderId: 'me', text: 'Jordan, can you share the research doc?',        timestamp: mins(300), read: true  },
      { id: 'm2', senderId: '2',  text: 'Sure! I\'ll send it over now.',                  timestamp: mins(295), read: true  },
      { id: 'm3', senderId: '2',  text: 'Sent it to your email as well just in case.',    timestamp: mins(290), read: true  },
      { id: 'm4', senderId: 'me', text: 'Thanks, got it!',                                timestamp: mins(285), read: true  },
    ],
  },
  {
    id: 'convo_3',
    participant: mockUsers[2],
    messages: [
      { id: 'm1', senderId: '3',  text: 'Hey! Can we sync up on the project timeline?',  timestamp: mins(1440), read: true },
      { id: 'm2', senderId: 'me', text: 'Of course, how about Friday afternoon?',         timestamp: mins(1430), read: true },
      { id: 'm3', senderId: '3',  text: 'Friday works! I\'ll create a calendar invite.',  timestamp: mins(1420), read: true },
    ],
  },
  {
    id: 'convo_4',
    participant: mockUsers[3],
    messages: [
      { id: 'm1', senderId: '4',  text: 'Marcus here — just joined the group project.',  timestamp: mins(2880), read: true },
      { id: 'm2', senderId: 'me', text: 'Welcome! Let me know if you need anything.',    timestamp: mins(2870), read: true },
    ],
  },
  {
    id: 'convo_5',
    participant: mockUsers[4],
    messages: [
      { id: 'm1', senderId: '5',  text: 'Sofia here, did you see my PR comments?',       timestamp: mins(4320), read: true },
      { id: 'm2', senderId: 'me', text: 'Yes! Making the fixes now.',                    timestamp: mins(4310), read: true },
      { id: 'm3', senderId: '5',  text: 'Great, thanks!',                                timestamp: mins(4300), read: true },
    ],
  },
];

// Helper: get last message of a conversation
export function getLastMessage(convo: MockConversation): MockMessage {
  return convo.messages[convo.messages.length - 1];
}

// Helper: count unread messages in a conversation
export function getUnreadCount(convo: MockConversation): number {
  return convo.messages.filter(m => m.senderId !== MOCK_ME_ID && !m.read).length;
}

// Helper: format timestamp for display
export function formatTimestamp(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1)   return 'Just now';
  if (diffMins < 60)  return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7)   return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}