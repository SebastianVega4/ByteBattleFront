import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User as FirebaseUser } from '@firebase/auth';

// Actualiza la interfaz User
export interface User {
  uid: string;
  email: string;
  name?: string;
  displayName?: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  aceptaelretoUsername?: string;
}

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
      switchMap((firebaseUser) => {
        if (firebaseUser) {
          return this.getUserData(firebaseUser.uid).pipe(
            map((userData: any) => {
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: userData.name || firebaseUser.displayName || '',
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

  async login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
    await this.router.navigate(['/challenges']);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    if (credential.user) {
      await credential.user.updateProfile({ displayName: name });
      await this.http.post(`${environment.apiUrl}/users`, {
        uid: credential.user.uid,
        name,
        email,
        role: 'user',
        isBanned: false
      }).toPromise();

      await this.router.navigate(['/challenges']);
    } else {
      throw new Error('Error creating user');
    }
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

  get isAuthenticated(): boolean {
    return this.authStatusSubject.value;
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