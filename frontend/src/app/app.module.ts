import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { RoomReservationComponent } from './components/room-reservation/room-reservation.component';
import { AdminComponent } from './components/admin/admin.component';
import { DeleteReservationsComponent } from './components/delete-reservations/delete-reservations.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { DeleteRoomComponent } from './components/delete-room/delete-room.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RoomsListComponent,
    RoomDetailsComponent,
    AddRoomComponent,
    HomeComponent,
    NavBarComponent,
    SignInComponent,
    SignUpComponent,
    MyAccountComponent,
    RoomReservationComponent,
    AdminComponent,
    DeleteReservationsComponent,
    DeleteUserComponent,
    DeleteRoomComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    HttpClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
