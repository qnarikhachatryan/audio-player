export interface IAudio {
  id: number;
  url: string;
  songName: string;
  artist: string;
}

export interface ICurrentAudio {
  index: number;
  audio?: IAudio;
}
