// Override the default types from libs we imported
// Will add new props/types, it doesn't delete anything

// Add a property user to the request object from express
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
