export type Item = {
  name: string;
  count: number;
};

class ItemQueue {
  #data: Array<Item> = [
    { name: "horse", count: 89 },
    { name: "bird", count: 1100 },
    { name: "dolphin", count: 234 },
    { name: "tiger", count: 908 },
    { name: "elephant", count: 345 },
  ];
  #currentIndex: number = 0;

  constructor() {
    this.randomize();
  }

  randomize() {
    for (let i = 0; i < this.#data.length; i++) {
      let randomIndex = Math.floor(Math.random() * this.#data.length);
      let temp = this.#data[i];
      this.#data[i] = this.#data[randomIndex];
      this.#data[randomIndex] = temp;
    }
  }

  getNext(): Item {
    let val = this.#data[this.#currentIndex];
    this.#currentIndex = (this.#currentIndex + 1) % this.#data.length;

    return val;
  }
}

const itemQueue = new ItemQueue();

export { itemQueue };
