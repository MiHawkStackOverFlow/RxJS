import { Observable, of, from, concat, fromEvent, interval } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax, AjaxResponse } from 'rxjs/ajax';

/* #region Create Observables */
/** Create observable and subscribe. You can use Observable.create too instead of new Observable  */
let allBooksObservable$ = new Observable(subscriber => {

    if (document.title !== 'Learning RxJS') {
        subscriber.error('Incorrect page title.');
    }

    for (let book of allBooks) {
        subscriber.next(book);
    }

    setTimeout(() => {
        subscriber.complete();
    }, 2000);

    // return () => console.log("Execution teardown code.");
});

allBooksObservable$.subscribe((book: any) => console.log(book.title));

console.log("----------------------------------------------");

/** Creating Observables and Concat operator */

let source1$ = of('hello', 1, true, allBooks[0].title);
let source2$ = from(allBooks);

concat(source1$, source2$).subscribe(value => console.log(value));

console.log("----------------------------------------------");

/** event handling */

let button = document.getElementById('readersButton');

fromEvent(button, 'click').subscribe(event => {
    console.log("my event", event);

    let readersDiv = document.getElementById('readers');

    for (let reader of allReaders) {
        readersDiv.innerHTML += reader.name + '<br>';
    }
});


/** Ajax request */


fromEvent(button, 'click').subscribe(event => {
    ajax('/api/readers').subscribe((ajaxResponse: AjaxResponse) => {
        console.log("ajax response", ajaxResponse);

        let readers = ajaxResponse.response;
        let readersDiv = document.getElementById('readersAsync');

        for (let reader of readers) {
            readersDiv.innerHTML += reader.name + '<br>';
        }
    });
});
/* #endregion */

/* #region Subscribing to Observables with Observers*/

let books$ = from(allBooks);

// let bookObserver = {
//     next: book => console.log(`Title: ${book.title}`),
//     error: err => console.log(`Error: ${err}`),
//     complete: () => console.log(`All done!`)      
// }

// All the next, err and complete are optional
books$.subscribe(
    book => console.log(`Title: ${book.title}`),
    err => console.log(`Error: ${err}`),
    () => console.log(`All done!`)
);


let currentTime$ = new Observable(subscriber => {
   const timeString = new Date().toLocaleTimeString();
   subscriber.next(timeString);
   subscriber.complete();
});

// each observer get its own execution subsricption

currentTime$.subscribe(ct => console.log(`Observer1: ${ct}`));

setTimeout(() => {
    currentTime$.subscribe(ct => console.log(`Observer2: ${ct}`));
}, 1000);

setTimeout(() => {
    currentTime$.subscribe(ct => console.log(`Observer3: ${ct}`));
}, 2000);


// cancelling observable subscriptions

let timesDiv = document.getElementById('times');
let button1 = document.getElementById('timerButton');

let timer$ = interval(1000);

let timerSubscription = timer$.subscribe(
    value => timesDiv.innerHTML += `${ new Date().toLocaleTimeString() } (${value}) <br>`,
    null,
    () => console.log('All done!')
);

let timerConsoleSubscription = timer$.subscribe(
    value => console.log(`${ new Date().toLocaleTimeString() } (${value})`),
    null,
    () => console.log('All done!')
)

// we can add, remove 2 subscriptions and unsubscribe them at once
timerSubscription.add(timerConsoleSubscription); 

fromEvent(button1, 'click').subscribe(event => timerSubscription.unsubscribe());