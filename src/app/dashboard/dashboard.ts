import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChallengeService } from '../services/challenge';
import { ParticipationService } from '../services/participation';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { Participation } from '../models/participation.model';
import { User } from '../models/user.model';
import { catchError, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { of, Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConsoleService } from '../services/console';
import { ConsoleMessage } from '../models/console-message.model';
import { NotificationService } from '../services/notification';
import { DatePipe } from '@angular/common';
import { ProfileService } from '../services/profile';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TruncatePipe, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  providers: [DatePipe]
})
export class Dashboard implements OnInit, OnDestroy {
  activeChallenges: any[] = [];
  upcomingChallenges: any[] = [];
  userData: User | null = null;
  stats = {
    totalChallenges: 0,
    activeParticipations: 0,
    wins: 0,
    earnings: 0,
    totalParticipations: 0,
    totalUsers: 0
  };
  isLoading = true;
  showFullConsole = false;
  consoleInput = '';
  consoleMessages: ConsoleMessage[] = [];
  messagesSubscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  availableCommands = ['help', 'clear', 'stats', 'challenges', 'profile', 'notifications', 'join', 'upcoming', 'leaderboard'];
  filteredCommands: string[] = [];
  isLoggedIn = false;

  constructor(
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    public authService: AuthService,
    private router: Router,
    private consoleService: ConsoleService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private profileService: ProfileService
  ) {
    {
      this.authService.authState$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(user => {
        this.isLoggedIn = !!user;
        this.userData = user;
        if (user) {
          this.updateUserStats(user);
          this.loadUserParticipations(user.uid);
        }
      });
    }
  }

  ngOnInit() {
    this.messagesSubscription = this.consoleService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.consoleMessages = messages;
        this.scrollToBottom();
      });

    const welcomeMessage = this.isLoggedIn
      ? `Bienvenido, ${this.authService.getCurrentUser()?.username}`
      : 'Bienvenido al panel de retos de programación';

    this.consoleService.addMessage(welcomeMessage, 'system');
    this.consoleService.addMessage('Cargando datos del dashboard...', 'info');

    // Cargar datos públicos (incluyendo participaciones totales)
    this.loadPublicData();

    if (this.isLoggedIn) {
      this.loadPrivateData();
    }
  }

  private loadPublicData() {
    // Cargar datos que no requieren autenticación
    this.challengeService.getChallenges('activo').subscribe({
      next: (challenges) => {
        this.activeChallenges = challenges;
        this.stats.totalChallenges = challenges.length;
        this.loadTotalParticipations(challenges, false);
        this.consoleService.addMessage(`${challenges.length} retos activos cargados`, 'success');
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar retos activos: ${err.message}`, 'error');
      }
    });

    this.challengeService.getChallenges('próximo').subscribe({
      next: (challenges) => {
        this.upcomingChallenges = challenges;
        this.stats.totalChallenges += challenges.length;
        this.consoleService.addMessage(`${challenges.length} retos próximos cargados`, 'success');
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar retos próximos: ${err.message}`, 'error');
      }
    });

    // Añade esta llamada para cargar el total de usuarios
    this.authService.getTotalUsers().subscribe({
      next: (totalUsers) => {
        this.stats.totalUsers = totalUsers;
        this.consoleService.addMessage(`${totalUsers} usuarios registrados en la plataforma`, 'success');
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar total de usuarios: ${err.message}`, 'error');
      }
    });
  }

  private loadPrivateData() {
    this.loadUserParticipations(this.userData!.uid);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.messagesSubscription.unsubscribe();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const consoleOutput = document.querySelector('.console-output');
      if (consoleOutput) {
        consoleOutput.scrollTo({
          top: consoleOutput.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  loadDashboardData() {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) return;

    this.consoleService.addMessage('Obteniendo datos de usuario...', 'info');

    this.authService.getCurrentUserObservable().subscribe({
      next: (user) => {
        this.userData = user;
        if (user) {
          this.updateUserStats(user);
          this.consoleService.addMessage('Datos de usuario cargados', 'success');

          // Cargar participaciones del usuario
          this.loadUserParticipations(user.uid);
        }
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar datos de usuario: ${err.message}`, 'error');
      }
    });

    this.challengeService.getChallenges('activo').subscribe({
      next: (challenges) => {
        this.activeChallenges = challenges;
        this.stats.totalChallenges = challenges.length;
        this.updateChallengeParticipantsCount(challenges);
        this.consoleService.addMessage(`${challenges.length} retos activos cargados`, 'success');
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar retos activos: ${err.message}`, 'error');
      }
    });

    this.challengeService.getChallenges('próximo').subscribe({
      next: (challenges) => {
        this.upcomingChallenges = challenges;
        this.stats.totalChallenges += challenges.length;
        this.isLoading = false;
        this.consoleService.addMessage(`${challenges.length} retos próximos cargados`, 'success');
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar retos próximos: ${err.message}`, 'error');
      }
    });
  }

  private loadUserParticipations(userId: string) {
    this.challengeService.getChallenges('activo').pipe(
      switchMap(activeChallenges => {
        return this.participationService.getParticipationsByUser(userId).pipe(
          map(userParticipations => ({ activeChallenges, userParticipations })))
      }),
      switchMap(({ activeChallenges, userParticipations }) => {
        // Cargar el perfil completo del usuario para obtener stats actualizados
        return this.profileService.getProfile(userId).pipe(
          map(userProfile => ({ activeChallenges, userParticipations, userProfile })))
      })
    ).subscribe({
      next: ({ activeChallenges, userParticipations, userProfile }) => {
        const activeParticipations = userParticipations.filter(p =>
          p.challenge?.status === 'activo' &&
          p.paymentStatus === 'confirmed'
        );

        // Actualizar con los datos del perfil completo
        this.stats = {
          ...this.stats,
          activeParticipations: activeParticipations.length,
          wins: userProfile.challengeWins || 0,
          earnings: userProfile.totalEarnings || 0,
          totalParticipations: userProfile.totalParticipations || 0
        };

        this.userData = { ...this.userData, ...userProfile };

        this.consoleService.addMessage(
          `Participaciones del usuario cargadas: ${activeParticipations.length} activas`,
          'success'
        );
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar participaciones: ${err.message}`, 'error');
      }
    });
  }

  private loadTotalParticipations(activeChallenges: any[], requireAuth = false) {
    if (activeChallenges.length === 0) {
      this.stats.totalParticipations = 0;
      return;
    }

    const challengeIds = activeChallenges.map(c => c.id);

    this.participationService.getParticipationsByChallengeIds(challengeIds, requireAuth).subscribe({
      next: (participations) => {
        // Filtrar solo participaciones confirmadas
        const confirmedParticipations = participations.filter(p =>
          p.paymentStatus === 'confirmed'
        );

        this.stats.totalParticipations = confirmedParticipations.length;

        // Actualizar contador por reto
        activeChallenges.forEach(challenge => {
          challenge.participantsCount = confirmedParticipations.filter(
            p => p.challengeId === challenge.id
          ).length;
        });

        this.consoleService.addMessage(
          `Participaciones totales en retos activos: ${this.stats.totalParticipations}`,
          'success'
        );
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar participaciones totales: ${err.message}`, 'error');
      }
    });
  }

  filterCommands(input: string) {
    this.filteredCommands = this.availableCommands.filter(cmd =>
      cmd.startsWith(input.toLowerCase())
    );
  }

  onConsoleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.executeCommand();
      this.filteredCommands = [];
    } else if (event.key === 'Tab' && this.filteredCommands.length > 0) {
      event.preventDefault();
      this.consoleInput = this.filteredCommands[0];
    }
  }

  executeCommand() {
    const command = this.consoleInput.trim();
    if (!command) return;

    this.consoleService.addMessage(`> ${command}`, 'info');

    if (command === 'clear') {
      this.consoleService.clearConsole();
    } else if (command === 'help' || command === 'Help') {
      this.showHelp();
    } else if (command === 'stats' || command === 'Stats') {
      this.showStats();
    } else if (command === 'challenges' || command === 'Challenges') {
      this.showActiveChallenges();
    } else if (command === 'profile' || command === 'Profile') {
      this.showProfileInfo();
    } else if (command === 'notifications' || command === 'Notifications') {
      this.showNotifications();
    } else if (command === 'upcoming' || command === 'Upcoming') {
      this.showUpcomingChallenges();
    } else if (command === 'leaderboard' || command === 'Leaderboard') {
      this.showLeaderboard();
    } else if (command.startsWith('join') || command.startsWith('Join')) {
      const challengeId = command.split(' ')[1];
      this.joinChallengeFromConsole(challengeId);
    } else if (command.startsWith('set-username ')) {
      const newUsername = command.split(' ')[1];
      this.updateUsername(newUsername);
    } else {
      this.consoleService.addMessage(`Comando no reconocido: "${command}"`, 'error');
      this.consoleService.addMessage('Escribe "help" para ver los comandos disponibles', 'info');
    }

    this.consoleInput = '';
  }

  private showHelp() {
    this.consoleService.addMessage('=== Comandos Disponibles ===', 'system');
    this.consoleService.addMessage('help - Muestra esta ayuda', 'info');
    this.consoleService.addMessage('clear - Limpia la consola', 'info');
    this.consoleService.addMessage('stats - Muestra tus estadísticas', 'info');
    this.consoleService.addMessage('challenges - Lista tus retos activos', 'info');
    this.consoleService.addMessage('profile - Muestra tu información de perfil', 'info');
    this.consoleService.addMessage('notifications - Muestra tus notificaciones', 'info');
    this.consoleService.addMessage('upcoming - Muestra los próximos retos', 'info');
    this.consoleService.addMessage('leaderboard - Muestra el ranking de participantes', 'info');
    this.consoleService.addMessage('join [id] - Unirse a un reto por ID', 'info');
    this.consoleService.addMessage('set-username [nombre] - Actualiza tu nombre de usuario', 'info');
  }

  private showStats() {
    this.consoleService.addMessage('=== Tus Estadísticas ===', 'system');
    this.consoleService.addMessage(`Retos disponibles: ${this.stats.totalChallenges}`, 'info');
    this.consoleService.addMessage(`Participaciones activas: ${this.stats.activeParticipations}`, 'info');
    this.consoleService.addMessage(`Victorias: ${this.stats.wins}`, 'success');
    this.consoleService.addMessage(`Ganancias totales: $${this.stats.earnings}`, 'warning');
    this.consoleService.addMessage(`Participaciones totales: ${this.stats.totalParticipations}`, 'info');
  }

  private showActiveChallenges() {
    this.consoleService.addMessage('=== Tus Retos Activos ===', 'system');
    if (this.activeChallenges.length > 0) {
      this.activeChallenges.forEach(challenge => {
        const endDate = this.datePipe.transform(challenge.endDate, 'dd/MM/yyyy') || 'Fecha no disponible';
        this.consoleService.addMessage(
          `${challenge.id}: ${challenge.title} (${challenge.participantsCount || 0} participantes) - Finaliza: ${endDate}`,
          'info'
        );
      });
    } else {
      this.consoleService.addMessage('No tienes retos activos actualmente', 'warning');
    }
  }

  private showUpcomingChallenges() {
    this.consoleService.addMessage('=== Próximos Retos ===', 'system');
    if (this.upcomingChallenges.length > 0) {
      this.upcomingChallenges.forEach(challenge => {
        const startDate = this.datePipe.transform(challenge.startDate, 'dd/MM/yyyy') || 'Fecha no disponible';
        this.consoleService.addMessage(
          `${challenge.id}: ${challenge.title} - Inicia: ${startDate}`,
          'info'
        );
      });
    } else {
      this.consoleService.addMessage('No hay retos próximos actualmente', 'warning');
    }
  }

  private showLeaderboard() {
    this.consoleService.addMessage('=== Ranking de Participantes ===', 'system');
    this.consoleService.addMessage('Funcionalidad de leaderboard no implementada aún', 'warning');
  }

  private showProfileInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.consoleService.addMessage('=== Tu Perfil ===', 'system');
      this.consoleService.addMessage(`Usuario: ${user.username}`, 'info');
      this.consoleService.addMessage(`Email: ${user.email}`, 'info');
      if (user.aceptaelretoUsername) {
        this.consoleService.addMessage(`Usuario AceptaElReto: ${user.aceptaelretoUsername}`, 'info');
      }
      this.consoleService.addMessage(`Rol: ${user.role}`, 'info');
      this.consoleService.addMessage(`Victorias: ${user.challengeWins || 0}`, 'success');
      this.consoleService.addMessage(`Participaciones: ${user.totalParticipations || 0}`, 'info');
    } else {
      this.consoleService.addMessage('No se pudo cargar la información del perfil', 'error');
    }
  }

  private showNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.consoleService.addMessage('=== Tus Notificaciones ===', 'system');
        if (notifications.length > 0) {
          notifications.forEach(notification => {
            const status = notification.isRead ? 'leída' : 'nueva';
            const createdAt = this.datePipe.transform(notification.createdAt, 'dd/MM/yyyy HH:mm') || 'Fecha desconocida';
            this.consoleService.addMessage(
              `${createdAt} [${status}]: ${notification.title} - ${notification.message}`,
              notification.isRead ? 'info' : 'warning'
            );
          });
        } else {
          this.consoleService.addMessage('No tienes notificaciones', 'info');
        }
      },
      error: (err) => {
        this.consoleService.addMessage(`Error al cargar notificaciones: ${err.message}`, 'error');
      }
    });
  }

  private joinChallengeFromConsole(challengeId: string) {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    if (challenge) {
      this.consoleService.addMessage(`Uniéndote al reto: ${challenge.title}`, 'info');
      this.joinChallenge(challengeId);
    } else {
      this.consoleService.addMessage(`No se encontró un reto activo con ID: ${challengeId}`, 'error');
      this.consoleService.addMessage('Usa el comando "challenges" para ver los IDs disponibles', 'info');
    }
  }

  private updateUsername(newUsername: string) {
    if (!newUsername) {
      this.consoleService.addMessage('Debes especificar un nombre de usuario', 'error');
      return;
    }

    this.consoleService.addMessage(`Actualizando nombre de usuario a: ${newUsername}...`, 'info');
    this.authService.updateAceptaelretoUsername(newUsername).subscribe({
      next: () => this.consoleService.addMessage('Nombre de usuario actualizado con éxito', 'success'),
      error: (err) => this.consoleService.addMessage(`Error al actualizar: ${err.message}`, 'error')
    });
  }

  private updateUserStats(user: User) {
    this.stats = {
      ...this.stats,
      wins: user.challengeWins || 0,
      earnings: user.totalEarnings || 0,
    };
  }

  joinChallenge(challengeId: string) {
    this.router.navigate(['/challenges', challengeId]);
  }

  private updateChallengeParticipantsCount(challenges: any[]) {
    challenges.forEach(challenge => {
      this.participationService.getParticipationsByChallenge(challenge.id).pipe(
        catchError(err => {
          console.error('Error loading challenge participations', err);
          return of([]);
        })
      ).subscribe({
        next: (participations) => {
          challenge.participantsCount = participations.filter(p =>
            p.paymentStatus === 'confirmed'
          ).length;
        },
        error: (err) => {
          console.error('Error setting participants count', err);
          challenge.participantsCount = 0;
        }
      });
    });
  }
}
