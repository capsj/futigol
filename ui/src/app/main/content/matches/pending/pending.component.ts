import {Component, OnInit, ViewChild} from "@angular/core";
import {fuseAnimations} from "../../../../core/animations";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {
  MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from "@angular/material";
import {Router} from "@angular/router";
import {Location} from "../../../../core/models/location";
import {PlayerService} from "../../../../core/services/player.service";
import {AuthService} from "../../../../core/services/auth/auth.service";
import {DateModel} from "../../../../core/models/utils/date.model";
import {Time} from "../../../../core/models/utils/time.model";
import {DialogContentComponent} from "../../../../core/components/dialog/dialog-content.component";
import {RequestDialogComponent} from "../../../../core/components/request-dialog/request-dialog.component";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {Challenge} from "../../../../core/models/challenge/challenge.model";

@Component({
  selector   : 'pending-component',
  templateUrl: './pending.component.html',
  styleUrls  : ['./pending.component.scss'],
  animations : fuseAnimations,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class PendingComponent implements OnInit {

  public searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['sender', 'receiver', 'date', 'time', 'location', 'state'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  locations: string[];
  sizes: string[];

  constructor(private fuseConfig: FuseConfigService,
              private fuseNavigationService: FuseNavigationService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private router: Router,
              public dialog: MatDialog,
              private authService: AuthService,
              private playerService: PlayerService) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'top',
        toolbar   : 'above',
        footer    : 'none'
      },
      colorClasses    : {
        navbar: 'mat-fuse-dark-50-bg'
      }
    });
    this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
  }

  ngOnInit(): void {
    this.locations = new Location().options;
    this.sizes = ['5', '7', '11'];

    this.searchForm = this.formBuilder.group({
      name : [''],
      location  : [''],
      size   : ['']
    });
    this.dataSource = new MatTableDataSource([]);
    this.authService.loggedUser.then(user => {
      this.playerService.getPendingRequests(user.id).then(res => {
        this.dataSource.data = res.map(x => {
          return {
            id: x.id,
            sender: x.sender,
            receiver: x.receiver,
            date: new DateModel(x.date.year, x.date.month, x.date.day, 0, 0, 0).toStringDate(),
            time: Time.timeModelFromTime(x.time).toStringTime(),
            location: x.location,
            state: x.state
          }
        })
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  teamInfo(event) {
    this.router.navigate(['team', 'info', this.dataSource.filteredData[event].id]);
  }

  openDialog(event) {
    if(this.dataSource.filteredData[event].state === 'Pendiente') {
      let x = this.dataSource.filteredData[event];
      let date = DateModel.dateFromOtherString(x.date);
      const dialogRef = this.dialog.open(RequestDialogComponent, {
        panelClass: 'dialog',
        data: {
          title: 'Confirmar Partido',
          form: new FormGroup({
            date: new FormControl(date, Validators.required),
            time: new FormControl(x.time, Validators.required),
            location: new FormControl(x.location, Validators.required),
            state: new FormControl(x.state, Validators.required),
          }),
          element: {
            sender: x.sender,
            receiver: x.receiver,
            date: date,
            time: x.time,
            location: x.location,
            state: x.state
          },
          labels: [
            {
              title: 'Equipo desafiante: ',
              text: x.sender.name
            }, {
              title: 'Equipo desafiado: ',
              text: x.receiver.name
            }
          ],
          selects: [
            {
              placeholder: 'Lugar',
              options: new Location().options.map(x => {
                return {
                  id: x,
                  value: x
                }
              }),
              formControlName: 'location'
            }
          ],
          dates: [
            {
              placeholder: 'Fecha',
              formControlName: 'date',
              min: new Date()
            }
          ],
          formInputs: [
            {
              placeholder: 'Hora',
              type: 'time',
              formControlName: 'time',
              hintLabel: ''
            }
          ],
          buttonLabel: 'CONFIRMAR',
          formErrors: {},
          errorMessages: {}
        }
      });
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if (data) {
            let date = undefined;
            if(data.date instanceof Date) date = DateModel.dateModelFromDate(data.date);
            else data.date != null ? date = DateModel.dateModelFromDate(data.date.toDate()) : date = null;
            let xDate = DateModel.dateModelFromDate(DateModel.dateFromOtherString(x.date));
            let equal = DateModel.compareDateModel(date, xDate);
            if(equal === 0 && data.time === x.time && data.location === x.location) {
              this.playerService.updateRequest(new Challenge({
                id: x.id,
                sender: x.sender,
                receiver : x.receiver,
                date : date,
                time : Time.timeModelFromString(data.time),
                location : data.location,
                state : 'Confirmada'
              })).then(res => {
                this.dataSource.data = this.dataSource.data.filter(req => req.id !== x.id);
                this.snackBar.open('El desafio se confirmó con éxito.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }).catch(err => {
                this.snackBar.open('Hubo un error al confirmar el desafo. Por favor, inténtelo nuevamente.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              });
            } else {
              this.playerService.updateRequest(new Challenge({
                id: x.id,
                sender: x.receiver,
                receiver : x.sender,
                date : date,
                time : Time.timeModelFromString(data.time),
                location : data.location,
                state : 'Pendiente'
              })).then(res => {
                this.dataSource.data = this.dataSource.data.map(req => {
                  if(req.id === x.id) {
                    return {
                      id: res.id,
                      sender: res.sender,
                      receiver: res.receiver,
                      date: new DateModel(res.date.year, res.date.month, res.date.day, 0, 0, 0).toStringDate(),
                      time: Time.timeModelFromTime(res.time).toStringTime(),
                      location: res.location,
                      state: 'Enviada'
                    }
                  } else return req
                });
                this.snackBar.open('El desafio se modificó con éxito. Ahora debes esperar a que sea confirmado por el otro equipo.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }).catch(err => {
                this.snackBar.open('Hubo un error al confirmar el desafío. Por favor, inténtelo nuevamente.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              });
            }
          }
        }
      );
    }
  }

}
