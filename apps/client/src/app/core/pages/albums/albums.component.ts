import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Action } from '../../../models/Action.model';

import { IAlbumDto } from '@dto-interfaces';
import {
  ActionButton,
  PopupAnimation,
  PopupComponent,
} from '../../components/popup/popup.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { LongPressDirective } from '../../directives/long-press.directive';
@Component({
  selector: 'albums',
  imports: [
    CommonModule,
    RouterLink,
    PopupComponent,
    ToolbarComponent,
    SvgIconComponent,
    LongPressDirective,
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
})
export class AlbumsComponent implements OnInit {
  public albums: IAlbumDto[] = [
    {
      _id: '1',
      name: 'the reception',
      color: '#000000',
      media: [],
      password: 'blabla',
    },
    { _id: '1', name: 'the introduction', color: '#ff00ff', media: [] },
    {
      _id: '1',
      name: 'the coffe break',
      color: '#00ff00',
      media: [],
      password: 'blabla',
    },
    {
      _id: '1',
      name: 'the conclusion and awards',
      color: '#dc9b1b',
      media: [],
    },
  ];
  public Action = Action;
  public action: WritableSignal<Action> = signal(null);
  public actionTitle: WritableSignal<string> = signal('');
  public PopupAnimation = PopupAnimation;
  public actionButtons: WritableSignal<ActionButton[]> = signal([]);

  constructor(protected router: Router) {}

  ngOnInit(): void {}

  public getEventId = (): string => this.router.url.split('/').pop();

  public clearAction = (): void => {
    this.actionButtons.set([]);
    this.action.set(null);
  };

  public addAlbum = (e: MouseEvent): void => {
    e.stopPropagation();
    this.action.set(Action.ADD);
    this.actionTitle.set('Create a new album');
    this.actionButtons.set([
      {
        text: 'cancel',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--SecondaryColor)',
        color: 'var(--PrimaryColor)',
        action: this.clearAction,
      },
      {
        text: 'confirm',
        width: '100px',
        height: '35px',
        backgroundColor: 'var(--PrimaryColor)',
        color: 'var(--SecondaryColor)',
        formId: 'albums-form',
      },
    ]);
  };

  public editAlbum(): void {
    this.action.set(Action.UPDATE);
    this.actionTitle.set('Edit album');
  }
}
