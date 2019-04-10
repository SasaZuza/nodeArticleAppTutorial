// Making AJAX request so we can delete article
$(document).ready(() => {
    // Connecting to '.delete-article' class defined in 'article.pug' file on delete btn
    $('.delete-article').on('click', (e) => {
        // Here we target and by clicking delete btn display the id of deleted article
        $target = $(e.target);
        const id = $target.attr('data-id');
        // Here we make our ajax request for deleting article
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: (resonse) => {
                alert('Deleting Article');
                // After deleting article redirecting to home page
                window.location.href='/';
            },
            // If there is error run function bellow that console log error message
            error: (err) => {
                console.log(err);                
            }
        });        
    });
});