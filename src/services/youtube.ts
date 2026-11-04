
import { Song } from "@/types/music";

interface SearchResponse {
  success: boolean;
  results: Song[];
  total: number;
  message?: string;
}

export async function searchYouTube(
  query: string
): Promise<Song[]> {
  const response = await fetch(
    `/api/youtube?q=${encodeURIComponent(query)}`
  );

  const data: SearchResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to search YouTube"
    );
  }

  return data.results || [];
}
