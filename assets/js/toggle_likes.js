
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.togglerLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type:'POST',
                url: $(self).attr('href')
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted==true)likesCount-=1;
                else likesCount+=1;

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount}`);
            })
            .fail(function(errData){
                console.log(errData);
            });
        });
    }
}