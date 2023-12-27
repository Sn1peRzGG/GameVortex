document.addEventListener('DOMContentLoaded', function () {
	fetch('server/games-list.json')
		.then(response => {
			if (!response.ok) {
				console.error('Fetch error games.json:', response.statusText)
				throw new Error('Network error')
			}
			return response.json()
		})
		.then(data => {
			if (!Array.isArray(data.games)) {
				console.error('Incorrect JSON data format in games-list.json!')
				return
			}

			// Сортування за алфавітом
			data.games.sort((a, b) => a.title.localeCompare(b.title))

			var gamesContainer = document.querySelector('.games-list')
			var games = data.games.map(game => createGameElement(game))
			renderGames(gamesContainer, games)

			localStorage.setItem('serverGames', gamesContainer.innerHTML)
		})
		.catch(error => {
			handleFetchError(error)
		})
})

function renderGames(container, games) {
	container.innerHTML = ''
	games.forEach(game => {
		container.appendChild(game)
	})
}

function createGameElement(game) {
	let imgSrc = `img/games/${game.imgSrc}.jpg`
	var gameElement = document.createElement('div')
	gameElement.className = 'game-item'
	gameElement.setAttribute('data-genres', game.genres.join(', '))
	gameElement.setAttribute('data-platforms', game.platforms.join(', '))
	gameElement.setAttribute('data-price', game.isFree ? '0' : game.price)
	gameElement.setAttribute('data-release-date', parseDate(game.releaseDate))

	// Adjusted line to show "Free" if isFree is true
	var priceDisplay = game.isFree ? 'Free' : `${game.price}$`

	gameElement.innerHTML = `
			<h2>${game.title}</h2>
			<a href="${game.buyLink}" target="_blank"><img src="${imgSrc}" alt="${
		game.title
	}" class="gameImg"></a>
			<div class="gameInfo">
					<p><strong>Genres:</strong> ${game.genres.join(', ')}</p>
					<p><strong>Platform:</strong> ${game.platforms.join(', ')}</p>
					<p><strong>Release Date:</strong> ${game.releaseDate}</p>
			</div>
			<hr id="line">
			<p class="bottom"><span><strong>Price:</strong> ${priceDisplay}</span> <a href="${
		game.buyLink
	}" target="_blank"><button class="buyBtn steam"><img src="img/logo_steam.svg" class="platform"></button></p>
	`
	return gameElement
}

function parseDate(dateString) {
	var dateParts = dateString.split('-')
	return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).getTime()
}

function filterGames() {
	var genreFilter = document.getElementById('genreFilter').value
	var platformFilter = document.getElementById('platformFilter').value

	var games = document.querySelectorAll('.game-item')

	games.forEach(game => {
		var genreMatch =
			genreFilter === '' ||
			game.getAttribute('data-genres').includes(genreFilter)
		var platformMatch =
			platformFilter === '' ||
			game.getAttribute('data-platforms').includes(platformFilter)

		if (genreMatch && platformMatch) {
			game.style.display = 'block'
		} else {
			game.style.display = 'none'
		}
	})
}

function sortGames() {
	var sortBy = document.getElementById('sortBy').value
	var gamesContainer = document.querySelector('.games-list')
	var games = Array.from(gamesContainer.querySelectorAll('.game-item'))

	switch (sortBy) {
		case 'priceAsc':
			games.sort(
				(a, b) =>
					parseFloat(a.getAttribute('data-price')) -
					parseFloat(b.getAttribute('data-price'))
			)
			break
		case 'priceDesc':
			games.sort(
				(a, b) =>
					parseFloat(b.getAttribute('data-price')) -
					parseFloat(a.getAttribute('data-price'))
			)
			break
		case 'releaseDateAsc':
			games.sort(
				(a, b) =>
					parseFloat(a.getAttribute('data-release-date')) -
					parseFloat(b.getAttribute('data-release-date'))
			)
			break
		case 'releaseDateDesc':
			games.sort(
				(a, b) =>
					parseFloat(b.getAttribute('data-release-date')) -
					parseFloat(a.getAttribute('data-release-date'))
			)
			break
		default:
			break
	}

	gamesContainer.innerHTML = ''
	games.forEach(game => {
		gamesContainer.appendChild(game)
	})
}
