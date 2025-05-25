import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ConvertHelper } from '../../../helpers/helpers';

@Component({
  selector: 'img-uploader',
  template: `
    <div
      class="file-uploader-container"
      [style.width]="width()"
      [style.height]="height()"
      (click)="fileInput().nativeElement.click()"
    >
      <img [src]="imgPreview() ?? imgUrl() ?? 'image-placeholder.jpg'" />
      <input
        #file
        hidden
        class="default-input"
        type="file"
        placeholder="cover"
        (change)="updateImgUrl($event)"
      />
    </div>
  `,
  styles: `
  .file-uploader-container{
    border-radius:1.5rem;
    overflow:hidden;
    cursor:pointer;

    img{
        width:100%;
        height:100%;
        object-fit:cover;
    }
  }
  `,
  imports: [CommonModule],
})
export class ImgUploaderComponent {
  public fileInput: Signal<ElementRef<HTMLElement>> = viewChild('file');

  public width: InputSignal<string> = input('200px');
  public height: InputSignal<string> = input('150px');
  public imgUrl: InputSignal<string> = input();

  public onChange: OutputEmitterRef<ChangeEvent> = output<ChangeEvent>();

  public imgPreview: WritableSignal<string> = signal(undefined);

  constructor() {
    effect(() => {});
  }

  public async updateImgUrl(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files[0];
    const base64Value = await ConvertHelper.fileToBase64(file);

    const ChangeEvent: ChangeEvent = {
      instance: input,
      imgFile: file,
    };

    this.imgPreview.set(base64Value);

    this.onChange.emit(ChangeEvent);
  }
}

export interface ChangeEvent {
  instance: HTMLElement;
  readonly imgFile: File;
}
