import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AlertService {
  alert$: Subject<{message: string, level: string}>;
  constructor() {
    this.alert$ = new Subject();
  }

  toast(message, level) {
    this.alert$.next({ message, level });
  }
}
