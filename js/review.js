document.addEventListener('DOMContentLoaded', function () {
	// localStorage.clear()
	var savedReviews = localStorage.getItem('reviews')
	if (savedReviews) {
		var reviewsContainer = document.querySelector('.reviews .review-list')
		reviewsContainer.innerHTML = savedReviews
	} else {
		fetch('server/reviews.json')
			.then(response => {
				if (!response.ok) {
					console.error('Fetch error reviews.json:', response.statusText)
					throw new Error('Network error')
				}
				return response.json()
			})
			.then(data => {
				if (!Array.isArray(data.reviews)) {
					console.error('Incorrect JSON data format in reviews.json!')
					return
				}
				var reviewsContainer = document.querySelector('.reviews .review-list')
				data.reviews.forEach(review => {
					var reviewElement = createReviewElement(review, true)
					reviewsContainer.appendChild(reviewElement)
				})

				// Зберегти відгуки у локальному сховищі
				localStorage.setItem('reviews', reviewsContainer.innerHTML)
			})
			.catch(error => {
				handleFetchError(error)
			})
	}
})

function addReview() {
	var usernameInput = document.getElementById('username').value.trim()
	var commentInput = document.getElementById('comment').value.trim()

	// Перевірка на пусті поля введення
	if (!usernameInput || !commentInput) {
		alert('Please fill in all fields.')
		return
	}

	var username = usernameInput
	var comment = commentInput
	var currentDate = new Date()
	var formattedDateTime = formatDateTime(currentDate)
	var newReview = {
		username: username,
		comment: comment,
		date: formattedDateTime,
	}

	var reviewsContainer = document.querySelector('.reviews .review-list')
	var reviewElement = createReviewElement(newReview, false)
	reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild)

	// Оновлено: Зберегти відгуки у локальному сховищі
	localStorage.setItem('reviews', reviewsContainer.innerHTML)

	// Очистити поля введення
	document.getElementById('username').value = ''
	document.getElementById('comment').value = ''
}

function createReviewElement(review, deletable) {
	var reviewElement = document.createElement('div')
	reviewElement.className = 'review-item'
	reviewElement.innerHTML = `
    <strong>${review.username}:</strong> <span class="comment">${
		review.comment
	}</span>
    <br>
    <small>Sent on ${review.date}</small>
    ${
			deletable
				? '<button class="delete-button" disabled onclick="deleteReview(this.closest(\'.review-item\'))"><ion-icon name="trash-outline"></ion-icon></button>'
				: '<button class="delete-button" onclick="deleteReview(this.closest(\'.review-item\'))"><ion-icon name="trash-outline"></ion-icon></button>'
		}
  `
	return reviewElement
}

function deleteReview(reviewElement) {
	// Підтвердження видалення коментаря
	var confirmDelete = confirm('Confirm deletion of the comment. Are you sure?')
	if (!confirmDelete) {
		return // Відміна видалення при натисканні "Скасувати" у вікні підтвердження
	}

	var reviewsContainer = document.querySelector('.reviews .review-list')
	reviewsContainer.removeChild(reviewElement)

	// Оновлено: Зберегти відгуки у локальному сховищі
	localStorage.setItem('reviews', reviewsContainer.innerHTML)
}

function formatDateTime(date) {
	var year = date.getUTCFullYear()
	var month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
	var day = ('0' + date.getUTCDate()).slice(-2)
	var hours = ('0' + date.getUTCHours()).slice(-2)
	var minutes = ('0' + date.getUTCMinutes()).slice(-2)
	var seconds = ('0' + date.getUTCSeconds()).slice(-2)
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`
}

function handleFetchError(error) {
	if (error instanceof Error) {
		console.error('Network error:', error.message)
		document.querySelector('.reviews').innerHTML = `
      <p>An error occurred while loading reviews. Check your network connection.</p>
    `
	} else {
		console.error('Error fetching reviews.json:', error)
	}
}
