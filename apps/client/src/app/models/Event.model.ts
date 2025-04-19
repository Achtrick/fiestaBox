export class Event {
  Id: string;
  Name: string;
  Description?: string;
  CoverPhoto?: string;
  StartDate: string;
  Type: EventType;
  Password?: string;
}

export enum EventType {
  Free = 'Free',
  Gold = 'Gold',
  Platinium = 'Platinium',
}
