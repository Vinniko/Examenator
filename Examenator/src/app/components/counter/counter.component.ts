import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { decrement, increment, reset } from '../../store/counter/counter.actions';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent {
  count$: Observable<number>;

  interval: NodeJS.Timeout | null;

  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.select('count');
    this.interval = null;
  }

  increment() {
    this.interval = setInterval(() => this.store.dispatch(increment()), 34);
  }

  decrement() {
    this.interval = setInterval(() => this.store.dispatch(decrement()), 34);
  }

  reset() {
    this.store.dispatch(reset());
  }

  resetFlag() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
