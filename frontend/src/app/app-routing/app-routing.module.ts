import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRoomComponent } from '../components/add-room/add-room.component';
import { AdminComponent } from '../components/admin/admin.component';
import { DeleteReservationsComponent } from '../components/delete-reservations/delete-reservations.component';
import { DeleteRoomComponent } from '../components/delete-room/delete-room.component';
import { DeleteUserComponent } from '../components/delete-user/delete-user.component';
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
  // { path: "add-room", component: AddRoomComponent },
  { path: "sign-in", component: SignInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "my-account", component: MyAccountComponent },
  { path: "admin", component: AdminComponent },
  { path: "admin/add-room", component: AddRoomComponent },
  { path: "admin/delete-room", component: DeleteRoomComponent },
  { path: "admin/delete-user", component: DeleteUserComponent },
  { path: "admin/delete-reservation", component: DeleteReservationsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
