export const currentUser = {
  id: 'u0',
  username: 'you.dev',
  fullName: 'You Developer',
  avatar: 'https://i.pravatar.cc/150?img=3',
  bio: 'Building cool stuff 🚀  |  UCI Hacker',
  followers: 1204,
  following: 342,
  posts: 58,
  verified: false,
};

export const users = [
  { id: 'u1', username: 'street.visuals', fullName: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?img=11', followers: 48200, following: 612, posts: 312, verified: true, bio: 'Photographer 📷 | NYC' },
  { id: 'u2', username: 'luna.codes', fullName: 'Luna Park', avatar: 'https://i.pravatar.cc/150?img=5', followers: 12300, following: 890, posts: 145, verified: false, bio: 'Full-stack dev ✨' },
  { id: 'u3', username: 'kai.travels', fullName: 'Kai Chen', avatar: 'https://i.pravatar.cc/150?img=7', followers: 98700, following: 230, posts: 567, verified: true, bio: 'Solo traveler 🌍' },
  { id: 'u4', username: 'nova.art', fullName: 'Nova Williams', avatar: 'https://i.pravatar.cc/150?img=44', followers: 31000, following: 402, posts: 209, verified: false, bio: 'Digital artist 🎨' },
  { id: 'u5', username: 'jax.fitness', fullName: 'Jaxon Reeves', avatar: 'https://i.pravatar.cc/150?img=15', followers: 55600, following: 178, posts: 422, verified: true, bio: 'Coach | Athlete 💪' },
  { id: 'u6', username: 'mia.eats', fullName: 'Mia Torres', avatar: 'https://i.pravatar.cc/150?img=9', followers: 23400, following: 721, posts: 188, verified: false, bio: 'Food blogger 🍜' },
  { id: 'u7', username: 'rio.music', fullName: 'Rio Sanchez', avatar: 'https://i.pravatar.cc/150?img=59', followers: 74100, following: 312, posts: 98, verified: true, bio: 'Producer | Beats 🎵' },
  { id: 'u8', username: 'zara.style', fullName: 'Zara Kim', avatar: 'https://i.pravatar.cc/150?img=47', followers: 112000, following: 894, posts: 634, verified: true, bio: 'Style & Fashion 👗' },
];

const unsplashImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  'https://images.unsplash.com/photo-1682686581498-5e85c7228119?w=600&q=80',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&q=80',
  'https://images.unsplash.com/photo-1726065235530-1a4cd73a0c0c?w=600&q=80',
  'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
];

export const posts = [
  { id: 'p1', user: users[0], image: unsplashImages[0], caption: 'Golden hour never gets old 🌅 #photography #mountains', likes: 4821, comments: 132, saved: false, liked: false, timestamp: '2h', location: 'Yosemite, CA' },
  { id: 'p2', user: users[1], image: unsplashImages[8], caption: 'Late night coding sessions hit different ☕️ #devlife', likes: 1340, comments: 67, saved: false, liked: false, timestamp: '4h', location: null },
  { id: 'p3', user: users[2], image: unsplashImages[1], caption: 'Lost in the clouds ☁️ #travel #adventure', likes: 12430, comments: 340, saved: false, liked: false, timestamp: '6h', location: 'Alps, Switzerland' },
  { id: 'p4', user: users[3], image: unsplashImages[4], caption: 'New piece just dropped 🎨 #digitalart #abstract', likes: 3210, comments: 98, saved: false, liked: false, timestamp: '8h', location: null },
  { id: 'p5', user: users[4], image: unsplashImages[5], caption: 'Morning grind. No excuses 💪 #fitness #gym', likes: 7890, comments: 201, saved: false, liked: false, timestamp: '10h', location: 'Los Angeles, CA' },
  { id: 'p6', user: users[5], image: unsplashImages[10], caption: 'Ramen nights 🍜 Recipe in bio! #foodie #ramen', likes: 2890, comments: 145, saved: false, liked: false, timestamp: '12h', location: 'Tokyo, Japan' },
  { id: 'p7', user: users[6], image: unsplashImages[9], caption: 'The energy at this show was unreal 🎵 #music #festival', likes: 9102, comments: 267, saved: false, liked: false, timestamp: '1d', location: 'Coachella, CA' },
  { id: 'p8', user: users[7], image: unsplashImages[6], caption: 'Minimal. Clean. Timeless. ✨ #fashion #ootd', likes: 15600, comments: 412, saved: false, liked: false, timestamp: '1d', location: 'Milan, Italy' },
];

export const stories = [
  { id: 's0', user: currentUser, seen: false, isOwn: true },
  { id: 's1', user: users[0], seen: false },
  { id: 's2', user: users[1], seen: false },
  { id: 's3', user: users[2], seen: true },
  { id: 's4', user: users[3], seen: false },
  { id: 's5', user: users[4], seen: true },
  { id: 's6', user: users[5], seen: false },
  { id: 's7', user: users[6], seen: false },
  { id: 's8', user: users[7], seen: true },
];

export const conversations = [
  { id: 'c1', user: users[0], lastMessage: 'Your edit was 🔥🔥', time: '2m', unread: 2, online: true },
  { id: 'c2', user: users[1], lastMessage: 'Can you share that snippet?', time: '15m', unread: 0, online: true },
  { id: 'c3', user: users[2], lastMessage: 'Let\'s collab on a trip!', time: '1h', unread: 1, online: false },
  { id: 'c4', user: users[3], lastMessage: 'Thanks for the like 🎨', time: '3h', unread: 0, online: false },
  { id: 'c5', user: users[4], lastMessage: 'Gym at 6?', time: '5h', unread: 0, online: true },
  { id: 'c6', user: users[5], lastMessage: 'You have to try this place!', time: '1d', unread: 0, online: false },
];

export const messages = {
  c1: [
    { id: 'm1', from: 'u1', text: 'Yo that photo yesterday was insane!', time: '10:30 AM' },
    { id: 'm2', from: 'u0', text: 'Thanks! Shot it on a film camera 📷', time: '10:32 AM' },
    { id: 'm3', from: 'u1', text: 'No way! Which one?', time: '10:33 AM' },
    { id: 'm4', from: 'u0', text: 'Contax T2, got it at a flea market', time: '10:35 AM' },
    { id: 'm5', from: 'u1', text: 'Your edit was 🔥🔥', time: '10:36 AM' },
  ],
};

export const notifications = [
  { id: 'n1', type: 'like', user: users[0], content: 'liked your photo.', image: unsplashImages[0], time: '2m' },
  { id: 'n2', type: 'follow', user: users[1], content: 'started following you.', image: null, time: '15m' },
  { id: 'n3', type: 'comment', user: users[2], content: 'commented: "Stunning shot! 🌄"', image: unsplashImages[2], time: '1h' },
  { id: 'n4', type: 'like', user: users[3], content: 'liked your photo.', image: unsplashImages[4], time: '2h' },
  { id: 'n5', type: 'like', user: users[4], content: 'liked your reel.', image: unsplashImages[5], time: '3h' },
  { id: 'n6', type: 'follow', user: users[5], content: 'started following you.', image: null, time: '5h' },
  { id: 'n7', type: 'mention', user: users[6], content: 'mentioned you in a comment.', image: unsplashImages[9], time: '1d' },
];

export const reels = [
  { id: 'r1', user: users[0], thumbnail: unsplashImages[0], caption: 'Golden hour magic ✨', likes: 42000, comments: 1200, audio: 'Original Audio' },
  { id: 'r2', user: users[2], thumbnail: unsplashImages[1], caption: 'Travel diaries 🌍', likes: 88000, comments: 3400, audio: 'Trending Song' },
  { id: 'r3', user: users[4], thumbnail: unsplashImages[5], caption: 'PR day 💪 #fitness', likes: 31000, comments: 890, audio: 'Workout Anthem' },
  { id: 'r4', user: users[7], thumbnail: unsplashImages[6], caption: 'OOTD inspo ✨', likes: 65000, comments: 2100, audio: 'Lo-fi Beats' },
];

export const exploreImages = unsplashImages.map((img, i) => ({
  id: `e${i}`,
  image: img,
  user: users[i % users.length],
  likes: Math.floor(Math.random() * 50000) + 500,
  isVideo: i % 4 === 0,
  isLarge: i % 5 === 0,
}));
