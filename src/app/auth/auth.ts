import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    this.afAuth.authState.pipe(
      switchMap((firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          return this.getUserData(firebaseUser.uid).pipe(
            map((userData: any) => {
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: userData.name || firebaseUser.displayName || '',
                role: userData.role || 'user',
                isBanned: userData.isBanned || false,
                aceptaelretoUsername: userData.aceptaelretoUsername || ''
              };
              return user;
            }),
            catchError(() => of(null))
          );
        } else {
          return of(null);
        }
      })
    ).subscribe((user: User | null) => {
      this.currentUserSubject.next(user);
      this.authStatusSubject.next(!!user);
    });
  }

  private getUserData(uid: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${uid}`);
  }

  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        return this.router.navigate(['/challenges']);
      });
  }

  register(name: string, email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(credential => {
        if (credential.user) {
          return credential.user.updateProfile({ displayName: name })
            .then(() => {
              return this.http.post(`${environment.apiUrl}/users`, {
                uid: credential.user?.uid,
                name,
                email,
                role: 'user',
                isBanned: false
              }).toPromise();
            })
            .then(() => {
              return this.router.navigate(['/challenges']);
            });
        }
        return Promise.reject('Error creating user');
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.currentUserSubject.next(null);
        this.authStatusSubject.next(false);
        this.router.navigate(['/login']);
      });
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(data: any): Promise<void> {
    const user = this.currentUserSubject.value;
    if (!user) return Promise.reject('No user logged in');

    return this.http.put(`${environment.apiUrl}/users/${user.uid}`, data)
      .toPromise()
      .then(() => {
        this.currentUserSubject.next({ ...user, ...data });
      });
  }
}