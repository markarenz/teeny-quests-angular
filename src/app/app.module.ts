import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainAppService } from './features/main/services/main-app-service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  providers: [MainAppService],
  exports: [RouterModule],

  // declarations: [AppComponent],
  // bootstrap: [AppComponent],
})
export class AppModule {}
