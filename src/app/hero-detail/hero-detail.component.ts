import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address, Hero, states } from '../data-model';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnChanges {
  heroForm: FormGroup;
  @Input() hero: Hero;
  nameChangeLog: string[] = [];

  constructor(private fb: FormBuilder, private heroService: HeroService) {
    this.createForm();
    this.logNameChange();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      secretLairs: this.fb.array([]),
      power: '',
      sidekick: '',
    });
  }

  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }

  logNameChange() {
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).sunscribe(/* error handling */)
    rhis.rebuildForm();
  }

  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value
    
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      addresses: secretLairsDeepCopy
    }

    return saveHero;
  }

  revert() { this.rebuildForm(); }
}
