import { Injectable } from '@angular/core';

import { DateFrame } from './dateFrame.model';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  categories: string[];
  dateFilter: DateFrame;
}