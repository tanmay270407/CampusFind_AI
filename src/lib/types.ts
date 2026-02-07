export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  avatarUrl: string;
  avatarHint: string;
};

export type Item = {
  id: string;
  name: string;
  type: 'lost' | 'found';
  itemType: 'Water Bottle' | 'ID Card' | 'Bag' | 'Book' | 'Gadget' | 'Other';
  description: string;
  imageUrl: string;
  imageHint: string;
  location: string;
  reportedAt: string; // Using string for simplicity in mock data
  reportedBy: string; // User ID
  status: 'open' | 'claimed' | 'archived';
};

export type Claim = {
  id: string;
  lostItemId: string;
  foundItemId: string;
  claimantId: string; // User ID
  status: 'pending' | 'approved' | 'rejected';
  claimDate: string; // Using string for simplicity
  verificationDetails?: string; // AI generated details
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
};
