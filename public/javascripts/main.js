$(document).ready(() => {
    let pathname = window.location.pathname;
    if (pathname === '/') {
        let movieIds = $('#movie-ids').val();
        movieIds = movieIds.split(',');
        // console.log('movieIds are', movieIds);
        // console.log('movieIds typeof', typeof movieIds);
        $.ajax({
            url: 'movies/ratings',
            type: 'POST',
            data: {
                movieIds
            },
            success: (ratings) => {
                // console.log('ratings are', ratings);
                ratings.forEach(element => {
                    $(`#rating-${element.movieId}`).text(`${element.avgRating}/5`);
                    let votesWord = '';
                    if (element.votes > 1) {
                        votesWord = 'votes';
                    } else {
                        votesWord = 'vote';
                    }
                    $(`#votes-${element.movieId}`).text(`Revieved ${element.votes} ${votesWord}`);
                    $(`#rating-${element.movieId}`).toggleClass('bg-warning bg-success text-white');
                    console.log(element);
                });
            }
        });
    }
});