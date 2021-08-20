import { Component, OnInit, ViewChild } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    form: FormGroup;
    user: User;
    loading = false;
    submitted = false;
    liens = null;
    Nombre=null
    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private alertService: AlertService,private modalService: NgbModal) {

    }
    closeResult = '';

    ngOnInit() {
        this.form = this.formBuilder.group({
            longUrl: ['', Validators.required],
        });
        this.getliste()
    }
    getliste() {
        this.accountService.getAll().subscribe(liens => {
            this.liens = liens
            console.log(this.liens)
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        console.log(this.f.longUrl.value)

        this.loading = true;
        this.accountService.generateUrl(this.f.longUrl.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getliste();
                    this.form.reset();
                    
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }



    posteClick (lien) {
        var obj ={
            URlId:lien._id
        }
        this.accountService.postClick(obj)
        .pipe(first())
        .subscribe({
            next: () => {
               // this.router.navigate(['../hom'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });

    }

    getNombre(lien,content) {
        this.accountService.getNombrVisite(lien._id).subscribe(Nombre => {
            this.Nombre = Nombre
            console.log(this.Nombre)
        });
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
      
    }



    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      }

}