import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // initializing motivational quotes
  quotes = [
    {
      quote:
        'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      author: 'Winston Churchill',
    },
    {
      quote: 'It does not matter how slowly you go as long as you do not stop.',
      author: 'Confucius',
    },
    {
      quote:
        'The only limit to our realization of tomorrow will be our doubts of today.',
      author: 'Franklin D. Roosevelt',
    },
    {
      quote:
        'The only way to achieve the impossible is to believe it is possible.',
      author: 'Charles Kingsleigh',
    },
    {
      quote:
        'Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.',
      author: 'Roy T. Bennett',
    },
    {
      quote:
        'I am not a product of my circumstances. I am a product of my decisions.',
      author: 'Stephen R. Covey',
    },
    {
      quote:
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      author: 'Roy T. Bennett',
    },
    {
      quote:
        'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt',
    },
    {
      quote: "It's not what you look at that matters, it's what you see.",
      author: 'Henry David Thoreau',
    },
    {
      quote: 'The way to get started is to quit talking and begin doing.',
      author: 'Walt Disney',
    },
    {
      quote:
        "Your time is limited, so don't waste it living someone else's life.",
      author: 'Steve Jobs',
    },
    {
      quote: 'The only impossible journey is the one you never begin.',
      author: 'Tony Robbins',
    },
    { quote: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
    {
      quote: 'Act as if what you do makes a difference. It does.',
      author: 'William James',
    },
    {
      quote:
        'Success is not how high you have climbed, but how you make a positive difference to the world.',
      author: 'Roy T. Bennett',
    },
  ];

  constructor() { }

  // return initialized motivational quotes
  getQuotes() {
    return this.quotes;
  }
}
