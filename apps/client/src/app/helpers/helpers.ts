export class FormHelper {
  public static onInput(model: any, e: Event): void {
    const element = e.target as HTMLInputElement;
    model[element.name] = element.value;
  }
}
