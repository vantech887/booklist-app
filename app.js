//selectors
const bookList = document.querySelector('#book-list');
const form = document.querySelector('#form');
// book class
class Book{
	constructor(title, author, isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn
	}
}

// UI class
class UI{
	static displayBooks(){
		const books = Store.getBookFromStorage();
		books.forEach((book) => {
			UI.addBookToList(book)
		});


	}
	//add books to list
	static addBookToList(book){
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><button class='btnDelete btn btn-danger'>X</button></td>
		`
		bookList.appendChild(row);
	}

	static deleteBook(book){
		if(book.classList.contains('btnDelete')){
			book.parentElement.parentElement.remove()
			UI.Alert('book deleted', 'warning')

		}
	}

	static Alert(message, alertName){
		const div = document.createElement('div');
		div.appendChild(document.createTextNode(message));
		div.className = `alert alert-${alertName}`
		const container = document.querySelector('.container');
		container.insertBefore(div, form);

		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearField(){
		document.querySelector('#title').value = ''; 
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

//storing to local storage
class Store{
	static getBookFromStorage(){
		let books;
		if(localStorage.getItem('books') === null){
			books = []
		} else{
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBookToStorage(book){
		const books = Store.getBookFromStorage();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBookFromStorage(isbn){
		const books = Store.getBookFromStorage();
		books.forEach((book, index) => {
			if(book.isbn === isbn){
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}

}

//eventListeners
document.addEventListener('DOMContentLoaded', UI.displayBooks); 
form.addEventListener('submit', (e) => {
	e.preventDefault();
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	if(title === '' || author === '' || isbn ===''){
		UI.Alert('please fill in all fields', 'danger');
	} else{
		UI.Alert('book added', 'success');
		const book = new Book(title, author, isbn);

		//add book to list
		UI.addBookToList(book);
		//add book to local storage
		Store.addBookToStorage(book);
		//clear field
		UI.clearField();
	}

});

// delete button
bookList.addEventListener('click', (e) => {
	UI.deleteBook(e.target)
	Store.removeBookFromStorage(e.target.parentElement.previousElementSibling.textContent)
});