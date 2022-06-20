

# Hotel-Database

REST API dla hotelu, by umożliwić m.in. rezerwacje pokoi oraz usług poprzez np. formularz internetowy. Użytkownik miałby możliwość stworzenia konta za pomocą, którego dokonywałby rezerwacji, przeglądał historie rezerwacji i je oceniał.

Użytkownicy mają przypisane role, które umożliwiają im dostęp do poszczególnych opcji (admin/pracownik/klient).

Użyte technologie: Express, Mongoose. MongoDB, JWT


Skład grupy: Rafał Kamiński, Marcin Kozub, Barbara Gaweł-Kucab  


---

 ### Struktury danych w bazie:
 * user
 
 ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/user-module.png?raw=true)
 
 
 * room
 
  ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/room-module.png?raw=true)
  
  
 * reservation
 
 ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/reservations-module.png?raw=true)
 
 
 * rating
 
  ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/rating-module.png?raw=true)
  
  
 * log
 
 ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/log-module.png?raw=true)
 
 
 * refresh token
 
  ![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/refreshtoken-module.png?raw=true)


---

 ### Autentykacja

* register

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/auth-register.png?raw=true)

* login

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/auth-login.png?raw=true)

* token refresh

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/auth-tokenrefresh.png?raw=true)

* funkcje dla tokena

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/auth-signaccessfun.png?raw=true)

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/auth-setrefreshtokenfun.png?raw=true)

---

 ### Przykładowe endpointy
 
* CREATE Reservation

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-create.png?raw=true)


* READ --- todo

* UPDATE Reservation

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-update.png?raw=true)


* DELETE Reservation

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-delete.png?raw=true)
