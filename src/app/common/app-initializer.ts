import { firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './service/auth.service';

export const appInitializer = (afAuth: AngularFireAuth, authService: AuthService) => {
  return () => firstValueFrom(afAuth.authState).then((v) => { authService.updateUser(v); });
};
