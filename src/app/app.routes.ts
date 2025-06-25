import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { ChallengeListComponent } from './components/challenges/challenge-list/challenge-list';
import { ChallengeDetailComponent } from './components/challenges/challenge-detail/challenge-detail';
import { ParticipationInstructions } from './components/challenges/participation-instructions/participation-instructions';
import { ScoreSubmission } from './components/challenges/score-submission/score-submission';
import { LeaderboardComponent } from './components/challenges/leaderboard/leaderboard';
import { CodeDisplayComponent } from './components/challenges/code-display/code-display';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

// Importa los componentes del perfil
import { PublicProfileViewComponent } from './components/user/public-profile-view/public-profile-view';
import { ProfileViewComponent } from './components/user/profile/profile-view/profile-view';
import { ProfileEditComponent } from './components/user/profile/profile-edit/profile-edit';
import { PasswordChangeComponent } from './components/user/profile/password-change/password-change';
import { EmailVerificationComponent } from './components/user/profile/email-verification/email-verification';

// Admin Components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/admin/user-management/user-management';
import { ChallengeManagement } from './components/admin/challenge-management/challenge-management';
import { PaymentVerificationComponent } from './components/admin/payment-verification/payment-verification';
import { ResultVerification } from './components/admin/result-verification/result-verification';
import { NotificationComponent } from './components/shared/notification/notification';

//about
import { AboutComponent } from './components/shared/about/about';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas del perfil de usuario
  {
    path: 'profile',
    component: ProfileViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/view/:userId',
    component: PublicProfileViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/change-password',
    component: PasswordChangeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/verify-email',
    component: EmailVerificationComponent,
    canActivate: [AuthGuard]
  },

  // Challenges
  { path: 'challenges', component: ChallengeListComponent },
  { path: 'challenges/:id', component: ChallengeDetailComponent },
  {
    path: 'participate/:challengeId',
    component: ParticipationInstructions,
    canActivate: [AuthGuard]
  },
  {
    path: 'submit-score/:participationId',
    component: ScoreSubmission,
    canActivate: [AuthGuard]
  },
  { path: 'leaderboard/:challengeId', component: LeaderboardComponent },
  { path: 'code/:participationId', component: CodeDisplayComponent },

  // Admin Routes
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users',
    component: UserManagement,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/challenges',
    component: ChallengeManagement,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/payments',
    component: PaymentVerificationComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/results',
    component: ResultVerification,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'notifications',
    component: NotificationComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'about',
    component: AboutComponent
  },

  // Fallback
  { path: '**', redirectTo: '/dashboard' }
];
