export class Answer {
  id: number;

  text: string;

  isCorrect: boolean;

  isSelected: boolean = false;

  constructor(id: number, text: string, isCorrect: boolean) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
  }
}
