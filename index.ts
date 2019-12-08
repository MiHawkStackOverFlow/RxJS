import { Observable, of, from, concat, fromEvent } from 'rxjs';
import { allBooks, allReaders } from './data';
import { ajax, AjaxResponse } from 'rxjs/ajax';

/* #region  create observables */
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

    return () => console.log("Execution teardown code.");
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

