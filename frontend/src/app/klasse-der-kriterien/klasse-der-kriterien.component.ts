import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-klasse-der-kriterien',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './klasse-der-kriterien.component.html',
  styleUrl: './klasse-der-kriterien.component.css'
})
export class KlasseDerKriterienComponent {

  @Input() isOpen: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal() {
    this.closeModalEvent.emit();
  }

}
