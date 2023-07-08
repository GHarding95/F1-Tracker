export interface DriverStanding {    
    position: string;
    points: string;
    Driver: {
      driverId: string;
      givenName: string;
      familyName: string;
      nationality: string;
    };
    Constructors: {
      constructorId: string;
      url: string;
      name: string;
      nationality: string;
    };
  }
  

  