import { SlotDto } from "./slot.dto";

export interface ScheduleDto {
    scheduleId: number;
    skinTherapistId: number;
    date: string; 
    slot: SlotDto; 
    slotId:number;
  }