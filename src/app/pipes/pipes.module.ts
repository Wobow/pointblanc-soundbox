import { NgModule } from '@angular/core';
import { FilterNamePipe } from './filter-name.pipe';
import { LimitPipe } from './limit.pipe';


@NgModule({
  imports: [],
  exports: [
    FilterNamePipe,
    LimitPipe,
  ],
  declarations: [
    FilterNamePipe,
    LimitPipe,
  ],
  providers: [],
})
export class PipesModule { }
