import { supabase } from '../utils/supabaseClient';

// User operations
export async function getUser(id: string) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data ?? null;
}

export async function updateUser(id: string, updates: any) {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data ?? null;
}

export async function signUp(username: string, password: string, email?: string, userData?: any) {
  // First create auth user
  const emailValue = email ?? undefined;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: emailValue as string,
    password: password as string,
    options: {
      data: userData,
    },
  } as any);
  if (authError) throw authError;

  // Then create user profile
  if (authData.user) {
    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      full_name: userData?.fullName ?? '',
      username,
      email: authData.user.email ?? '',
      nationality: userData?.nationality ?? 'سعودي',
      language: userData?.language ?? 'العربية',
      currency: userData?.currency ?? 'SAR',
      profile_image: userData?.profileImage ?? '',
      account_type: userData?.accountType ?? 'creator',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    if (userError) throw userError;
  }

  return authData;
}

export async function signIn(usernameOrPhone: string, password: string) {
  // Try sign in with password
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameOrPhone,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Post operations
export async function getPosts(limit?: number) {
  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPost(postData: any) {
  const { data, error } = await supabase.from('posts').insert(postData).select().single();
  if (error) throw error;
  return data;
}

export async function updatePost(id: string, updates: any) {
  const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

// Product operations
export async function getProducts(limit?: number) {
  let query = supabase.from('products').select('*').eq('is_approved', true).order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createProduct(productData: any) {
  const { data, error } = await supabase.from('products').insert(productData).select().single();
  if (error) throw error;
  return data;
}

// Channel operations
export async function getChannels() {
  const { data, error } = await supabase.from('channels').select('*');
  if (error) throw error;
  return data;
}

export async function createChannel(channelData: any) {
  const { data, error } = await supabase.from('channels').insert(channelData).select().single();
  if (error) throw error;
  return data;
}

// Message operations
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_ids.ilike.%${userId}%`);
  if (error) throw error;
  return data;
}

export async function createMessage(messageData: any) {
  const { data, error } = await supabase.from('messages').insert(messageData).select().single();
  if (error) throw error;
  return data;
}

// Notification operations
export async function getNotifications(userId: string) {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
  if (error) throw error;
}

// Report operations
export async function createReport(reportData: any) {
  const { data, error } = await supabase.from('reports').insert(reportData).select().single();
  if (error) throw error;
  return data;
}

// Blocked word operations
export async function getBlockedWords() {
  const { data, error } = await supabase.from('blocked_words').select('*');
  if (error) throw error;
  return data;
}

export async function addBlockedWord(word: string) {
  const { data, error } = await supabase.from('blocked_words').insert({ word }).select().single();
  if (error) throw error;
  return data;
}

// Support ticket operations
export async function createSupportTicket(ticketData: any) {
  const { data, error } = await supabase.from('support_tickets').insert(ticketData).select().single();
  if (error) throw error;
  return data;
}

// Platform settings
export async function getPlatformSettings() {
  const { data, error } = await supabase.from('platform_settings').select('*').single();
  if (error) throw error;
  return data;
}

export async function updatePlatformSettings(settings: any) {
  const { data, error } = await supabase.from('platform_settings').update(settings).eq('id', 'single').select().single();
  if (error) throw error;
  return data;
}

// Auth state listeners
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}