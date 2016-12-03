(function($){
	$.fn.breadCrumb = function(options){

		var defaults = {
			// target: '.bread-crumb',
			bird: true,
			feed: true,
			textLimit: 20,
			mark: ' > ',
			textBase: 'title',
			separator: ' |',
			countLimit: 3,
			delay: 10000
		};

		var settings = $.extend(defaults, options),
				storage = sessionStorage.getItem('realBreadCrumb'),
				$currentPageName = $(settings.textBase),
				currentPageUrl = window.location.pathname,
				currentObj = {},
				$body = $('body');

		// make current page link object;
		if($currentPageName){
			currentObj.name = $currentPageName.text();

			if(settings.separator){
				// if separator is exist, text have to cut off after separator;
				currentObj.name = currentObj.name.split(settings.separator)[0];
			}
		} else {
			currentObj.name = 'not named page';
		}

		currentObj.url = currentPageUrl;
		currentObj.url += window.location.search ? currentObj.url + window.location.search : '';
		currentObj.url += window.location.hash ? currentObj.url + window.location.hash : '';

		if(storage){
			// if sessionStorage is exist, parse to JSON;
			storage = JSON.parse(storage);
		} else {
			// if not, initialize to array;
			storage = [];
		}
		// set current page into data;

		if(!storage.length){
			storage.push(currentObj);
		} else if(currentObj.url !== storage[storage.length - 1].url){
			storage.push(currentObj);
		}
		
		// if storage data did over from count limit, old data has to remove;
		if(storage.length > settings.countLimit){
			storage.shift();
		}
		var linkObj = [];

		// make link elements
		$(storage).each(function(i, item){
			var $link = $('<li></li>'),
					letters = [];

			for (var j = 0; j < item.name.length; j++) {
				letters.push('<span class="crumb">'+ item.name[j] +'</span>');
			}
			if(i === storage.length - 1){
				$link.append('<p class="current" />');
				$link.find('p').append(letters);
			} else {
				$link.append('<a href='+ item.url +' />');
				$link.find('a').append(letters);
			}
			linkObj.push($link);
		});

		var $crumble = $('<ul id="crumble"></ul>');
		$crumble.append(linkObj);
		

		// add separate mark  to style sheet;
		var cssText = '<style>'
								+ '#crumble li:after{content:"'+ settings.mark +'"}' 
								+ '#crumble li:nth-child('+ storage.length +'):after{content:""}' 
								+ '</style>';

		$body.prepend(cssText);
		// append to body
		$(this).append($crumble);

		// adding bird object
		var $bird = $('<span class="bird" />');

		var eatCrumb = function(){
			if($('.crumb').size() > 0){
				var randCount = Math.floor(Math.random() * $('.crumb').size()),
						$crumb = $('.crumb').eq(randCount),
						pos = {
							top: - Math.floor(Math.random() * 20),
							left: Math.floor(Math.random() * $(window).width())
						};
					if($crumb.offset().left < pos.left){
						$bird.css({
							transform: 'rotateY(180deg)'
						});
					}
					$bird.css({
						top: pos.top,
						left: pos.left
					});
					$body.prepend($bird);
					$bird.animate({
						top: $crumb.offset().top,
						left: $crumb.offset().left
					}, {
						duration: 1000,
						complete: function(e){
							$crumb.animate({
								opacity: 0
							},1000).removeClass('crumb');
							var $parent = $crumb.closest('li'),
								storageIndex = $('#crumble li').index($parent),
								letterIndex = $parent.find('span').index($crumb),
								text = '';
							
							$parent.find('.crumb').each(function(i, item){
								text += $(item).text();
							});

							if(text === ''){
								storage.splice(storageIndex, 1);
							} else if(storage[storageIndex]) {
								storage[storageIndex].name = text;
							}

							// set link data to session storage;
							sessionStorage.removeItem('realBreadCrumb');
							sessionStorage.setItem('realBreadCrumb', JSON.stringify(storage));

							$bird.addClass('eating');
							var pos = {
								top:  - Math.floor(Math.random() * 20) - 20,
								left: Math.floor(Math.random() * $(window).width())
							};
							if($bird.offset().left < pos.left){
								$bird.css({
									transform: 'rotateY(180deg)'
								});
							}
							$bird.delay(1000).animate({
								top: pos.top,
								left: pos.left
							},{
								complete: function(){
									$bird.removeClass('eating');
								}
							});
						}
					});
					setTimeout( eatCrumb ,6000);
			}
		};
		setTimeout(eatCrumb, settings.delay);

		sessionStorage.removeItem('realBreadCrumb');
		sessionStorage.setItem('realBreadCrumb', JSON.stringify(storage));

		return(this);
	};
})(jQuery);


$(function(){
	$('.bread-crumb').breadCrumb();
});