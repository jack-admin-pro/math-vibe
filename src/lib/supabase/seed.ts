import { supabase } from './client';
import type { Profile } from '@/types/database';

const DEFAULT_PROFILES = [
  { name: 'Hela', avatar_color: '#FF6B9D' },
  { name: 'Tata', avatar_color: '#4ECDC4' },
  { name: 'Mama', avatar_color: '#9B59B6' },
];

export async function seedProfiles(): Promise<boolean> {
  // Check if profiles already exist
  const { data: existingProfiles } = await supabase
    .from('profiles')
    .select('name');

  const existingNames = new Set(
    (existingProfiles as { name: string }[] | null)?.map(p => p.name) || []
  );

  // Insert missing profiles
  const profilesToInsert = DEFAULT_PROFILES.filter(
    p => !existingNames.has(p.name)
  );

  if (profilesToInsert.length > 0) {
    const { error } = await supabase
      .from('profiles')
      .insert(profilesToInsert);

    if (error) {
      console.error('Error seeding profiles:', error);
      return false;
    }
  }

  return true;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return (data as Profile[]) || [];
}
