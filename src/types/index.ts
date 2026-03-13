export type PoemType = "haiku" | "tanka";

export interface Poem {
  id: string;
  poemText: string;
  poemType: PoemType;
  imageData: string;
  season: string | null;
  mood: string | null;
  createdAt: string;
}

export interface PoemResult {
  poem: string;
  season: string;
  mood: string;
}

export interface GeneratePoemRequest {
  imageBase64: string;
  imageMediaType: string;
  poemType: PoemType;
}
