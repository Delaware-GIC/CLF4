// Set up autocomplete
jQuery("#st-search-input").swiftype({
  engineKey: searchEngineKey
});

// Set up search
jQuery(function() {
    // If the selected radio button is PDF
    if(getParameterByName('type') == 'pdf') {
        // Check the selected radio button after refresh.
        jQuery(':input[value="PDF"]').attr("checked",true)
        // Display results
        jQuery('#st-search-input').swiftypeSearch({
            resultContainingElement: '#st-results-container',
            engineKey: searchEngineKey,
            renderFunction: customRenderer,
            postRenderFunction: customPostRenderFunction,
            renderPaginationForType:customRenderPagination,
            filters: function() {
                    return { page: {'type':'PDF'}};
                    }
        });
    } else {
        // If the selected radio button is ALL Result
        // Check the selected radio button after refresh.
        jQuery(':input[value="ALL"]').attr("checked",true)
        // Display results.
        jQuery('#st-search-input').swiftypeSearch({
            resultContainingElement: '#st-results-container',
            engineKey: searchEngineKey,
            renderFunction: customRenderer,
            postRenderFunction: customPostRenderFunction,
            renderPaginationForType:customRenderPagination
        });
   }

    // Page redirect based on selected radio button. The URL needs changed as per the requirement.
    jQuery("input:radio[name=st-search-doctype]").click(function() {
            var docTypeSelectedValue = jQuery(this).val();
            var searchStringValue = jQuery("#st-search-input").val();
            if(searchStringValue != '') {
                // Refresh the results page based on selected radio button
                if(docTypeSelectedValue == 'PDF') {
                    window.location.href = window.location.pathname+"?s&type=pdf#stq="+searchStringValue;
                } else {
                    window.location.href = window.location.pathname+"?s#stq="+searchStringValue;
                }
            }

    });
});


// Function to get query parameter from URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Swiftype functions.
var customRenderer = function(documentType, item) {
    var description;
    if(item['highlight']['body'] == null) {
        if(item['body'] != '') {
            if (item['body'].length > 100) {
                description = item['body'].substring(0,290);
                description = description.substr(0, Math.min(description.length, description.lastIndexOf(" ")))
            }
    } else {
        description = '';
    }
    } else {
        description = item['highlight']['body'];
    }
    var data = {
        title: item['title'],
        url: item['url'],
        body: description
    };

var htmlSearchOutput;
htmlSearchOutput = "";
htmlSearchOutput += "<div class='st-result'>";
htmlSearchOutput += "<h3 class='title'>";
htmlSearchOutput += "<a href='"+item['url']+"' class='st-search-result-link'>";
htmlSearchOutput += item['title'];
htmlSearchOutput += "</a>";
htmlSearchOutput += "</h3>";
htmlSearchOutput += "<div class='st-metadata'>";
htmlSearchOutput += "<span class='st-snippet'>"+description+"</span>";
htmlSearchOutput += "</div>";

return htmlSearchOutput;
};

var customPostRenderFunction = function(data) {
  var totalResultCount = 0;
  var resultsPerPage = null;
  var $resultContainer = this.getContext().resultContainer;
  var spellingSuggestion = null;
  var thisPage = 0;
  var currentQuery = null;
  function htmlEscape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  if (data["info"]) {
    jQuery.each(data["info"], function(index, value) {
      totalResultCount += value["total_result_count"];
      resultsPerPage = value["per_page"];
      thisPage = value["current_page"];
      currentQuery = value["query"];
      if (value["spelling_suggestion"]) {
        spellingSuggestion = value["spelling_suggestion"]["text"];
      }
      jQuery("#st-search-input").val(value['query']);
      jQuery("#filter").removeClass("hide");
    });
  }

  if (totalResultCount > 0) {
    var startNum = ((thisPage - 1) * resultsPerPage) + 1;
    var endNum = thisPage * resultsPerPage;
    if(endNum > totalResultCount) {
        endNum = totalResultCount
    }
    $resultContainer.prepend(
      "<br><div id='st-result-summary' class='alert alert-info'>Showing <strong>" + startNum + "</strong> - <strong>" + endNum + "</strong> of <strong>" + totalResultCount + "</strong> results for &quot;" + htmlEscape(currentQuery) + "&quot;</div></br>"
    );
  }

  if (totalResultCount === 0) {
    $resultContainer.html("<div id='st-no-results' class='st-no-results'>No results found for &quot;" + htmlEscape(currentQuery) + "&quot;.</div>");
    if (spellingSuggestion == null) {
        $resultContainer.append(globalSearchForm);
    }
  }

  if (spellingSuggestion !== null) {
    $resultContainer.append('<div class="st-spelling-suggestion">Did you mean <a href="#" data-hash="true" data-spelling-suggestion="' + spellingSuggestion + '">' + spellingSuggestion + "</a>?</div>");
    $resultContainer.append(globalSearchForm);
  }
};

// Pagination.
var customRenderPagination = function (type, currentPage, totalPages) {
    var pages = '<div class="st-page">', previousPage, nextPage;
    var pageNumbers = [];
    var startWith = 1;
    var maxNumbers = 100;

    var range = 4;
    var showitems = (range * 2) + 1;


    for (var pageNumber = startWith; pageNumber <= Math.min(startWith + maxNumbers - 1, totalPages); ++pageNumber) {
        pageNumbers.push(pageNumber);
    }

    if (totalPages > 1) {

        if(currentPage > 2 && currentPage > range+1 && showitems < totalPages) {
            pages = pages + '<a href="#" class="st-first btn btn-info btn-md" data-hash="true" data-page="1">&laquo; first</a>';
        }
      if (currentPage >= 1) {
        previousPage = currentPage - 1;
        if (previousPage != 0) {
          pages = pages + '<a href="#" class="st-prev btn btn-primary btn-md" data-hash="true" data-page="' + previousPage + '">&lsaquo; previous</a>';
        }
      }
      for (var i = 1; i <= pageNumbers.length; i++) {
            if (1 != pageNumbers.length &&( !(i >= currentPage+range+1 || i <= currentPage-range-1) || totalPages <= showitems )) {
                if(i == currentPage) {
                    pages = pages + '<span class="btn btn-warning btn-md">'+ i +'</span>';
                } else {
                    pages = pages + '<a href="#" class="st-page btn btn-default btn-md" data-hash="true" data-page="' + i + '">'+ i +'</a>';
                }
            }
      }
      if (currentPage < totalPages) {
        nextPage = currentPage + 1;
        pages = pages + '<a href="#" class="st-next btn btn-primary btn-md" data-hash="true" data-page="' + nextPage + '">next &rsaquo;</a>';
      }

      if (currentPage < totalPages-1 &&  currentPage+range-1 < totalPages && showitems < totalPages) {
        pages = pages + '<a class="st-last btn btn-info btn-md" href="#" data-hash="true" data-page="' + totalPages + '">last &raquo;</a>';
      }
    }
    pages += "</div>";
    pages += globalSearchForm();
    return pages;

};

// Try new search form HTML code.
function globalSearchForm () {
    var globalForm = '';
        globalForm += '<form action="https://search3.delaware.gov/texis/search" id="SearchForm" method="get">';
        globalForm += '<input type="hidden" value="" name="mode">';
        globalForm += '<input type="hidden" value="" name="opts">';
        globalForm += '<input type="hidden" value="default" name="pr">';
        globalForm += '<input type="hidden" value="html" name="dropXSL">';
        globalForm += '<input type="hidden" value="" name="sq" id="sq">';
        globalForm += '<input type="hidden" value="page" name="prox">';
        globalForm += '<input type="hidden" value="500" name="rorder">';
        globalForm += '<input type="hidden" value="500" name="rprox">';
        globalForm += '<input type="hidden" value="500" name="rdfreq">';
        globalForm += '<input type="hidden" value="500" name="rwfreq">';
        globalForm += '<input type="hidden" value="500" name="rlead">';
        globalForm += '<input type="hidden" value="62" name="rdepth">';
        globalForm += '<input type="hidden" value="2" name="sufs">';
        globalForm += '<input type="hidden" value="r" name="order">';
        globalForm += '<div><br />';
        globalForm += '<label for="query">Try a new search on delaware.gov</label>';
        globalForm += '<div class="row">';
        globalForm += '<div class="col-sm-10">';
        globalForm += '<input value="" class="queryAutocomplete ui-autocomplete-input form-control input-lg" name="query" id="query" size="25" autocomplete="off" /><br />';
        globalForm += '</div>';
        globalForm += '<div class="col-sm-2">';
        globalForm += '<input type="submit" value="Submit" class="btn btn-primary btn-lg text-center center-block btn-block" />';
        globalForm += '</div>';
        globalForm += '</div>';
        globalForm += '</div>';
        globalForm += '</form>';

        return globalForm;
}