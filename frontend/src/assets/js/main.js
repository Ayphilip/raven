(function ($) {
	"use strict";

/*=============================================
	=    		 Preloader			      =
=============================================*/
function preloader() {
	$('#preloader').delay(0).fadeOut();
};

$(window).on('load', function () {
	preloader();
	wowAnimation();
    aosAnimation();
});



/*===========================================
	=    		Mobile Menu			      =
=============================================*/
//SubMenu Dropdown Toggle
if ($('.tgmenu__wrap li.menu-item-has-children ul').length) {
	$('.tgmenu__wrap .navigation li.menu-item-has-children').append('<div class="dropdown-btn"><span class="plus-line"></span></div>');
}

//Mobile Nav Hide Show
if ($('.tgmobile__menu').length) {

	var mobileMenuContent = $('.tgmenu__wrap .tgmenu__main-menu').html();
	$('.tgmobile__menu .tgmobile__menu-box .tgmobile__menu-outer').append(mobileMenuContent);

	//Dropdown Button
	$('.tgmobile__menu li.menu-item-has-children .dropdown-btn').on('click', function () {
		$(this).toggleClass('open');
		$(this).prev('ul').slideToggle(300);
	});
	//Menu Toggle Btn
	$('.mobile-nav-toggler').on('click', function () {
		$('body').addClass('mobile-menu-visible');
	});

	//Menu Toggle Btn
	$('.tgmobile__menu-backdrop, .tgmobile__menu .close-btn').on('click', function () {
		$('body').removeClass('mobile-menu-visible');
	});
};


/*=============================================
	=           Data Background             =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})
$("[data-bg-color]").each(function () {
    $(this).css("background-color", $(this).attr("data-bg-color"));
});

$("[data-text-color]").each(function () {
    $(this).css("color", $(this).attr("data-text-color"));
});

/*===========================================
	=     Menu sticky & Scroll to top      =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#sticky-header").removeClass("sticky-menu");
		$('.scroll-to-target').removeClass('open');
        $("#header-fixed-height").removeClass("active-height");

	} else {
		$("#sticky-header").addClass("sticky-menu");
		$('.scroll-to-target').addClass('open');
        $("#header-fixed-height").addClass("active-height");
	}
});


/*=============================================
	=    		 Scroll Up  	         =
=============================================*/
if ($('.scroll-to-target').length) {
  $(".scroll-to-target").on('click', function () {
    var target = $(this).attr('data-target');
    // animate
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);

  });
}


/*===========================================
	=            Search Active            =
=============================================*/
function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    $($searchOpen).on("click", function (e) {
        e.preventDefault();
        $($searchBox).addClass($toggleCls);
    });
    $($searchBox).on("click", function (e) {
        e.stopPropagation();
        $($searchBox).removeClass($toggleCls);
    });
    $($searchBox)
        .find("form")
        .on("click", function (e) {
            e.stopPropagation();
            $($searchBox).addClass($toggleCls);
        });
    $($searchCls).on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $($searchBox).removeClass($toggleCls);
    });
}
popupSarchBox(
    ".popup-search-box",
    ".searchBoxToggler",
    ".searchClose",
    "show"
);


/*=============================================
=     Offcanvas Menu      =
=============================================*/
$(".menu-tigger").on("click", function () {
	$(".offCanvas__info, .offCanvas__overly").addClass("active");
	return false;
});
$(".menu-close, .offCanvas__overly").on("click", function () {
	$(".offCanvas__info, .offCanvas__overly").removeClass("active");
});


/*=============================================
	=          Swiper active              =
=============================================*/
$('.tg-swiper__slider').each(function () {
    var thmSwiperSlider = $(this);
    var settings = $(this).data('swiper-options');

    // Store references to the navigation Slider
    var prevArrow = thmSwiperSlider.find('.slider-prev');
    var nextArrow = thmSwiperSlider.find('.slider-next');
    var paginationEl = thmSwiperSlider.find('.slider-pagination');

    var autoplayconditon = settings['autoplay'];

    var sliderDefault = { 
        slidesPerView: 1,
        spaceBetween: settings['spaceBetween'] ? settings['spaceBetween'] : 24,
        loop: settings['loop'] === false ? false : true,
        speed: settings['speed'] ? settings['speed'] : 1000,
        autoplay: autoplayconditon ? autoplayconditon : { delay: 6000, disableOnInteraction: false },
        navigation: {
            nextEl: nextArrow.get(0),
            prevEl: prevArrow.get(0),  
        },
        pagination: {
            el: paginationEl.get(0),
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
            },
        },
        on: {
            init: function () {
                updateFractionPagination(this); // Update fraction on init
            },
            slideChange: function () {
                updateFractionPagination(this); // Update fraction on slide change
            }
        },
    };

    var options = JSON.parse(thmSwiperSlider.attr('data-swiper-options'));
    options = $.extend({}, sliderDefault, options);
    var swiper = new Swiper(thmSwiperSlider.get(0), options); // Assign the swiper variable

    if ($('.slider-area').length > 0) {
        $('.slider-area').closest(".container").parent().addClass("arrow-wrap");
    }
});

// Function to update fraction pagination
function updateFractionPagination(swiper) {
    var current = swiper.realIndex + 1; // realIndex gives the current slide
    var total = swiper.slides.length; // Get total slides without adjusting for looped slides
    var paginationElement = swiper.pagination.el;

    // Update pagination with current/total
    $(paginationElement).find('.fraction-pagination').html(current + ' / ' + total);
}

// Function to add animation classes
function animationProperties() {
    $('[data-ani]').each(function () {
        var animationName = $(this).data('ani');
        $(this).addClass(animationName);
    });

    $('[data-ani-delay]').each(function () {
        var delayTime = $(this).data('ani-delay');
        $(this).css('animation-delay', delayTime);
    });
}
animationProperties();

// Add click event handlers for external slider arrows based on data attributes
$('[data-slider-prev], [data-slider-next]').on('click', function () {
    var sliderSelector = $(this).data('slider-prev') || $(this).data('slider-next');
    var targetSlider = $(sliderSelector);

    if (targetSlider.length) {
        var swiper = targetSlider[0].swiper;

        if (swiper) {
            if ($(this).data('slider-prev')) {
                swiper.slidePrev(); 
            } else {
                swiper.slideNext(); 
            }
        }
    }
});

/*=============================================
	=    		Magnific Popup		      =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
		enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});


/*=============================================
	=    		 Wow Active  	         =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}

/*=============================================
	=           Aos Active       =
=============================================*/
function aosAnimation() {
	AOS.init({
		duration: 1000,
		mirror: true,
		once: true,
		disable: 'mobile',
	});
}

/*=============================================
	=           Gsap       =
=============================================*/
var magnets = document.querySelectorAll('.gsap-magnetic')
var strength = 50

    magnets.forEach( (magnet) => {
    magnet.addEventListener('mousemove', moveMagnet );
    magnet.addEventListener('mouseout', function(event) {
        TweenMax.to( event.currentTarget, 1, {x: 0, y: 0, ease: Power4.easeOut})
    } );
    });

    function moveMagnet(event) {
    var magnetButton = event.currentTarget
    var bounding = magnetButton.getBoundingClientRect()

    //console.log(magnetButton, bounding)

    TweenMax.to( magnetButton, 1, {
        x: ((( event.clientX - bounding.left)/magnetButton.offsetWidth) - 0.5) * strength,
        y: ((( event.clientY - bounding.top)/magnetButton.offsetHeight) - 0.5) * strength,
        ease: Power4.easeOut
    })
}
// GSAP Register
//gsap animation start 
    gsap.registerPlugin(ScrollTrigger, TweenMax, ScrollToPlugin),
    gsap.config({
        nullTargetWarn: !1
    });
  
    gsap.utils.toArray(".flipX").forEach((t,e)=>{
        gsap.set(t, {
            opacity: .7
        });
        let a = gsap.timeline();
        a.set(t, {
            position: "relative"
        }),
        a.to(t, {
            scrollTrigger: {
                trigger: t,
                scrub: .5,
                duration: 1.5,
                start: "top bottom+=100",
                end: "bottom center+=250",
                markers: !1
            },
            scale: 1,
            opacity: 1,
            rotateY: 0
        })
    }
    ),

    gsap.utils.toArray(".gspin").forEach($=>{
        if ($) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: $,
                    start: "top 95%",
                    end: "bottom -95%",
                    scrub: !0,
                    markers: !1
                }
            }).to($, {
                duration: .4,
                rotation: 720,
                ease: "power2.out"
            })
        }
    }
    ),
    gsap.utils.toArray(".gmovingX").forEach($=>{
        if ($) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: $,
                    start: "top 95%",
                    end: "bottom -95%",
                    scrub: true,
                    toggleActions: "restart pause reverse repeat",
                    markers: !1
                }
            }).from($, {
                x: -50,
                duration: .4,
                ease: "power2.out"
            })
        }
    }
    ),

    gsap.utils.toArray(".gtop").forEach($=>{
        if ($) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: $,
                    start: "top 100%",
                    end: "bottom 100%",
                    scrub: true,
                    toggleActions: "restart pause reverse repeat",
                    markers: !1
                }
            }).from($, {
                y: 80,
                duration: .4,
                ease: "power2.out"
            })
        }
    }
    );

/*=============================================
	=           Service Hover Change       =
=============================================*/
	$('.service1-tab-wrap li:first-child').addClass('active');
	$('.service1-tab-content').hide();
	$('.service1-tab-content:first').show();

	// Click function
	$('.service1-tab-wrap li').mouseenter(function(){
	$('.service1-tab-wrap li').removeClass('active');
	// $(this).addClass('active');
	$('.service1-tab-content').hide();

	var activeTab = $(this).find('.service1-tab-item').attr('data-bs-target');
	$(activeTab).fadeIn();
	return false;
});

/*=============================================
	=           Counter Number       =
=============================================*/
$(".counter-number").counterUp({
	delay: 10,
	time: 1000,
});

/*=============================================
	=           Progress Counter       =
=============================================*/
$('.progress-bar').waypoint(function() {
	$('.progress-bar').css({
	animation: "animate-positive 1.8s",
	opacity: "1"
	});
}, { offset: '100%' });

/*=============================================
	=           Lettering JS Circle       =
=============================================*/
function injector(t, splitter, klass, after) {
    var a = t.text().split(splitter), inject = '';
    if (a.length) {
        $(a).each(function(i, item) {
            inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
        });	
        t.empty().append(inject);
    }
}
var methods = {
    init : function() {

        return this.each(function() {
            injector($(this), '', 'char', '');
        });

    },

    words : function() {

        return this.each(function() {
            injector($(this), ' ', 'word', ' ');
        });

    },
    
    lines : function() {

        return this.each(function() {
            var r = "eefec303079ad17405c889e092e105b0";
            // Because it's hard to split a <br/> tag consistently across browsers,
            // (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
            // (of the word "split").  If you're trying to use this plugin on that 
            // md5 hash string, it will fail because you're being ridiculous.
            injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
        });

    }
};
$.fn.lettering = function( method ) {
    // Method calling logic
    if ( method && methods[method] ) {
        return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
    } else if ( method === 'letters' || ! method ) {
        return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
    }
    $.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
    return this;
};
$(".circle-title-anime").lettering();

/*=============================================
	=           Marquee Active       =
=============================================*/
if ($(".marquee_mode").length) {
    $('.marquee_mode').marquee({
        speed: 50,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible:true,
    });
}

if ($(".marquee_mode2").length) {
    $('.marquee_mode2').marquee({
        speed: 15,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        pauseOnHover: true,
        startVisible:true,
    });
}

/*=============================================
	=           Masonary Active       =
=============================================*/
$(".masonary-active").imagesLoaded(function () {
    var $filter = ".masonary-active",
        $filterItem = ".filter-item",
        $filterMenu = ".filter-menu-active";

    if ($($filter).length > 0) {
        var $grid = $($filter).isotope({
            itemSelector: $filterItem,
            filter: "*",
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: 1,
            },
        });

        // filter items on button click
        $($filterMenu).on("click", "button", function () {
            var filterValue = $(this).attr("data-filter");
            $grid.isotope({
                filter: filterValue,
            });
        });

        // Menu Active Class
        $($filterMenu).on("click", "button", function (event) {
            event.preventDefault();
            $(this).addClass("active");
            $(this).siblings(".active").removeClass("active");
        });
    }
});


/*=============================================
	=           Masonary Active       =
=============================================*/
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.07
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1200)
})

// Images parallax
gsap.utils.toArray('.gsap-parallax').forEach(container => {
  const img = container.querySelector('img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true,
      pin: false,
    }
  });

  tl.fromTo(img, {
    yPercent: -10,
    ease: 'none'
  }, {
    yPercent: 10,
    ease: 'none'
  });
});

gsap.to(".video-trigger-thumb",{
    duration: 2, 
    scale: 1, 
    ease: "linear",
    scrollTrigger: {
      trigger: ".video-trigger-thumb",
      markers: false,
      start: "top center",
      end: "top",
      // toggleActions: "play complete pause reverse"
      scrub: 1
    }
})

gsap.to(".video-text1-1",{
    duration: 2, 
    x: 100, 
    ease: "linear",
    scrollTrigger: {
      trigger: ".video-text1-1",
      markers: false,
      start: "top center",
      end: "top",
      // toggleActions: "play complete pause reverse"
      scrub: 1
    }
})

gsap.to(".video-text1-2",{
    duration: 2, 
    x: -100, 
    ease: "linear",
    scrollTrigger: {
      trigger: ".video-text1-2",
      markers: false,
      start: "top center",
      end: "top",
      // toggleActions: "play complete pause reverse"
      scrub: 1
    }
})

// Image reveal js
// let revealContainers = document.querySelectorAll(".reveal");
// revealContainers.forEach((container) => {
//     let image = container.querySelector("img");
//     let tl = gsap.timeline({
//         scrollTrigger: {
//             trigger: container,
//             toggleActions: "play none none none"
//         }
//     });

//     tl.set(container, {
//         autoAlpha: 1
//     });

//     if (container.classList.contains('zoom-out')) {
//         // Zoom-out effect
//         tl.from(image, 1.5, {
//             scale: 1.4,
//             ease: Power2.out
//         });
//     } else if (container.classList.contains('left') || container.classList.contains('right')) {
//         let xPercent = container.classList.contains('left') ? -100 : 100;
//         tl.from(container, 1.5, {
//             xPercent,
//             ease: Power2.out
//         });
//         tl.from(image, 1.5, {
//             xPercent: -xPercent,
//             scale: 1,
//             delay: -1.5,
//             ease: Power2.out
//         });
//     }
// });
/*=============================================
	=           Feature Tab List       =
=============================================*/
if ($('#featureTabList').length) {
    const $list = $('#featureTabList');
    const $items = $list.find('li');

    // Clear any existing classes
    $items.removeClass('list2 list3 list4 list5');

    // Create a mapping of item counts to class names
    const classMap = {
        2: 'list2',
        3: 'list3',
        4: 'list4',
        5: 'list5'
    };

    const itemCount = $items.length;

    // Check if the item count has a corresponding class
    if (classMap[itemCount]) {
        $items.addClass(classMap[itemCount]); // Add the appropriate class
    }
}

/*=============================================
	=           Image reveal on hover       =
=============================================*/
const items = document.querySelectorAll('.process-card')

items && items.forEach((el) => {
  const image = el.querySelector('.process-card-img')
  
  el && el.addEventListener('mouseenter', (e) => {
    gsap.to(image, { autoAlpha: 1 })
  })
  
  el && el.addEventListener('mouseleave', (e) => {
    gsap.to(image, { autoAlpha: 0 })
  })
  
  el && el.addEventListener('mousemove', (e) => {
    gsap.set(image, { x: e.offsetX - 200 })
  })
})

/*=============================================
	=           Woocommerce Rating Toggle       =
=============================================*/
$(".rating-select .stars a").each(function () {
    $(this).on("click", function (e) {
        e.preventDefault();
        $(this).siblings().removeClass("active");
        $(this).parent().parent().addClass("selected");
        $(this).addClass("active");
    });
});

/*=============================================
	=           History line       =
=============================================*/
document.addEventListener('DOMContentLoaded', function () {
    const historyCards = document.querySelectorAll('.history-card');

    function checkScroll() {
        const viewportHeight = window.innerHeight;

        historyCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;

            // Check if the card is in the viewport
            if (cardPosition < viewportHeight && cardPosition > 0) { 
                card.classList.add('active'); // Add active class when card is in view
            } else {
                card.classList.remove('active'); // Remove active class when card is out of view
            }
        });
    }

    // Initial check
    checkScroll();

    // Add scroll event listener
    window.addEventListener('scroll', checkScroll);
});

/*=============================================
	=           Price Slider       =
=============================================*/
if ($('.price_slider').length) {
    $(".price_slider").slider({
        range: true,
        min: 10,
        max: 100,
        values: [10, 75],
        slide: function (event, ui) {
          $(".from").text("$" + ui.values[0]);
          $(".to").text("$" + ui.values[1]);
        }
    });
    $(".from").text("$" + $(".price_slider").slider("values", 0));
    $(".to").text("$" + $(".price_slider").slider("values", 1));
}

/*===========================================
	=    		 Cart Active  	         =
=============================================*/
$(".cart-plus-minus").append('<div class="dec qtybutton"><span>-</span></div><div class="inc qtybutton"><span>+</span></div>');
$(".qtybutton").on("click", function () {
	var $button = $(this);
	var oldValue = $button.parent().find("input").val();
	if ($button.text() == "+") {
		var newVal = parseFloat(oldValue) + 1;
	} else {
		// Don't allow decrementing below zero
		if (oldValue > 0) {
			var newVal = parseFloat(oldValue) - 1;
		} else {
			newVal = 0;
		}
	}
	$button.parent().find("input").val(newVal);
});

})(jQuery);