export class FormHelper {
  public static onInput(model: any, e: Event): void {
    model[(e.target as HTMLInputElement).name] = (
      e.target as HTMLInputElement
    ).value;
  }
}
