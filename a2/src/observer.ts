export interface Observer {
  update(): void;
}

export class Subject {
  private observers: Observer[] = [];

  protected notifyObservers() {
    for (const o of this.observers) {
      o.update();
    }
  }

  addObserver(observer: Observer) {
    observer.update();
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }
}
