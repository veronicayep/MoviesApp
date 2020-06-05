$(document).ready(() => {
    let pathname = window.location.pathname;
    if (pathname === '/') {
        let movieIds = getHiddenMovieIds();
        displayRatings(movieIds);

        $('#search').on('input', function() {
            $(this).addClass('list-group-item-dark');
            let find = $(this).val().trim();
            let genre = $('#genre').val();
            if (find !== '') {
                let url = 'https://yts.mx/api/v2/list_movies.json?query_term=' + find;
                if (genre !== null) {
                    url += '&genre=' + genre;
                }
                ajaxSearch(url);
            } else {
                $('.remove').remove();
                $(this).removeClass('list-group-item-dark');
            }
        });

        $('#genre').on('change', function() {
            let genre = $(this).val();
            let find = $('#search').val().trim();
            if (find !== '') {
                $('#search').addClass('list-group-item-dark');
                let url = 'https://yts.mx/api/v2/list_movies.json?query_term=' + find + '&genre=' + genre;
                ajaxSearch(url);
            }
        });

        function ajaxSearch(url) {
            console.log(url);
            $.ajax({
                url,
                type: 'GET',
                success: (movies) => {
                    if (movies.status === 'ok') {
                        $('.remove').remove();
                        if (movies.data.movie_count > 0) {
                            $.each(movies.data.movies, function(key, movie) {
                                $('#found-movies').append(
                                    '<a class="list-group-item list-group-item-action remove" href="/movies/' + 
                                        movie.id + 
                                        '">' + 
                                        movie.title + 
                                        '</a>'
                                );
                            });
                        }
                        // console.log(movies);
                    }
                }
            });
        }
    } else {
        let pathnameParts = pathname.split('/');
        // console.log(pathnameParts);
        if (pathnameParts[1] === 'movies' && !isNaN(pathnameParts[2])){
            let movieId = getHiddenMovieIds();
            displayRatings(movieId);
        }
    }

    function getHiddenMovieIds() {
        let movieIds = $('#movie-ids').val();
        return movieIds = movieIds.split(',');
    }

    function displayRatings(movieIds) {
        // console.log('displayRatings called');
        // console.log('movieIds are', movieIds);

        let host = 'http://' + window.location.hostname;
        if (window.location.port) {
            host += ':' + window.location.port;
        }

        $.ajax({
            url: host + '/movies/ratings',
            type: 'POST',
            data: {
                movieIds
            },
            success: (movies) => {
                // console.log('movies are', movies);
                movies.forEach(movie => {
                    $(`#rating-${movie.movieId}`).text(`${movie.avgRating}/5`);
                    let votesWord = 'votes';
                    if (movie.votes === 1) {
                        votesWord = 'vote';
                    }
                    $(`#votes-${movie.movieId}`).text(`Received ${movie.votes} ${votesWord}`);
                    $(`#rating-${movie.movieId}`).toggleClass('bg-warning bg-success text-white');
                    console.log(movie);
                });
            }
        });
    }
});