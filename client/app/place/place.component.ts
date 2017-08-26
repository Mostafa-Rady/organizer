import {Component, OnInit} from '@angular/core';
import {PlaceCrudService} from './place-crud.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html'
})
export class PlaceComponent implements OnInit {
  places: any[];
  isLoading: boolean;
  form: FormGroup;

  constructor(private placeCrudSvc: PlaceCrudService, private fb: FormBuilder) {
    const max = 11;
    const min = 6;
    this.form = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      phone1: ['', [Validators.required, Validators.min(min), Validators.max(max)]],
      phone2: ['', [Validators.min(min), Validators.max(max)]],
      phone3: ['', [Validators.min(min), Validators.max(max)]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getPlaces();
  }

  private getPlaces() {
    this.placeCrudSvc.getPlaces()
      .subscribe(data =>
          this.places = data,
        error => console.log(error),
        () => this.isLoading = false);
  }

  updateManually(place: any) {
    this.form.patchValue({
      _id: null,
      name: '',
      phone1: '',
      phone2: '',
      phone3: '',
      address: ''
    });
    this.form.patchValue(place);
  }

  save() {
    const place = this.form.value;
    const observable = place._id ? this.placeCrudSvc.edit(place) : this.placeCrudSvc.add(place);

    observable
      .subscribe(
        () => this.getPlaces(),
        error => console.log(error),
        () => this.isLoading = false);
  }
}
