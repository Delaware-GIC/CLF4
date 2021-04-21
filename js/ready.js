/* CLF 4 2016 Functions */
/* Developed by the Delaware GIC */

jQuery(function() {
  jQuery('a[class="anchors_link"]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = jQuery(this.hash);
      target = target.length ? target : jQuery('[id=' + this.hash.slice(1) +']');
      if (target.length) {
        jQuery('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});

$(function(){
    /* Store the window width */
    var windowWidth = $(window).width();

    $(window).resize(function() {    // Optional: if you want to detect when the window is resized;
        // Fix for issue in Safari - Check window width has actually changed and it's not just iOS triggering a resize event on scroll
        if ($(window).width() != windowWidth) {
            // Update the window width for next time
            windowWidth = $(window).width();

            processBodies(windowWidth);
        }
    });
    function processBodies(width) {
        if(width > 992) {
            $('#collapseOne').collapse('show');
        }
        else {
            $('#collapseOne').collapse('hide');
        }
    }
    processBodies($(window).width());
});

$(document).ready(function() {

    var $logo = $('.logo_fade');

    var $fade = $('.delaware_fade');

    var $searchico = $('#sb-search');

    var $menutext = $('.menu_text');

    // Fade in the Delaware D on scroll
    $(document).scroll(function() {
      $logo.css({display: $(this).scrollTop()>60 ? "block":"none"});
      $fade.css({display: $(this).scrollTop()>60 ? "block":"none"});
      $searchico.css({display: $(this).scrollTop()>60 ? "block":"none"});
      $menutext.css({display: $(this).scrollTop()>60 ? "none":"block"});
    });

    // Fade in the Delaware Text on scroll at mobile
    $(window).scroll(function(){
      var scroll = $(window).scrollTop();
      $(".logo_fade, .delaware_fade").css("opacity", 1.0 - 60 / $(window).scrollTop());
    });

    // Footer + to - sign
    $('.toggle-footer-btn').click(function() {
        $(this).html($(this).html() );
    $('#footer').slideToggle(400)
        return false;
    });

    // Carets in Side Menu
    $('.toplevel').click(function() {
        $(this).find("i.fa").toggleClass("fa-caret-right fa-caret-down");
    });

    // Reset Font Size
    var originalFontSize = $('body, p, container, ul, li, ol').css('font-size');
    $(".resetFont").click(function(){
    $('body, p, container, ul, li, ol').css('font-size', originalFontSize);
    });

    // Increase Font Size
    $(".increaseFont").click(function(){
        var currentFontSize = $('body, p, container, ul, li, ol').css('font-size');
        var currentFontSizeNum = parseFloat(currentFontSize, 10);
        var newFontSize = currentFontSizeNum*1.2;
    $('body, p, container, ul, li, ol').css('font-size', newFontSize);
        return false;
    });

    // Decrease Font Size
    $(".decreaseFont").click(function(){
        var currentFontSize = $('body, p, container, ul, li, ol').css('font-size');
        var currentFontSizeNum = parseFloat(currentFontSize, 10);
        var newFontSize = currentFontSizeNum*0.8;
    $('body, p, container, ul, li, ol').css('font-size', newFontSize);
        return false;
    });

    // Makes the Agency Nav float at the top of the page
    $('#cssmenuTop').affix({
      offset: {
        top: '60'
      }
    });

    $(".sb-search-main-submit").click(function() {
        var clf4SearchFieldText = document.getElementById("txtKeywordMain").value;
        if(clf4SearchFieldText != '') {
            //window.location.href = "http://search3.delaware.gov/texis/search/?sq=checkbook.delaware.gov&query="+clf4SearchFieldText;
            window.location = "/search.shtml?s#stq="+clf4SearchFieldText;
            return false;
        }
    });

    $(".sb-search-submit").click(function() {
        var clf4SearchFieldText = document.getElementById("agency-search-main").value;
        if(clf4SearchFieldText != '') {
            //window.location.href = "http://search3.delaware.gov/texis/search/?sq=checkbook.delaware.gov&query="+clf4SearchFieldText;
            window.location = "/search.shtml?s#stq="+clf4SearchFieldText;
            return false;
        }
    });

    // set up autocomplete
    jQuery("#txtKeywordMain").swiftype({
    engineKey: searchEngineKey
    });

    // set up autocomplete
    jQuery("#agency-search-main").swiftype({
    engineKey: searchEngineKey
    });

});

// Creates Agency Menu
(function($) {

  $.fn.menumaker = function(options) {

      var cssmenu = $(this), settings = $.extend({
        title: "Menu",
        format: "dropdown",
        sticky: false
      }, options);

      return this.each(function() {

        cssmenu.prepend('<div id="menu-button">' + settings.title + '<div id="nav-icon-hamburger"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>');

        $(this).find("#menu-button").on('click', function(){
          $(this).toggleClass('menu-opened');
          var mainmenu = $(this).next('ul');
          if (mainmenu.hasClass('open')) {
            mainmenu.hide().removeClass('open');
          }
          else {
            mainmenu.show().addClass('open');
            if (settings.format === "dropdown") {
              mainmenu.find('ul').show();
            }
          }
        });

        $(this).find("#nav-icon-hamburger").on('click', function(){
          $(this).toggleClass('menu-opened');
          var mainmenu = $(this).next('ul');
          if (mainmenu.hasClass('open')) {
            mainmenu.hide().removeClass('open');
          }
          else {
            mainmenu.show().addClass('open');
            if (settings.format === "dropdown") {
              mainmenu.find('ul').show();
            }
          }
        });

        $("#menu-button").click(function() {
            var $clicked = $(this);
            $("#agencyitems").each(function(index) {
                if (!$(this).is($clicked))
                {
                    $(this).toggle();
                }
            });
        });

        cssmenu.find('li ul').parent().addClass('has-sub');

        multiTg = function() {
          cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
          cssmenu.find('.submenu-button').on('click', function() {
            $(this).toggleClass('submenu-opened');
            if ($(this).siblings('ul').hasClass('open')) {
              $(this).siblings('ul').removeClass('open').hide();
            }
            else {
              $(this).siblings('ul').addClass('open').show();
            }
          });
        };

        if (settings.format === 'multitoggle') multiTg();
        else cssmenu.addClass('dropdown');

if (settings.sticky === true) cssmenu.css('position', 'fixed');

/**
* Store the window width */
var windowWidth = $(window).width();
        resizeFix = function() {
/**
* Check window width has actually changed and it's not just iOS triggering a resize event on scroll */

if ($(window).width() != windowWidth) {
/**
* Update the window width for next time */

windowWidth = $(window).width();
setTimeout(function(){
 if ($( window ).width() > 874) {
cssmenu.find('ul').show();
 }
 if ($(window).width() <= 874) {
cssmenu.find('ul').hide().removeClass('open');
$('.submenu-button').removeClass('submenu-opened');
$('.submenu-button').addClass('submenu-closed');
 }
}, 500);

}
        };
        resizeFix();
        return $(window).on('resize', resizeFix);
      });
  };

})(jQuery);

// Creates Agency Menu Hamburger Button
(function($){

$(document).ready(function() {
  $("#cssmenu").menumaker({
    title: "&nbsp;",
    format: "multitoggle"
  });

  $("#cssmenu").prepend("<div id='menu-line'></div>");

  var foundActive = false, activeElement, linePosition = 0, menuLine = $("#cssmenu #menu-line"), lineWidth, defaultPosition, defaultWidth;

  $("#cssmenu > ul > li").each(function() {
    if ($(this).hasClass('active')) {
      activeElement = $(this);
      foundActive = true;
    }
  });

  if (foundActive === false) {
    activeElement = $("#cssmenu > ul > li").first();
  }

  defaultWidth = lineWidth = activeElement.width();

  defaultPosition = linePosition = activeElement.position().left;

  menuLine.css("width", lineWidth);
  menuLine.css("left", linePosition);

  $("#cssmenu > ul > li").hover(function() {
    activeElement = $(this);
    lineWidth = activeElement.width();
    linePosition = activeElement.position().left;
    menuLine.css("width", lineWidth);
    menuLine.css("left", linePosition);
  },
  function() {
    menuLine.css("left", defaultPosition);
    menuLine.css("width", defaultWidth);
  });

  });
})(jQuery);

(function($) {
  "use strict";

    $(document).ready( function () {

    var window_height = $(window).height() ;
    var screen_size = $(window).width();
    $('#dms-subheader, #dhcc-subheader, #dltcrp-subheader').css('height', window_height );

    /*-------------------------------------------------*/
    /* =  animate objects
    /*-------------------------------------------------*/

    var $fadeInUp = $('#strategiesText, #mapFull, #surveyPic');
    var $fadeInLeft = $('#iconsLeft, #newsLeft, #aboutLeft');
    var $fadeInRight = $('#iconsRight, #newsRight, #aboutRight');
    var $fadeIn = $('#headerImage, #helpHeader, #newsHeader, #strategiesHeader, #mapHeader');

    // InView - fadeIn

    if ($(window).width() >= 768) {
      $fadeIn.css('opacity', 0);
      $fadeInUp.css('opacity', 0);
      $fadeInLeft.css('opacity', 0);
      $fadeInRight.css('opacity', 0);

      $fadeIn.one('inview', function(event, visible) {
        if (visible) { $(this).addClass('animated fadeIn'); }
      });

      // InView - fadeInDown
      $fadeInUp.one('inview', function(event, visible) {
        if (visible) { $(this).addClass('animated fadeInUp'); }
      });
      // InView - fadeInLeft
      $fadeInLeft.one('inview', function(event, visible) {
        if (visible) { $(this).addClass('animated fadeInLeft'); }
      });
      // InView - fadeInRight
      $fadeInRight.one('inview', function(event, visible) {
        if (visible) { $(this).addClass('animated fadeInRight'); }
      });


    }else {

      $fadeIn.css('opacity', 1);
      $fadeInUp.css('opacity', 1);
      $fadeInLeft.css('opacity', 1);
      $fadeInRight.css('opacity', 1);

    }

    $(window).on('resize', function() {
      var screen_size = $(window).width();

      if (screen_size >= 768) {

        $fadeIn.css('opacity', 0);
        $fadeInUp.css('opacity', 0);
        $fadeInLeft.css('opacity', 0);
        $fadeInRight.css('opacity', 0);

        $fadeIn.one('inview', function(event, visible) {
          if (visible) { $(this).addClass('animated fadeIn'); }
        });

        // InView - fadeInDown
        $fadeInUp.one('inview', function(event, visible) {
          if (visible) { $(this).addClass('animated fadeInUp'); }
        });
        // InView - fadeInLeft
        $fadeInLeft.one('inview', function(event, visible) {
          if (visible) { $(this).addClass('animated fadeInLeft'); }
        });
        // InView - fadeInRight
        $fadeInRight.one('inview', function(event, visible) {
          if (visible) { $(this).addClass('animated fadeInRight'); }
        });

      }else {

        $fadeIn.css('opacity', 1);
        $fadeInUp.css('opacity', 1);
        $fadeInLeft.css('opacity', 1);
        $fadeInRight.css('opacity', 1);

      }
    }).trigger('resize');

  });

})(jQuery);

jQuery(document).ready(function() {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
        jQuery('#agency-search').hide();
    };

});

jQuery(document).ready(function() {
//Hide Fontawesome icons from linked images
    var links = document.querySelectorAll('a[href$=".pdf"]');
    for (var i = 0; i < links.length; i++) {
        if (links[i].children.length == 0) {
        links[i].classList.add('icon');
        }
    }
});

//Readspeaker Fix
window.rsConf = {general: {usePost: true}};
// end Readspeaker fix