import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service/auth-service'; 

export const PermissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const permission = route.data?.['permission'];

  if(permission && auth.hasPermission(permission)){
    return true;
  }

  router.navigate(['/cobro'])

  return false;
};
