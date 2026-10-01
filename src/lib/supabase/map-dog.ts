export type AdminDogRow = {
  id: string;
  uniqueId: string;
  dogName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  photoUrl: string;
  costumeDescription: string;
  breed: string;
  inspiration: string;
  funnyFact: string;
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
  breed?: string | null;
  inspiration?: string | null;
  funny_fact?: string | null;
  round_number: number;
  display_order: number;
  is_finalist: boolean;
};

export const DOG_SELECT =
  "id, unique_id, dog_name, owner_name, owner_email, owner_phone, photo_url, costume_description, breed, inspiration, funny_fact, round_number, display_order, is_finalist";

export function mapDog(row: DogRecord): AdminDogRow {
  return {
    id: row.id,
    uniqueId: row.unique_id,
    dogName: row.dog_name,
    ownerName: row.owner_name,
    ownerEmail: row.owner_email,
    ownerPhone: row.owner_phone,
    photoUrl: row.photo_url ?? "",
    costumeDescription: row.costume_description,
    breed: row.breed ?? "",
    inspiration: row.inspiration ?? "",
    funnyFact: row.funny_fact ?? "",
    roundNumber: row.round_number,
    displayOrder: row.display_order,
    isFinalist: row.is_finalist,
  };
}
