class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

class UI{
    addBookToList(book){
        const list=document.getElementById('book-list');
        // Create tr Element
        const row=document.createElement('tr');
        //console.log(row);
        //Insert Columns
        row.innerHTML= `
            <td> ${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    clearFields(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }

    showAlert(message,className){
        const div=document.createElement('div');
        div.className=`alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);

        // Timeout for 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className==='delete'){
            // console.log(target.parentElement);
            // console.log(target.parentElement.parentElement);
            target.parentElement.parentElement.remove();
        }
    }
}

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books=Store.getBooks();
        books.forEach(function(book){
            const ui=new UI();
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books=Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));

    }

    static removeBook(isbn){
        const books=Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn===isbn){
                //console.log(index);
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }


}

// DOM Load Event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

// Event Listener
document.getElementById('book-form').addEventListener('submit',
function(e){
    const title=document.getElementById('title').value;
    const author=document.getElementById('author').value;
    const isbn=document.getElementById('isbn').value;

    // Instantiate Book
    const book=new Book(title,author,isbn);
    
    // Instantiate UI
    const ui=new UI();
    //console.log(UI);

    // Validate
    if(title==='' || author==='' || isbn===''){
        //Error Alert
        ui.showAlert('Please fill in all fields','error');
    }
    else{
        ui.showAlert('Book Added!','success');
        ui.addBookToList(book);
        Store.addBook(book);
        ui.clearFields();    
    }

    //console.log(book);
    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function(e){
    const ui=new UI();
    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    ui.showAlert('Book removed','success');
    e.preventDefault();
});