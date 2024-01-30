import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthenticationService } from '../../auth/services/authentication.service';

@Directive({
  selector: '[appPermissions]'
})
export class PermissionsDirective {

  public permissoins:any  = this.authenticationService.getPermissions() || [];
  public userPermissions:any = [];
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService:AuthenticationService,
  ) { }

  @Input()
  set appPermissions(permissions: any[]){
    if (!permissions || !permissions.length) {
      throw new Error('permissions value is empty or missed');
    }
    this.userPermissions = permissions[0];
  }

  ngOnInit() {

     let hasAccess = false;
  
    let permissoins = this.permissoins.filter(p => {
        let userPermission = p.permission.flag_name;
        console.log(`${userPermission} - `,this.userPermissions);
        return this.userPermissions.includes(userPermission);
    });

    if(permissoins.length > 0)
      hasAccess = true; 

    if (hasAccess) {
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
        this.viewContainer.clear();
    }

  }

}
