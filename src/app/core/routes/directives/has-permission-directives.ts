import { Directive, Injectable, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../service/auth-service/auth-service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})

export class HasPermissionDirectives {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ){}

  @Input()
  set hasPermission(permission: string){
    this.viewContainer.clear();

    if(this.auth.hasPermission(permission)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
  
}
