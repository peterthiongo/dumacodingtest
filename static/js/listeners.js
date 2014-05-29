/**
 * @author bauer
 */
var charge;
var charge1
try{
    $(document).ready(function() {
	
		$.ajaxSetup({
			beforeSend : function(xhr, settings) {
				if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
					// Only send the token to relative URLs i.e. locally.
					xhr.setRequestHeader("X-CSRFToken", $('input[name="csrfmiddlewaretoken"]').val());
				}
			}
		});

	$('.post').on('click', function(e){
	    FB.api('/me/dumainc:add', 'post',
		   function(response){
		       if(!response || response.error){
			   console.log(response.error)
		       } else {
			   console.log(response)
		       }
		   }, {scope : 'publish_stream',
		       friend : 'http://dumaworks.org/?fb:app_id=156923154495676&og:title=Connections'})
	})
		addListenerForToggleNodes()

		// make all the seciton-content nodes to fadeout
		$('div.sections div.section-content').fadeOut()
		// rotate the toggle images to face up
		$('div.sections header h4 .minimize').css({
			transform : 'rotate(180deg)'
		}).addClass('active')
		// add class minimized to the sections div
		$('div.sections').addClass('minimized')
		// add listeners for the mycv page
		$('button.btn.ref').live('click', function(e) {
			// get the total input node and increment the value
			var input = $('tr#references_man input[name*=TOTAL_FORMS]')
			if (input.val()) {
				input.val(parseInt(input.val()) + 1)
			} else {
				input.val(1)
			}
			// clone the input section of the references fields
			var clone = $('tbody#references:first').clone()
			// get the total value of fields
			var val = input.val() - 1
			// change the name and id values
			clone.find('input').each(function() {
				$(this).attr('name', $(this).attr('name').replace(/-\d+-/, '-' + val + '-'))
				$(this).attr('id', $(this).attr('id').replace(/-\d+-/, '-' + val + '-'))
				$(this).val('')
			})
			clone.find('input[type=hidden]:first').removeAttr('value')
			clone.find('label[for=name]').text('Reference #' + (val + 1))
			// append the clone into the DOM
			clone.insertAfter('tbody#references:last')
		})

		$('button.btn.rec').on('click', function(e) {
			// get the total input node and increment the value
			var input = $('tr#recommendations_man input[name*=TOTAL_FORMS]')
			if (input.val()) {
				input.val(parseInt(input.val()) + 1)
			} else {
				input.val(1)
			}
			// clone the input section of the references fields
			var clone = $('tbody#recommendations:first').clone()
			// get the total value of fields
			var val = input.val() - 1
			// change the name and id values
			clone.find('input').each(function() {
				$(this).attr('name', $(this).attr('name').replace(/-\d+-/, '-' + val + '-'))
				$(this).attr('id', $(this).attr('id').replace(/-\d+-/, '-' + val + '-'))
				$(this).val('')
			})
			clone.find('input[type=hidden]:first').removeAttr('value')
			clone.find('label[for=name]').text('Recommendation #' + (val + 1))
			// append the clone into the DOM
			clone.insertAfter('tbody#recommendations:last')
		})

		$('div.sections header .minimize:not(.active)').live('click', function(e) {
			$(this).addClass('active')
			// get the sections node
			var sections = $(this).parent().parent().parent()
			sections.addClass('minimized')
			//sections.find('.section-content').fadeOut()
			sections.find('.section-content').animate({
				'height' : 'hide'
			}, 'bounceout')
			$(this).css({
				'transform' : 'rotate(180deg)'
			})
		})

		$('div.sections header .minimize.active').live('click', function() {
			// get the sections node
			var sections = $(this).parent().parent().parent()
			sections.removeClass('minimized')
			//sections.find('.section-content').fadeIn()
			sections.find('.section-content').animate({
				'max-height' : 'show'
			})
			$(this).css({
				'transform' : 'rotate(360deg)'
			}, 'normal', 'easeOutQuart')

			$(this).removeClass('active')
		})

		charge = new inputChange($('input.suggest:first'), 3, 'html')
		charge1 = new inputChange($('input.suggest:last'), 3, 'html')

		transitioner()
		checkBoxListener()
		// errorlist()
		cvbuttons()
		skillgroups()
		hijax()
		existingSkills();
		updateProfileSelections();
		recommender_button()
    })
} catch( e ){
}

function recommender_button(){
    $('.request').on('click', function(e){
		e.preventDefault()
		self = this
		$(this).find('img').toggleClass('hidden')
		$.ajax({
			url : $(self).attr('href'),
			type : 'get',
			success : function(response){
				res = $.parseJSON(response)
				var parent = $(self).parent()
				setTimeout(function(){
					$(self).find('img').toggleClass('hidden')
					$(self).remove()
					var button = $('<a class="btn btn-warning"  disabled="disabled" style="font-size: .9em;color:white; line-height: 10px;">Recommendation Request Sent</a>')
					button.hide()
					parent.append(button)
					button.fadeIn()
				}, 1000)
			}
		})
    })
}

// adds checked skill via ajax
function addSkill() {
    var pk = $(this).attr("value");
    $.post('/update_user_attr/',
	   {'action': 'add_skill', 'value': pk });    
}

// removes unchecked skill via ajax
function removeSkill() {
    var pk = $(this).attr("value");
    $.post('/update_user_attr/',
	   {'action': 'remove_skill', 'value': pk });
} 

// adds checked workhours
function addWorkHours() {
    var pk = $(this).attr("value");
    $.post('/update_user_attr/',
	   {'action': 'add_workhours', 'value': pk });
}

// removes unchecked workhours
function removeWorkHours() {
    var pk = $(this).attr("value");
    $.post('/update_user_attr/',
	   {'action': 'remove_workhours', 'value': pk});
}

// updates changes to user profile via ajax: skills and type of jobs
function updateProfileSelections () {
    $(".skill_group input[type=checkbox]").each(function () {
	$(this).on("ifChecked", addSkill).on("ifUnchecked", removeSkill);
    });
    $(".hours_available input[type=checkbox]").each(function () {
	$(this).on("ifChecked", addWorkHours).on("ifUnchecked", removeWorkHours);
    });
}

function hijax(){
	$('a.hijax').click(function(e){
		e.preventDefault()
        e.stopPropagation()
        var overlap = $('div.overlap div.container-fluid')
        var modal = $('<div class="left-modal"></div>')
        var loading_div = $('<div class="loading"></div>')
        var loading = $('<img class="loading" src="/static/icons/icon_loading.gif" >')
        loading.appendTo(loading_div)
        loading_div.appendTo(modal)
        var self = this
		// get the overlap div
        if($('div.left-modal').is(':visible')){
            $('div.left-modal')
                .animate({
                    width: 'hide'
                }, {duration: 500, queue : false, complete : function(){
                    $(this).remove()
                }})
            overlap.animate({
                left: 0
            }, {duration: 500, queue : false})
        } else {
            $(modal).insertBefore(overlap)
            modal.css({
                width: 'hide'
            })
            // move it 200px to the right
            $(overlap).animate({
                left: 300
            }, {duration : 500, queue: false})
            $(modal).animate({
                width: 'show'
            }, {duration : 500, queue : false})

            $.ajax({
                type : 'get',
                url : $(self).attr('data-location'),
                data : 'field=' + $(self).attr('data-field'),
                success : function(response){
                    $('div.left-modal div.loading').remove()
                    $(response).appendTo('div.left-modal')
                }
            })
        }

	})
}

function cvbuttons(){
    $('div.section input[type=button].add').unbind('click')
    $('div.section input[type=button].add').click(function(e){
        // remove the removable fields in div.section
        if($(this).hasClass('references')){
            var field = 'references'
            var initial_phone_number = $('input[name=user_identification]').val()
            var total = $('div.section#references input[name*=TOTAL_FORMS]').val()
            var initial = $('div.section#references input[name*=INITIAL_FORMS]').val()
	    $('div.section#references .removable').fadeOut(function(){
                $(this).remove()
            })
            $.ajax({
                type : 'post',
                url : '/addcvfield/',
                data : 'field='+field+'&total='+total+'&initial='+initial+
                    '&actual_phone_number='+initial_phone_number + '&' + $('form').serialize(),
                success : function(response){
                    $(response).insertAfter('div.section#references div.block')
                }
            })
        } else if($(this).hasClass('recommendations')){
            var field = 'recommendations'
            var initial_phone_number = $('input[name=user_identification]').val()
            var total = $('div.section#recommendations input[name*=TOTAL_FORMS]').val()
            var initial = $('div.section#recommendations input[name*=INITIAL_FORMS]').val()
//            alert('initial phone=' + initial_phone_number + '\ntotal=' + total + '\ninitial=' + initial)
            $('div.section#recommendations .removable').fadeOut(function(){
                $(this).remove()
            })
            $.ajax({
                type : 'post',
                url : '/addcvfield/',
                data : 'field='+field+'&total='+total+'&initial='+initial+
                    '&actual_phone_number='+initial_phone_number + '&' + $('form').serialize(),
                success : function(response){
                    $(response).insertAfter('div.section#recommendations div.block')
                }
            })
        } else {

        }
        e.stopPropagation()
        e.preventDefault()
    })
}

function skillgroups(){
    $('div.popin .cap').unbind('click')
    $('div.popin .cap').click(function(e){
        var self = $(this).parent()
        // $(this).parent().toggleClass('selected_skillgroup_icon');
	$(this).parent().find("img").toggle();
        var group = $('div.skill_group.id' + $(self).attr('id'))
        group
        .animate({
            height: 'toggle',
        }, function(){
            $(this).stop(true, true)
        })
        group.toggleClass('skill_group_inline')
    	group
        .css({
        	'vertical-align' : 'top'
        })
	// scroll to the div
	if (group.hasClass("skill_group_inline")) {
	    var section_id = "skills_section_" + $(self).attr('id');
	    var section = document.getElementById(section_id);
	    section.scrollIntoView(true);
	}
        e.stopPropagation()
    });
    $('div.left.popin').hover(
	function (e) {
	    // if (!$(this).hasClass("selected_skillgroup_icon"))
	    $(this).find("img").toggle();
	},
	function (e) {
	    // if (!$(this).hasClass("selected_skillgroup_icon"))
	    $(this).find("img").toggle();
	});
}

// Activates the skillgroup icons and skillgroup section for already existing skills on page load
function existingSkills() {
    $(".skill_select").each(function () {
	var thisClass = $(this).attr("class");
	var skillGroupId = thisClass.split(" ")[1];
	var section = $('div.skill_group.id' + skillGroupId);
	section.addClass('skill_group_inline'); // display enclosing skill div
	$("#" + skillGroupId).addClass("selected_skillgroup_icon");
	$("#" + skillGroupId + " img").each(function (index) {
	    if (index === 0) {  // hide b/w image and show colored image
		$(this).hide(); 
	    } else if (index === 1) {
		$(this).show();
	    }
	});
    });
}

function checkBoxListener(){

	var iCheck = $('.iCheck-helper')

	$('.iCheck-helper').on('click', function(){
		checkBox(this)
	})

	$('div[class*=icheckbox_flat]+span, div[class*=iradio_flat]+label').live('click', function(){
		var helper = $(this).prev().find('.iCheck-helper')
		checkBox2(helper)
	})
}

function checkBox(elem){
	var classe = ($(elem).parent().hasClass('checked')) ? 'checked' : 'unchecked'
	if(classe == 'checked'){
		$(elem).prev().prop( 'checked', true )
	} else {
		$(elem).prev().prop( 'checked', false )
	}
}

function checkBox2(elem){
	var parent = $(elem).parent()
	if($(parent).hasClass('checked')){
		$(parent).removeClass('checked')
		$(elem).prev().prop( 'checked', false )
	} else {
		$(parent).addClass('checked')
		$(elem).prev().prop( 'checked', true )
	}

}

function errorlist(){
    $('ul.errorlist').each(function(){
        var error = $(this)
        var error_height = error.height()
        var arrow = $('<div class="arrow"></div>')
        arrow.css({
            top : (error_height / 2) - 3,
            left: -4,
            height: 17,
            width : 17
        })
        error.prepend(arrow)
        var next = error.next()
        var pos_top = next.position().top
        var next_height = next.height()

        // set the coordinates of the errorlist
        error.css({
            top : pos_top + (next_height / 2)
        })
    })
}

function addListenerForToggleNodes() {

	// This are click listeners for toggle nodes
	$('.drop-down').mouseenter(function(e) {
        if(window.innerWidth > 480){
            var id = $(this).attr('id')
            if ($('.dropdown-menu').is(':visible') && ! $('.dropdown-menu:visible').hasClass(id)) {
                $('.dropdown-menu:visible').fadeOut().remove()
                // return
            } else if ($('.dropdown-menu').is(':visible') && $('.dropdown-menu:visible').hasClass(id)){
                return
            }
            e.preventDefault()
            var left = $(this).offset().left
            var this_left = $(this).offset().left
            var top = $(this).offset().top
            // get the next sibling which should of class .dropdown-menu
            var menu = $(this).next('.dropdown-menu')
            menuclone = $(menu).clone()
            menuclone.addClass( $(this).attr('id') )

            menuclone.click(function(e){
                e.stopPropagation()
            })
            $('.dropdown-menu input').click(function(e){
                e.stopPropagation()
            })

            menuclone.appendTo('body').addClass('floater').css({
                top : top + 25,
                left : left
            })

	    menuclone.find('a.power-off').on('click', function(e){
		FB.logout(function(response){
		    // logged out user
		})
	    })

            var _left = menuclone.offset().left

            if (menuclone.hasClass('move')) {
                var clonewidth = menuclone.width()
                var cloneleft = left
                var docwidth = $(document).width()
                if ((cloneleft + clonewidth) > docwidth) {
                    left = left - ((cloneleft + clonewidth) - docwidth + 50)
                    menuclone.css({
                        left : left
                    })
                }
                menuclone.find('img.pointer').css({
                    left : clonewidth * 0.89
                })
                if (menuclone.hasClass('move2')) {
                    menuclone.find('img.pointer').css({
                        left : clonewidth * 0.54
                    })
                }
            }
            menuclone.fadeIn(function() {
                addFormListener(menuclone)
            }).css({
                display : 'inline-table'
            })
            if(menuclone.hasClass('noti')){
                var ids = []
                $(menuclone).find('input.noti-id')
                    .each(function(){
                        ids.push($(this).val())
                    })
                data = {
                    notifications : ids
                }

                data = JSON.stringify(data)

                $.ajax({
                    type : 'post',
                    url : '/update/notifications/',
                    data : data,
                    success : function(response){
                        data = $.parseJSON(response)
                        if(data.results == 'present'){
                            if (parseInt(data.badge) != 0)
                                $('span.badge.badge-warning').text(data.badge)
                            else
                                $('span.badge.badge-warning').text('')
                        }
                    }
                })
            }
        }
	})

//    $('.drop-down').click(function(){
//        if(window.innerWidth < 481){
//            // get the drop down menu
//            var menu = $(this).next('.dropdown-menu')
//            $('.dropdown-menu:visible').hide()
//            menu.show()
//        }
//    })

	$(window).resize(function(){
		$('.dropdown-menu:visible').fadeOut('fast', function(){
			$(this).remove()
		})
	})

	$(window).scroll(function(){
		$('.dropdown-menu:visible').fadeOut('fast', function(){
			$(this).remove()
		})
	})

	$(document).click(function(e){
		$('.dropdown-menu:visible').fadeOut('fast', function(){
			$(this).remove()
		})
	})
}

function addFormListener(elem){
	// $(elem).find('form.activity').live('submit', function(e) {
	// 	e.preventDefault()
	// 	var self = this
	// 	$.ajax({
	// 		url : '/profile/confirm/',
	// 		type : 'post',
	// 		data : $(self).serialize(),
	// 		success : function(response) {
	// 			console.log(response)
	// 			if (response == 'success') {
	// 				$(self).fadeOut().remove()
	// 				$('.badge').remove()
	// 			}
	// 		}
	// 	})
	// })
}

var inputChange = function(elem, length, type) {
	var self = this
	this.location = $(elem).attr('data-location')
	// contents
	this.elem = elem
	this.parent = elem.parent()
	this.search = ''
	this.search_results = []
	this.length = length
	this.type = type
	this.bind = function() {
		//---register html click that will hide pop-ups
		$(self.elem).focusout(function() {
			self.parent.find('.drop-down-item').fadeOut('fast')
		})
		$(self.elem).on('input', function(e) {
			e.stopPropagation()
			self.eventHelper(this)
		})
		$(self.elem).focusin(function(e) {
			self.parent.find('.drop-down-item').fadeIn('fast')
		})
	}

	this.eventHelper = function(scope) {
		var current_search = $(scope).val()
		//---check if search phrase length is
		//greater than 3 to proceed---
		if (current_search.length >= self.length) {
			//---if there is no previous search
			//hit the database---
			if (self.search.length == 0) {

				$.ajax({
					url : self.location + current_search + '/' + self.type + '/',
					type : 'get',
					success : function(response) {
						if (self.type == 'json') {
                            // pass
						} else {
							//---remove any drop-down-item that maybe existing before
							self.parent.find('.drop-down-item').remove()
							//---set the top and width of the drop-down-item---
							var drop_down_item = $(response)
							drop_down_item.css({
								top : self.elem.height() + 5,
								width : self.elem.width()

							})
							self.parent.append(drop_down_item)
							self.listItemListener($(drop_down_item.find('li')))
						}
					}
				})
				self.search = current_search
			}
			//--- else filter the current search
			//results---
			else {
				//---if the search.length == 3
				//and its different from the previous on
				//hit the database---
				if (current_search.length == self.length && current_search != self.search) {
					$.ajax({
						url : self.location + current_search + '/' + self.type + '/',
						type : 'get',
						success : function(response) {
							if (self.type == 'json') {
								// pass
							} else {
								//---remove any drop-down-item that maybe existing before
								self.parent.find('.drop-down-item').remove()
								//---set the top and width of the drop-down-item---
								var drop_down_item = $(response)
								drop_down_item.css({
									top : self.elem.height() + 5,
									width : self.elem.width()

								})
								self.parent.append(drop_down_item)
								self.listItemListener($(drop_down_item.find('li')))
							}
						}
					})
					self.search = current_search
				}
				//--- else filter the current search results---
				else {
					//---get the current user input--
					var current_search = self.elem.val()
					$(self.parent.find('.drop-down-item li')).each(function() {
						if ($(this).text().toUpperCase().indexOf(current_search.toUpperCase()) == -1) {
							$(this).hide()
						} else {
							$(this).show()
						}
					})
				}
			}
		} else {
			//---remove the drop down---

		}
	}

	this.bind()

	this.listItemListener = function(listItem) {
		$(listItem).on('click', function() {
			//---get the text of the element---
			self.elem.val($(this).text())
			self.parent.find('.drop-down-item').remove()
		})
	}

	this.showResults = function(results) {

	}
}

function transitioner(){
	$('.division .action button#sms').click(function(e){
		if($(this).hasClass('active'))
			return
		$('.division .action button.active').removeClass('active')
		$(this).addClass('active')
		// fade out all sectioning divs
		$('.sectioning').fadeOut('fast', function(){
			$(this).removeClass('active')
			// fade in the sms sectioning
			$('div.sectioning.sms').fadeIn('fast', function(){
				$(this).addClass('active')
				$('body').scrollTo('div.sectioning.sms', 700)
			})
		})
	})

	$('.division .action button#website').click(function(e){
		if($(this).hasClass('active'))
			return
		$('.division .action button.active').removeClass('active')
		$(this).addClass('active')
		// fade out all sectioning divs
		$('.sectioning').fadeOut('fast', function(){
			$(this).removeClass('active')
			// fade in the sms sectioning
			$('div.sectioning.website').fadeIn('fast', function(){
				$(this).addClass('active')
				$('body').scrollTo('div.sectioning.website', 700)
			})
		})
	})

	$('.division .action button#employer').click(function(){
		if($(this).hasClass('active'))
			return
		$('.action button.active.second').removeClass('active')
		$(this).addClass('active')
		var flow = $('.sectioning.active')
		if($(flow).hasClass('sms')){
			// fade out any second category sectioning
			$('.sectioning.second').fadeOut('fast', function(){
				// fade in the .website_employer div
				$('.sms_employer').fadeIn('fast', function(){
					$('body').scrollTo('.sms_employer', 700)
				})
			})
		} else if($(flow).hasClass('website')){
			// fade out any second category sectioning
			$('.sectioning.second').fadeOut('fast', function(){
				// fade in the .website_employer div
				$('.website_employer').fadeIn('fast', function(){
					$('body').scrollTo('.website_employer', 700)
				})
			})
		}
	})

	$('.division .action button#employee').click(function(){
		if($(this).hasClass('active'))
			return
		$('.action button.active.second').removeClass('active')
		$(this).addClass('active')
		var flow = $('.sectioning.active')
		if($(flow).hasClass('sms')){
			// fade out any second category sectioning
			$('.sectioning.second').fadeOut('fast', function(){
				// fade in the .website_employee div
				$('.sms_employee').fadeIn('fast', function(){
					$('body').scrollTo('.sms_employee', 700)
				})
			})
		} else if($(flow).hasClass('website')){
			// fade out any second category sectioning
			$('.sectioning.second').fadeOut('fast', function(){
				// fade in the .website_employee div
				$('.website_employee').fadeIn('fast', function(){
					var tops = $('.website_employee').offset().top
					$('body').scrollTo(tops, 700)
				})
			})
		}
	})

	$('.division .top.second').click(function(){
		//---get the next sibling element---
		var next_sibling = $(this).next()
		var tops = $(next_sibling).offset().top - 100
		//scroll to the element
		$('body').scrollTo(tops, 700)
	})
}
