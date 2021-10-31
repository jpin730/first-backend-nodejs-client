import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {
  showSpinner$!: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.showSpinner$ = this.spinnerService.show$;
  }
}
