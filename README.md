

# Hotel-Database

REST API dla hotelu, by umożliwić m.in. rezerwacje pokoi oraz usług poprzez np. formularz internetowy. Użytkownik miałby możliwość stworzenia konta za pomocą, którego dokonywałby rezerwacji, przeglądał historie rezerwacji i je oceniał.

Użytkownicy mają przypisane role, które umożliwiają im dostęp do poszczególnych opcji (admin/pracownik/klient).

Użyte technologie: Express, Mongoose. MongoDB, JWT


Skład grupy: Rafał Kamiński, Marcin Kozub, Barbara Gaweł-Kucab  


---

 ### Zasady działania:
 * wygląd strony dla niezalogowanego użytkownika. Każdy z pokoi ma swoją ocenę, oceny są dodawane przez użytkowników, którzy zarezerwowali dany pokój. Ocena to liczba całkowita z zakresu 1-5. Na podstawie wszystkich ocen jest obliczana średnia ocena pokoju. Na stronie znajduje się kilka dostępnych rodzajów pokoi, każdy z nich ma ograniczoną liczbę jaka jest dostępna w danym momencie

 ![screen](imgs/unlogged-user-view.png)

  GET - RATING
  ![screen](imgs/rating-get.png)


 * użytkownik może się zalogować/stworzyć konto - [autentykacja](#Autentykacja)

![screen](imgs/signin-view.png)


* po zalogowaniu użytkownik może rezerwować zarezerwować. Rezerwacja musi być stworzona dla wybranej daty w pryszłości oraz ilość rezerwacji na dany pokój w danym terminie nie może przekroczyć maksymalnej liczby dostępnych pokoi. Gdyby jeden z podanych warunków nie był spełniony to rezerwacja się nie powiedzie.

![screen](imgs/room-reservation-view.png)

POST - RESERVATION
![screen](imgs/reservation-post.png)

![screen](imgs/reservation-post2.png)

* każdy użytkownik ma dostęp do historii swoich rezerwacji (posortowaych po dacie rozpoczęcia rezerwacji). Może je oceniać (tylko raz) oraz usuwać

![screen](imgs/myaccount-view.png)

POST - RATING
![screen](imgs/rating-post.png)
![screen](imgs/rating-post2.png)

GET - RESERVATION
![screen](imgs/reservation-get.png)

DELETE - RESERVATION
![screen](imgs/reservation-delete.png)


* administrator posiada dodatkowe opcje
![screen](imgs/admin-view.png)


  *  dodawanie pokoi
  ![screen](imgs/add-room-view.png)
  ![screen](imgs/new-room-created.png)

  POST - ROOM
  ![screen](imgs/room-post.png)

  * usuwanie pokoi 
    ![screen](imgs/room-delete-view.png)

    DELETE - ROOM
    ![screen](imgs/room-delete.png)


  * usuwanie użytkowników
      ![screen](imgs/delete-user-view.png)

      DELETE - USER
      ![screen](imgs/user-delete.png)


  * usuwanie wszystkich dostępnych rezerwacji
      ![screen](imgs/delete-reservation-view.png)



    




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

 ### <p id="autentykacja">Autentykacja</p>

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

 ### Dodatkowe endpointy
 
 <!-- jest wyżej -->
<!-- * CREATE Reservation

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-create.png?raw=true) -->


<!-- * READ --- todo -->

* UPDATE Reservation

 <!-- jest wyżej -->

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-update.png?raw=true)


<!-- * DELETE Reservation

![screen](https://github.com/Cozoob/Hotel-Database/blob/main/imgs/example-delete.png?raw=true) -->
