import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user.model';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AppService {
  apiBaseUrl = 'https://gb8dftbjs4.execute-api.ap-northeast-2.amazonaws.com/dev/';
  onUsersChanged = new BehaviorSubject<User[]>(null);

  constructor(
    private httpClient: HttpClient,
  ) {
    this.getAllUsers().then(users => this.onUsersChanged.next(users));
  }

  getAllUsers(): Promise<User[]> {
    return new Promise<User[]>(resolve => {
      this.httpClient.get<any>(`${this.apiBaseUrl}conference/users/*`)
        .pipe(map(r => r.items))
        .subscribe(users => {
          resolve(users);
        });
    });
  }

  postUser(user: User): Promise<User> {
    return new Promise<User>(resolve => {
      this.httpClient.post<any>(`${this.apiBaseUrl}conference`, user)
        .pipe(map(r => r.event))
        .subscribe(newUser => {
          const users = this.onUsersChanged.getValue();
          this.onUsersChanged.next([...users, newUser]);
          resolve(newUser);
        });
    });
  }
}
