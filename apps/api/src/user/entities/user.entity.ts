export class User {
  id: string;
  name: string;
  discriminator?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoggedInAt?: Date;
}
