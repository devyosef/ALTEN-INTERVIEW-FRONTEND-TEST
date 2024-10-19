import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [InputTextModule, InputTextareaModule, ButtonModule, ReactiveFormsModule, MessagesModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  messageLength: number = 0;
  feedback: [{severity: string, summary: string}] = [{ severity: 'success', summary: 'Demande de contact envoyée avec succès' }];
  isSubmitted: boolean = false;

  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      message: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  onMessageInput(): void {
    this.messageLength = this.contactForm.get('message')?.value.length;
  }

  submit(): void {
    console.log(this.contactForm.value)
    this.contactForm.reset();
    this.isSubmitted = true;
    this.messageLength = 0;
    setTimeout(() => { 
      this.isSubmitted = false;
    }, 5000);
  }

  get f() {
    return this.contactForm.controls;
  }

}
