$(document).ready(function(){
    var $content, $modal, $apnData, $modalCon;

    $content = $(".min");

    $("#globalChatModal").on('hide.bs.modal', function() {
        minimize($(this).find(".modalMinimize"));
    });
    $(".modalMinimize").on("click", function(){
        minimize($(this));
    });

    $("button[data-dismiss='modal']").click(function(){
        $(this).closest(".minimizeableModal").removeClass("min");
        $(".container").removeClass($apnData);
        $(this).next('.modalMinimize').find("i").removeClass('fa fa-clone').addClass( 'fa fa-minus');
    });

    var minimize = function(context) {
        $modalCon = $(context).closest(".minimizeableModal").attr("id");
        $apnData = $(context).closest(".minimizeableModal");
        $modal = "#" + $modalCon;
        $(".modal-backdrop").addClass("display-none");
        $($modal).toggleClass("min");
        if ( $($modal).hasClass("min") ){
            $('.modal-dialog').draggable('disable')
            $('.modal-dialog').attr('style', '');
            $(".minmaxCon").append($apnData);
            $(this).find("i").toggleClass( 'fa-plus').toggleClass( 'fa-clone');
        }
        else {
            $('.modal-dialog').draggable({
                disabled: false,
                handle: ".modal-header"
            })
            $(".container").append($apnData);
            $(this).find("i").toggleClass( 'fa-clone').toggleClass( 'fa-minus');
        };
    }

});
