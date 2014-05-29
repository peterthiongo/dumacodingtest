$(document).ready(function() {
	// get the navbar height
	var height = $('div.navbar').height()
	var height2 = window.innerHeight - 10
	$(window).scroll(function() {
        aside(window.pageYOffset)
		var height = $('div.navbar').height()
		// if the pageYoffset is greater than the navbar height
		// fade in the header.fadein
		if ($('div.navbar').length > 0) {
			if (window.pageYOffset > height) {
				$('header.fadein').addClass('header-in')
				$('header.about').addClass('fader')
				$('section.pagerizer').css({
					'margin-top' : 100
				})
                $('div.container-fluid, form.top, div.container, div.wrapper.top, div.left-modal').css({
                    marginTop : 60
                })

                $('aside#cv').addClass('fixed')
                $('aside#cv').addClass('span3')
			} else {
				$('header.fadein').removeClass('header-in')
				$('header.fader').removeClass('fader')
                $('section.pagerizer').css({
                    'margin-top' : 0
                })
                $('div.container-fluid, form.top, div.container, div.wrapper.top, div.left-modal').css({
                    marginTop : 0
                })
                $('aside#cv').removeClass('fixed')
                $('aside#cv').removeClass('span3')
			}
		} else {
			if (window.pageYOffset > height2) {
				console.log('yeah')
				// check if the fadein header is visible already
				if ($('header.header-out:not(visible)').length > 0) {
					$('header.header-out:not(visible)').fadeIn()
					console.log('fadein')
				}
			} else {
				if ($('header.header-out:visible').length > 0) {
					$('header.header-out:visible').fadeOut('fast')
					console.log('fadeout')
				}
			}
		}
	})

    $('aside#cv ul li').click(function(){
        var a = $(this).find('a')
        // get id of the anchor
        var id = $(a).attr('href')
        if(id == '#personal'){
            $(window).scrollTo(($(id).offset().top - 60), 500)
        } else {
            $(window).scrollTo($(id).offset().top - 60, 500)
        }
    })

    $('aside#cv ul li a').click(function(e){
        // get id of the anchor
//        var id = $(this).attr('href')
//        if(id == '#personal'){
//            $(window).scrollTo(($(id).offset().top - 60), 500)
//        } else {
//            $(window).scrollTo($(id).offset().top, 500)
//        }
        e.preventDefault()
//        e.stopPropagation()
    })
})

function aside(pageYOffset){
    try{
        if(pageYOffset >= 0 && pageYOffset <= (($('div#personal').offset().top - 115) + $('div#personal').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#personal]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#education').offset().top - 115) && pageYOffset <= (($('div#education').offset().top - 115) + $('div#education').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#education]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#other-training').offset().top - 115) && pageYOffset <= (($('div#other-training').offset().top - 115) + $('div#other-training').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#other-training]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#interests').offset().top - 115) && pageYOffset <= (($('div#interests').offset().top - 115) + $('div#interests').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#interests]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#experience').offset().top - 115) && pageYOffset <= (($('div#experience').offset().top - 115) + $('div#experience').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#experience]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#references').offset().top - 115) && pageYOffset <= (($('div#references').offset().top - 115) + $('div#references').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#references]').parent().addClass('active')
        } else if(pageYOffset >= ($('div#recommendations').offset().top - 115) && pageYOffset <= (($('div#recommendations').offset().top - 115) + $('div#recommendations').height())){
            $('aside#cv ul li.active').removeClass('active')
            $('aside#cv ul li a[href=#recommendations]').parent().addClass('active')
        } else {
            $('aside#cv ul li.active').removeClass('active')
        }
    }catch(e){

    }
}
