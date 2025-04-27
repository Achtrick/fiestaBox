import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'action-button',
  template: `
    <button
      class="default-button"
      [ngStyle]="ActionButton.getStyles(actionButton)"
      (click)="actionButton.action ? actionButton.action() : null"
      [attr.form]="actionButton.formId"
      [type]="actionButton.formId ? 'submit' : 'button'"
    >
      {{ actionButton.text }}
    </button>
  `,
  styles: `
  button{
    font-size: 12px;
  }`,
  imports: [CommonModule],
})
export class ActionButtonComponent implements OnInit {
  @Input() actionButton: ActionButton;

  protected ActionButton = ActionButton;

  constructor() {}

  ngOnInit(): void {}
}

export class ActionButton {
  text: string = '';
  color?: string = '#ffffff';
  backgroundColor?: string = '#000000';
  width?: string = '';
  height?: string = '';
  disabled?: boolean = false;
  formId?: string;
  action?: (() => void) | (() => Promise<void>) = () => {};

  public static getStyles(button: ActionButton) {
    return {
      color: button.color,
      backgroundColor: button.backgroundColor,
      width: button.width,
      height: button.height,
    };
  }
}
