import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { LoaderService } from '../../auth/services/loader.service';
import { RolesService } from '../../services/roles.service';

import { RoleCreateComponent } from './role-create/role-create.component';

import { Role } from '../../shared/models/Role';
import {
  PAGE_SIZE_OPTIONS,
  PAGE_LENGTH,
  ITEMS_PER_PAGE,
  CURRENT_PAGE
} from '../../shared/constants/pagination.contacts';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { FormControl, Validators } from '@angular/forms';


const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = true;
dialogConfig.autoFocus = true;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'actions'];

  public PAGE_SIZE_OPTIONS_DATA: number[] = PAGE_SIZE_OPTIONS;

  public page_length: number = PAGE_LENGTH;

  public items_per_page: number = ITEMS_PER_PAGE;

  public current_page: number = CURRENT_PAGE;


  roles: Role[];
  dataSource = new MatTableDataSource<Role>();
  public filter: FormControl = new FormControl("", Validators.required)


  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private rolesService: RolesService,
    private commonService: CommonService
  ) {
    matIconRegistry.addSvgIcon(
      "filter",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/SVG/filter.svg")
    );
  }

  ngOnInit(): void {
    this.getData(this.current_page, this.page_length);
    this.filter.valueChanges.subscribe((f) => {
      this.getData(this.current_page, this.page_length);
  });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  createRole(): void {
    dialogConfig.width = "60%";
    dialogConfig.data = {
      id: undefined
    };

    this.dialog.open(RoleCreateComponent, dialogConfig);

    // UPDATE CONTACT DETAILS AFTER CREATING THE CONTACT
    this.dialog.afterAllClosed.subscribe(e => {
      this.getData(this.current_page, this.page_length);
    });
  }

  edit(id: number): void {
    dialogConfig.width = "60%";
    dialogConfig.data = {
      id: id,
    }

    this.dialog.open(RoleCreateComponent, dialogConfig);

    // UPDATE CONTACT DETAILS AFTER CREATING THE CONTACT
    this.dialog.afterAllClosed.subscribe(e => {
      this.getData(this.current_page, this.page_length);
    });
  }

  getData(currentPage, perPage): void {
    let params = new HttpParams();
    params = params.set('current_page', currentPage);
    params = params.set('per_page', perPage);
    let filter = this.filter.value;
    params = params.set('filter',filter);

  //  if(this.filter.value != "") {
  //     let filter = this.filter.value;
  //     params = params.set('filter',filter);
  //   }

    this.rolesService.getRoles(params)
      .subscribe((response: any) => {
        this.roles = response.data;
        this.dataSource = new MatTableDataSource<any>(this.roles);
        this.dataSource.paginator = this.paginator;
        this.page_length = response.total;

      })
  }

  pageChanged(event): void {
    this.page_length = event.pageSize;
    this.current_page = event.pageIndex + 1;
    this.getData(this.current_page, this.page_length);
  }

  advancedFilter(){
    this.getData(this.current_page, this.page_length);
  }

  delete(id: number): void {

    dialogConfig.width = "20%";
    dialogConfig.height = "30%";
    dialogConfig.data = {
      title: "Confirm Action",
      message: "Are you sure you want to delete the Role?",
      id: id,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res.status) {
          this.deleteRole(res.id);
        }
      }
    );

  }

  deleteRole(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    this.rolesService.deleteRole(params).subscribe(
      (res) => {
        this.commonService.openAlert(res.message);
        this.getData(this.current_page, this.page_length);
      }
    )
  }

}