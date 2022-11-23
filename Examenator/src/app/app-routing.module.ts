import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './components/main/main.component';
import { ExamComponent } from './components/exam/exam.component';
import { CounterComponent } from './components/counter/counter.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'exam/:id', component: ExamComponent },
  { path: 'counter', component: CounterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
