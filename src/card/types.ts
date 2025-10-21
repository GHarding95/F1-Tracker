type Driver = {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  flag: string;
};

type Constructor = {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
};

type DriverStanding = {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
};

type StandingsList = {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
};

type ApiResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: StandingsList[];
    };
  };
};

export type { Driver, Constructor, DriverStanding, StandingsList, ApiResponse };
