import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Action } from '../../../models/Action.model';

import { ActionButton } from '../../components/action-button/action-button.component';
import {
  FloatingWidgetComponent,
  FloatingWidgetItem,
} from '../../components/floating-widget/floating-widget.component';
import {
  PopupAnimation,
  PopupComponent,
} from '../../components/popup/popup.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { LongPressDirective } from '../../directives/long-press.directive';
@Component({
  selector: 'gallery',
  imports: [
    CommonModule,
    PopupComponent,
    ToolbarComponent,
    LongPressDirective,
    FloatingWidgetComponent,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  public media: string[] = [
    'https://cdn-stories.neat.no/1/2024/10/BoardPro_Scenario2_LargeMeeting_v05_Zoom-2024x1138.jpeg',
    'https://cms.change-is.pro/img/assets/facilities/change-is-pro-meeting-room-6115.jpg?w=1024&h=1024',
    'https://www.atlascomputes.com/cdn/shop/products/1684_Meeting-Owl_fb45ee87-2010-4d41-b677-c3de9b8a5f48_2000x.jpg?v=1674050831',
    'https://www.cisco.com/c/dam/en/us/products/collateral/collaboration-endpoints/webex-board/webex-board-pro-ds.docx/_jcr_content/renditions/webex-board-pro-ds_6.jpg',
  ];
  public selectedMedia: WritableSignal<string[]> = signal([]);
  public Action = Action;
  public action: WritableSignal<Action> = signal(null);
  public actionTitle: WritableSignal<string> = signal('');
  public PopupAnimation = PopupAnimation;
  public actionButtons: WritableSignal<ActionButton[]> = signal([]);
  public readonly floatingWidgetItems: FloatingWidgetItem[] = [
    { text: 'delete', action: () => alert('delete') },
    { text: 'download', action: () => alert('download') },
  ];

  constructor() {}

  ngOnInit(): void {}

  public clearAction = (): void => {
    this.actionButtons.set([]);
    this.action.set(null);
  };

  public openUploader(): void {
    alert('open uploader');
  }

  public toggleFileSelection(fileUrl: string): void {
    this.selectedMedia.update((value) =>
      value.includes(fileUrl)
        ? value.filter((media) => media !== fileUrl)
        : [...value, fileUrl]
    );
  }
}
