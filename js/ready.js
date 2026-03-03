/* CLF 4 2016 Functions */
/* Developed by the Delaware GIC */

jQuery(function () {
  jQuery('a[class="anchors_link"]').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = jQuery(this.hash);
      target = target.length
        ? target
        : jQuery("[id=" + this.hash.slice(1) + "]");
      if (target.length) {
        jQuery("html, body").animate(
          {
            scrollTop: target.offset().top,
          },
          500
        );
        return false;
      }
    }
  });
});

$(function () {
  /* Store the window width */
  var windowWidth = $(window).width();

  $(window).resize(function () {
    // Optional: if you want to detect when the window is resized;
    // Fix for issue in Safari - Check window width has actually changed and it's not just iOS triggering a resize event on scroll
    if ($(window).width() != windowWidth) {
      // Update the window width for next time
      windowWidth = $(window).width();

      processBodies(windowWidth);
    }
  });
  function processBodies(width) {
    if (width > 992) {
      $("#collapseOne").collapse("show");
    } else {
      $("#collapseOne").collapse("hide");
    }
  }
  processBodies($(window).width());
});

$(document).ready(function () {

  // Footer + to - sign
  $(".toggle-footer-btn").click(function () {
    $(this).html($(this).html());
    $("#footer").slideToggle(400);
    return false;
  });

  // Carets in Side Menu
  $(".toplevel").click(function () {
    $(this).find("i.fa").toggleClass("fa-caret-right fa-caret-down");
  });

  // Reset Font Size
  var originalFontSize = $("body, p, container, ul, li, ol").css("font-size");
  $(".resetFont").click(function () {
    $("body, p, container, ul, li, ol").css("font-size", originalFontSize);
  });

  // Increase Font Size
  $(".increaseFont").click(function () {
    var currentFontSize = $("body, p, container, ul, li, ol").css("font-size");
    var currentFontSizeNum = parseFloat(currentFontSize, 10);
    var newFontSize = currentFontSizeNum * 1.2;
    $("body, p, container, ul, li, ol").css("font-size", newFontSize);
    return false;
  });

  // Decrease Font Size
  $(".decreaseFont").click(function () {
    var currentFontSize = $("body, p, container, ul, li, ol").css("font-size");
    var currentFontSizeNum = parseFloat(currentFontSize, 10);
    var newFontSize = currentFontSizeNum * 0.8;
    $("body, p, container, ul, li, ol").css("font-size", newFontSize);
    return false;
  });

  // Makes the Agency Nav float at the top of the page
  $("#cssmenuTop").affix({
    offset: {
      top: "60",
    },
  });

/* SEARCH FUNCTIONS */
  jQuery(".sb-search-main-submit").click(function () {
    var delawareGlobalSearchText =
      document.getElementById("txtKeywordMain").value;
    if (delawareGlobalSearchText == "") {
      // Do Nothing
    } else {
      window.location = "/?query=" + delawareGlobalSearchText;
    }
    return false;
  });
/* END SEARCH */

// Agency Menu: WCAG 2.1 AA Accessible Menu
(function (jQuery) {
  jQuery.fn.menumaker = function (options) {
    var cssmenu = jQuery(this),
      settings = jQuery.extend(
        {
          title: "Menu",
          format: "dropdown",
          sticky: false,
        },
        options
      );

    return this.each(function () {
      cssmenu.prepend(
        '<button id="menu-button" type="button" aria-label="Menu" aria-expanded="false">' +
          '<span class="sr-only">Primary Menu</span>' +
          settings.title +
          '<div id="nav-icon-hamburger" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div></button>'
      );

      jQuery(this)
        .find("#menu-button")
        .on("click", function () {
          var mainmenu = jQuery(this).next("ul");
          var willOpen = !mainmenu.hasClass("open");

          jQuery(this).toggleClass("menu-opened");
          jQuery(this).attr("aria-expanded", willOpen ? "true" : "false");
          jQuery(this).find("#nav-icon-hamburger").toggleClass("menu-opened", willOpen);

          if (!willOpen) {
            mainmenu.hide().removeClass("open");
          } else {
            mainmenu.show().addClass("open");
            if (settings.format === "dropdown") {
              mainmenu.find("ul").show();
            }
          }
        });

      jQuery("#menu-button").click(function () {
        var jQueryclicked = jQuery(this);
        jQuery("#agencyitems").each(function (index) {
          if (!jQuery(this).is(jQueryclicked)) {
            jQuery(this).toggle();
          }
        });
      });

      cssmenu.find("li ul").parent().addClass("has-sub");

      multiTg = function () {
        if (jQuery(window).width() <= 874) {
          var subMenuItem = cssmenu.find(".has-sub");
          jQuery(subMenuItem).each(function () {
            var dropdownToggleLink = jQuery(this).find(".dropdown-toggle");
            // Mobile: decorative +/- button (not focusable)
            jQuery(this).prepend(
              '<button class="submenu-button" type="button" aria-expanded="false" tabindex="-1" aria-hidden="true"></button>'
            );
            dropdownToggleLink.attr("aria-expanded", "false");
            // On mobile: change link to button role and prevent navigation
            dropdownToggleLink.attr("role", "button");
            dropdownToggleLink.attr("href", "javascript:void(0)");
            dropdownToggleLink.attr("tabindex", "0");
          });
        } else {
          // Desktop: decorative span (not focusable - hover/focus on parent link opens submenu)
          cssmenu.find(".has-sub").prepend('<span class="submenu-button" role="presentation" aria-hidden="true"></span>');
          // Desktop: set up parent links as menu buttons (not navigation links)
          var desktopSubMenuItem = cssmenu.find(".has-sub");
          jQuery(desktopSubMenuItem).each(function () {
            var dropdownToggleLink = jQuery(this).find(".dropdown-toggle");
            // Set role="button" so screen readers announce it as a button, not a link
            dropdownToggleLink.attr("role", "button");
            // Set initial aria-expanded state
            dropdownToggleLink.attr("aria-expanded", "false");
            // Change href="#" to javascript:void(0) to prevent navigation confusion
            if (dropdownToggleLink.attr("href") === "#") {
              dropdownToggleLink.attr("href", "javascript:void(0)");
            }
          });
        }

        // Click handler for decorative +/- button (mobile and desktop)
        cssmenu.find(".submenu-button").on("click", function (e) {
          e.stopPropagation();
          toggleSubmenu(jQuery(this));
        });

        // Keyboard handler only for mobile (desktop buttons are not focusable)
        cssmenu.find(".submenu-button").on("keydown", function (e) {
          // Only handle if somehow focusable (shouldn't happen, but safety check)
          if (jQuery(this).attr("tabindex") !== "-1") {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleSubmenu(jQuery(this));
            }
          }
        });

        // Prevent mobile +/- button from receiving focus
        cssmenu.find(".submenu-button").on("focus", function (e) {
          if (jQuery(window).width() <= 874 && jQuery(this).attr("tabindex") === "-1") {
            // If mobile and button is not supposed to be focusable, blur it
            jQuery(this).blur();
            // Move focus to the parent link instead
            var link = jQuery(this).siblings(".dropdown-toggle");
            if (link.length) link.focus();
          }
        });

        cssmenu.on("click", ".dropdown-toggle", function (e) {
          // Prevent default navigation for parent menu items (href="#" or javascript:void(0))
          e.preventDefault();
          e.stopPropagation();
          
          if (jQuery(window).width() > 874) {
            // Desktop: if submenu already open, move focus to first item; otherwise open it
            var sub = jQuery(this).siblings("ul");
            var wasOpen = sub.hasClass("open");
            if (wasOpen) {
              // Submenu already open: move focus to first submenu item (don't close)
              var firstLink = sub.find("a").first();
              if (firstLink.length) {
                firstLink.focus();
              }
            } else {
              // Submenu closed: open it
              sub.addClass("open").show();
              jQuery(this).attr("aria-expanded", "true");
              // Focus first submenu item after opening
              setTimeout(function() {
                sub.find("a").first().focus();
              }, 0);
            }
          } else {
            // Mobile: toggle via submenu button
            var btn = jQuery(this).closest(".has-sub").find(".submenu-button").first();
            if (btn.length) toggleSubmenu(btn);
          }
        });

        cssmenu.on("keydown", ".dropdown-toggle", function (e) {
          if (jQuery(window).width() > 874) {
            // Desktop: Enter/Space - if submenu open, move to first item; otherwise open it
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              var sub = jQuery(this).siblings("ul");
              var wasOpen = sub.hasClass("open");
              if (wasOpen) {
                // Submenu already open: move focus to first submenu item (don't close)
                var firstLink = sub.find("a").first();
                if (firstLink.length) {
                  firstLink.focus();
                }
              } else {
                // Submenu closed: open it
                sub.addClass("open").show();
                jQuery(this).attr("aria-expanded", "true");
                // Focus first submenu item after opening
                setTimeout(function() {
                  sub.find("a").first().focus();
                }, 0);
              }
            } else if (e.key === "Tab" && !e.shiftKey) {
              // Tab forward: if submenu is open, go to first submenu item
              var sub = jQuery(this).siblings("ul");
              if (sub.hasClass("open") && sub.is(":visible")) {
                e.preventDefault();
                sub.find("a").first().focus();
              }
            }
            return;
          }
          // Mobile: Only activate on Enter or Space; allow Tab to proceed normally
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            var btn = jQuery(this).closest(".has-sub").find(".submenu-button").first();
            if (btn.length) toggleSubmenu(btn);
          }
          // Tab and other keys: allow normal behavior (don't prevent default)
        });

        // Desktop: open submenu on focus (tab to parent link)
        cssmenu.on("focus", ".dropdown-toggle", function (e) {
          if (jQuery(window).width() > 874) {
            var sub = jQuery(this).siblings("ul");
            if (!sub.hasClass("open")) {
              sub.addClass("open").show();
              jQuery(this).attr("aria-expanded", "true");
            }
            return;
          }
          // Mobile: prevent focus from opening submenu - only click/Enter/Space should open
          var sub = jQuery(this).closest(".has-sub").find("ul").first();
          if (sub.length && !sub.hasClass("open")) {
            sub.hide();
          }
        });
      };

      function toggleSubmenu(triggerEl) {
        var sub = triggerEl.siblings("ul");
        var wasOpen = sub.hasClass("open");
        triggerEl.toggleClass("submenu-opened");
        if (wasOpen) {
          sub.removeClass("open").hide();
        } else {
          sub.addClass("open").show();
        }
        var expanded = !wasOpen;
        triggerEl.attr("aria-expanded", expanded);
        triggerEl.siblings(".dropdown-toggle").attr("aria-expanded", expanded);
      }

      if (settings.format === "multitoggle") multiTg();
      else cssmenu.addClass("dropdown");

      if (settings.sticky === true) cssmenu.css("position", "fixed");

      /**
       * Store the window width */
      var windowWidth = jQuery(window).width();
      resizeFix = function () {
        /**
         * Check window width has actually changed and it's not just iOS triggering a resize event on scroll */

        if (jQuery(window).width() != windowWidth) {
          /**
           * Update the window width for next time */

          windowWidth = jQuery(window).width();
          setTimeout(function () {
            if (jQuery(window).width() > 874) {
              cssmenu.find("ul").show();
            }
            if (jQuery(window).width() <= 874) {
              cssmenu.find("ul").hide().removeClass("open");
              jQuery(".submenu-button").removeClass("submenu-opened");
              jQuery(".submenu-button").addClass("submenu-closed");
            }
          }, 500);
        }
      };
      resizeFix();
      return jQuery(window).on("resize", resizeFix);
    });
  };
})(jQuery);

// Initialize menu and desktop menu-line animation (follows active/hovered item)
(function (jQuery) {
  jQuery(document).ready(function () {
    jQuery("#cssmenu").menumaker({
      title: "&nbsp;",
      format: "multitoggle",
    });

    jQuery("#cssmenu").prepend("<div id='menu-line'></div>");

    var foundActive = false,
      activeElement,
      linePosition = 0,
      menuLine = jQuery("#cssmenu #menu-line"),
      lineWidth,
      defaultPosition,
      defaultWidth;

    jQuery("#cssmenu > ul > li").each(function () {
      if (jQuery(this).hasClass("active")) {
        activeElement = jQuery(this);
        foundActive = true;
      }
    });

    if (foundActive === false) {
      activeElement = jQuery("#cssmenu > ul > li").first();
    }

    defaultWidth = lineWidth = activeElement.width();

    defaultPosition = linePosition = activeElement.position().left;

    menuLine.css("width", lineWidth);
    menuLine.css("left", linePosition);

    jQuery("#cssmenu > ul > li").hover(
      function () {
        activeElement = jQuery(this);
        lineWidth = activeElement.width();
        linePosition = activeElement.position().left;
        menuLine.css("width", lineWidth);
        menuLine.css("left", linePosition);
      },
      function () {
        menuLine.css("left", defaultPosition);
        menuLine.css("width", defaultWidth);
      }
    );
  });
})(jQuery);

(function ($) {
  "use strict";

  $(document).ready(function () {
    var window_height = $(window).height();
    var screen_size = $(window).width();
    $("#dms-subheader, #dhcc-subheader, #dltcrp-subheader").css(
      "height",
      window_height
    );

    /*-------------------------------------------------*/
    /* =  animate objects
    /*-------------------------------------------------*/

    var $fadeInUp = $("#strategiesText, #mapFull, #surveyPic");
    var $fadeInLeft = $("#iconsLeft, #newsLeft, #aboutLeft");
    var $fadeInRight = $("#iconsRight, #newsRight, #aboutRight");
    var $fadeIn = $(
      "#headerImage, #helpHeader, #newsHeader, #strategiesHeader, #mapHeader"
    );

    // InView - fadeIn

    if ($(window).width() >= 768) {
      $fadeIn.css("opacity", 0);
      $fadeInUp.css("opacity", 0);
      $fadeInLeft.css("opacity", 0);
      $fadeInRight.css("opacity", 0);

      $fadeIn.one("inview", function (event, visible) {
        if (visible) {
          $(this).addClass("animated fadeIn");
        }
      });

      // InView - fadeInDown
      $fadeInUp.one("inview", function (event, visible) {
        if (visible) {
          $(this).addClass("animated fadeInUp");
        }
      });
      // InView - fadeInLeft
      $fadeInLeft.one("inview", function (event, visible) {
        if (visible) {
          $(this).addClass("animated fadeInLeft");
        }
      });
      // InView - fadeInRight
      $fadeInRight.one("inview", function (event, visible) {
        if (visible) {
          $(this).addClass("animated fadeInRight");
        }
      });
    } else {
      $fadeIn.css("opacity", 1);
      $fadeInUp.css("opacity", 1);
      $fadeInLeft.css("opacity", 1);
      $fadeInRight.css("opacity", 1);
    }

    $(window)
      .on("resize", function () {
        var screen_size = $(window).width();

        if (screen_size >= 768) {
          $fadeIn.css("opacity", 0);
          $fadeInUp.css("opacity", 0);
          $fadeInLeft.css("opacity", 0);
          $fadeInRight.css("opacity", 0);

          $fadeIn.one("inview", function (event, visible) {
            if (visible) {
              $(this).addClass("animated fadeIn");
            }
          });

          // InView - fadeInDown
          $fadeInUp.one("inview", function (event, visible) {
            if (visible) {
              $(this).addClass("animated fadeInUp");
            }
          });
          // InView - fadeInLeft
          $fadeInLeft.one("inview", function (event, visible) {
            if (visible) {
              $(this).addClass("animated fadeInLeft");
            }
          });
          // InView - fadeInRight
          $fadeInRight.one("inview", function (event, visible) {
            if (visible) {
              $(this).addClass("animated fadeInRight");
            }
          });
        } else {
          $fadeIn.css("opacity", 1);
          $fadeInUp.css("opacity", 1);
          $fadeInLeft.css("opacity", 1);
          $fadeInRight.css("opacity", 1);
        }
      })
      .trigger("resize");
  });

  /* 
  * FIX Input element type 'search' missing an accessible name.
  * Hide the injected .tt-hint from accessibility APIs by
  * adding aria/presentation attributes and
  * tabindex -1 to the hint to hide it from accessibility tools.
  */
  function fixTypeaheadA11y() {
  var hint = jQuery("#sb-search-main .tt-hint");
  if (!hint.length) return;

  // The hint input is purely visual; hide it from Assistive Tech and validation tools.
  hint
    .attr("aria-hidden", "true")
    .attr("tabindex", "-1")
    .attr("role", "presentation")
    .attr("aria-label", "Decorative search hint")
    .attr("title", "");

  // Ensure it never gets focus
  hint.prop("disabled", false); // keep typeahead happy (it still uses the hint input visually).
  }
  // Run once after typeahead injects inputs
  fixTypeaheadA11y();
})(jQuery);

jQuery(document).ready(function () {
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
    jQuery("#agency-search").hide();
  }
});

jQuery(document).ready(function () {
  //Hide Fontawesome icons from linked images
  var links = document.querySelectorAll('a[href$=".pdf"]');
  for (var i = 0; i < links.length; i++) {
    if (links[i].children.length == 0) {
      links[i].classList.add("icon");
    }
  }
});

//Readspeaker Fix
window.rsConf = { general: { usePost: true } };
// end Readspeaker fix

jQuery(document).ready(function () {
    //Toggle Font Awesome caret on feedback button on click
    jQuery('.btn-de-feedback').click(function(){
      jQuery(this).find(".svg-inline--fa").toggleClass("fa-chevron-up fa-chevron-down");
  })
});

/*** Append Current page URL in Formstack Feedback form hidden input ***/
jQuery('#field151012296').ready(function() {
  var currentURL = window.location.href;
  document.getElementById("field151012296").value = currentURL;
})});
