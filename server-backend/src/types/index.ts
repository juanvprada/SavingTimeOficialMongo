// types/index.ts
export type UUID = string;
export type Timestamp = Date;

export interface BaseModel {
  id: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}