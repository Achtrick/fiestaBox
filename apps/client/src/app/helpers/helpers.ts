export class FormHelper {
  public static onInput(model: any, e: Event): void {
    const element = e.target as HTMLInputElement;
    const isDate = element.type === 'date';

    this.setDeepValue(
      model,
      element.name,
      isDate ? new Date(element.value) : element.value
    );
  }

  public static setDeepValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return;

    let target = obj;

    for (const key of keys) {
      if (!(key in target) || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }

    target[lastKey] = value;
  }
}

export class ConvertHelper {
  public static toLocaleDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public static fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject('FileReader result is not a string');
        }
      };

      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }
}

export class DomHelper {
  public static getMaxZIndex(): number {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('body *')
    );
    let maxZ = 0;

    for (const el of elements) {
      const z = window.getComputedStyle(el).zIndex;
      const zIndex = Number(z);

      if (!isNaN(zIndex)) {
        maxZ = Math.max(maxZ, zIndex);
      }
    }

    return maxZ + 1;
  }
}
