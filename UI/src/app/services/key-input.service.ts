import { Injectable, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeyInputService {
  constructor() { }

  listenForEnterKey(form: ElementRef) {
    return fromEvent<KeyboardEvent>(form.nativeElement, 'keydown').pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter')
    );
  }
}
