import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SocketService } from './socket.service';
import { DynamicTextareaDirective } from 'dynamic-textarea-directive';
import { InMessageComponent } from './events/in-message/in-message.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SignInComponent } from './sign-in/sign-in.component';
import { OutMessageComponent } from './events/out-message/out-message.component';
import { SystemInfoComponent } from './events/system-info/system-info.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    DynamicTextareaDirective,
    InMessageComponent,
    SignInComponent,
    SystemInfoComponent,
    OutMessageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
      SocketService,
      { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
