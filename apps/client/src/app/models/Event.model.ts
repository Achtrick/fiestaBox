export class Event {
  Id: string;
  Name: string;
  CoverPhoto: string;
  Date: string;
  Type: EventType;
}

export enum EventType {
  Free = 'Free',
  Gold = 'Gold',
  Platinium = 'Platinium',
}
