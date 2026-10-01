export type AdminDogRow = {
  id: string;
  uniqueId: string;
  dogName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  photoUrl: string;
  costumeDescription: string;
  roundNumber: number;
  displayOrder: number;
  isFinalist: boolean;
};

export type DogRecord = {
  id: string;
  unique_id: string;
  dog_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  photo_url: string;
  costume_description: string;
  round_number: number;
  display_order: number;
  is_finalist: boolean;
};

export function mapDog(row: DogRecord): AdminDogRow {
  return {
    id: row.id,
    uniqueId: row.unique_id,
    dogName: row.dog_name,
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
    ownerPhone: row.owner_phone,
    photoUrl: row.photo_url,
    costumeDescription: row.costume_description,
    roundNumber: row.round_number,
    displayOrder: row.display_order,
    isFinalist: row.is_finalist,
  };
}
