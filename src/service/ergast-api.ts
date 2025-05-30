import type { Season, Race, RaceResultsResponse } from "../types/types";

const BASE_URL = "https://ergast.com/api/f1";

export const getSeasons = async (
  offset: number = 0,
  limit: number = 100
): Promise<{ seasons: Season[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/seasons.json?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    console.log(data);
    return {
      seasons: data.MRData.SeasonTable.Seasons,
      total: data.MRData.total,
    };
  } catch (error) {
    throw new Error(`Failed to fetch seasons: ${error}`);
  }
};

export const getRaces = async (
  season: string,
  offset: number = 0,
  limit: number = 100
): Promise<{ races: Race[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${season}/races.json?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    console.log(data);
    return {
      races: data.MRData.RaceTable.Races,
      total: data.MRData.total,
    };
  } catch (error) {
    throw new Error(`Failed to fetch races for season ${season}: ${error}`);
  }
};

export const getRaceResults = async (
  season: string,
  round: string
): Promise<RaceResultsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${season}/${round}/results.json`);
    const data = await response.json();
    console.log(data);

    if (
      !data.MRData.RaceTable.Races ||
      data.MRData.RaceTable.Races.length === 0
    ) {
      throw new Error(
        `No race results found for season ${season}, round ${round}`
      );
    }

    return data.MRData.RaceTable.Races[0];
  } catch (error) {
    throw new Error(
      `Failed to fetch race results for season ${season}, round ${round}: ${error}`
    );
  }
};
