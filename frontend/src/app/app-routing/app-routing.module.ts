import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRoomComponent } from '../components/add-room/add-room.component';
import { HomeComponent } from '../components/home/home.component';
import { MyAccountComponent } from '../components/my-account/my-account.component';
import { RoomDetailsComponent } from '../components/room-details/room-details.component';
import { RoomsListComponent } from '../components/rooms-list/rooms-list.component';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';

const routes: Routes = [
  { path: "", redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "rooms-list", component: RoomsListComponent },
  { path: "rooms-list/:id", component: RoomDetailsComponent },
  { path: "add-room", component: AddRoomComponent },
  { path: "sign-in", component: SignInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "my-account", component: MyAccountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
