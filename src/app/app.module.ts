import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainAppService } from './features/main/services/main-app-service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [BrowserModule],
  providers: [MainAppService],
  exports: [RouterModule],

  // declarations: [AppComponent],
  // bootstrap: [AppComponent],
})
export class AppModule {}
