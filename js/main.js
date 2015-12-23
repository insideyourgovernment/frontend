    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
    function cell(value2, value3) {
        table_html = '';
if (!(value3 in value2)) {
        table_html += '<td></td>';
      } else if (value3.indexOf("photo") > -1) {
        table_html += '<td class="photo"><img src="'+value2[value3]+'" style="max-width:100px" /></td>';
      } else if (value2[value3] === parseInt(value2[value3], 10)) {
        table_html += '<td>'+numberWithCommas(value2[value3])+'</td>';
      } else if (value3 == 'links') {
        table_html += '<td><ul>';
        $.each(value2[value3], function(linki, link) {
          table_html += '<li><a href="'+link['url']+'">'+link['name']+'</a></li>';
        });
        table_html += '</ul></td>';
      } else if (value3.indexOf('link') > -1 || value3.indexOf('url') > -1 || value3.indexOf('url') > -1) {
        table_html += '<td><a href="'+value2[value3]+'">'+value2[value3]+'</a></td>';
      } else if (value3 == 'Summarized results') {
        var sresults = value2[value3];
        table_html += '<td><table>';
        $.each(sresults, function(eindex, employee) {
          table_html += '<tr><th colspan="2">'+employee['heading']+'</th></tr>';
          $.each(employee['allegations'], function(aindex, allegation) {
            table_html += '<tr><th>'+allegation['heading']+'</th><td>'+allegation['allegation']+'</td></tr>';
            if (stringStartsWith(allegation['opa_finding'], 'Sustained')) {
              highlighting = ' class="highlight"';
            } else {
              highlighting = '';
            }
            table_html += '<tr><th>'+allegation['heading']+' OPA finding</th><td'+highlighting+'>'+allegation['opa_finding']+'</td></tr>';
          });
          table_html += '<tr><th>Final discipline</th><td>'+employee['final_discipline']+'</td></tr>';
        });
        table_html += '</table>';
        table_html += '</td>';
      } else if (String(value2[value3]).indexOf('[object Object]') > -1 || Array.isArray(value2[value3])) {
        if (typeof value2[value3].epoch_time != 'undefined') {
          var date = new Date(value2[value3].epoch_time*1000);
          table_html += '<td>'+date+'</td>';
        } else {
          table_html += '<td>'+JSON.stringify(value2[value3]).replace(/:"/g, ': "').replace(/,/g, ', ')+'</td>';
        }
      } else if (value3 in value2) {
        table_html += '<td>'+value2[value3]+'</td>';
      }
        return table_html;
    }
    if(typeof console === "undefined"){
    console = { log: function() { } };
  }
  function highlight(what, where) {
    try {  
    where.each(function() {
      $(this).html($(this).html().replace(what.not('photo'), '<span class="highlight">'+what+'</span>'));
    });
    } catch (err) {
        
    }
  }
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}
function stringStartsWith (string, prefix) {
  return string.slice(0, prefix.length) == prefix;
}
function appendLater(what, when) {
  setTimeout(function() {$('.data_results').append(what)}, when);   
}
function addData(table, element, data, page) {
  element.html('');
  window.payload = data['payload'];
  //console.log(window.payload);  
  //console.log('fields '+data['fields']);
  var additional = '';
  if ('has_string_in_any_field' in window.payload) {
    additional = ' mentioning "'+window.payload['has_string_in_any_field']+'"';
    setTimeout(function() {highlight(window.payload['has_string_in_any_field'], $('.data_results td'))}, 1500);
  }
  var title = data['table']['name']+additional;
  var header = '<section class="content-header"><h1>'+title+'</h1></section>';
  element.append(header);
  header = '';
  document.title = title + " | Inside Your Government";
  header = '<section class="content"><a href="#!/information/?table='+data['table']['id']+'">Link to table without any subqueries</a> ';
  header += 'Raw data in JSON format at <span class="url"></span>';
  header += '<br/><strong>Search:</strong> <input type="text" class="search_query" /><input type="button" data-table="'+data['table']['id']+'" class="go" value="go" />';
  if (data['number_of_rows'] == 1) {
    header += ' ('+data['number_of_rows']+' row)';
  } else {
    header += ' ('+data['number_of_rows']+' '+data['name_for_rows']+')';
  }
  $.each(data['field_selectors'], function(i, value) {
    if (value['selector'] == 'checkbox') {
        var isboth = '';
        var istrue = '';  
        var isfalse = '';   
        if ('filter' in window.payload) {
          if (value['name'] in window.payload['filter']) {

            switch(window.payload['filter'][value['name']]) {
              case true:
                  istrue = ' selected';
                  break;
              case false:
                  isfalse = ' selected';
                  break;
            }        
          }
          else {
            isboth = ' selected';
          }
        } else {
          isboth = ' selected';
        }

        header += ' <select data-field="'+value['name']+'" class="boolean_field"><option value="both"'+isboth+'>Both '+value['display_name']+' and Not '+value['display_name']+'</option><option value="true"'+istrue+'>Only '+value['display_name']+'</option><option value="false"'+isfalse+'>Only Not '+value['display_name']+'</option></select>';
    } else if (value['selector'] == 'dropdown') {
        header += ' <strong>'+value['display_name']+'</strong> <select data-field="'+value['name']+'" class="dropdown_selector">';
        
        selected = 'none';
        if ('filter' in window.payload) {
          if (value['name'] in window.payload['filter']) {
            selected = window.payload[value['name']];
          }
        }
        $.each(value['items'], function(items_i, item) {
            if (item == selected) {
                selected_html = ' selected';
            } else {
              selected_html = '';   
            }
            header += '<option value="'+item+'"'+selected_html+'>'+item+'</option>';
        });
        if (selected == 'none') {
            if ('none' == selected) {
              selected_html = ' selected';
            } else {
              selected_html = '';   
            }
        }
        header += '<option value="none"'+selected_html+'></option>';
        header += '</select>';
    }
  });
  header += '<br/><strong>Sorting:</strong> ';
  header += ' <strong>Field:</strong> ';
  header += '<select class="field_for_sorting">';
  header += '<option value="" selected></option>';
  $.each(data['fields'], function(i, value) {
    header += '<option value="'+value+'">'+value+'</option>';
  });
  header += '</select>';
  header += ' <strong>Direction:</strong> ';
  header += '<select class="direction_for_sorting">';
  header += '<option value="desc" selected>descending</option>';
  header += '<option value="asc">ascending</option>';   
  header += '</select>';
  if ('percentages' in data) {
    if (data['percentages'].length > 0) {
      header += '<h3>Auto generated analysis</h3>';
      header += '<table class="data_table percentages"><tr><th>Field</th><th>Value</th><th>Percentage</th><th>Sentence</th></tr>';
      
      $.each(data['percentages'], function(i, value) {
        new_payload = clone(window.payload);
        new_payload['filter'] = {};
        new_payload['filter'][value['field']] = true;
        header += '<tr><td>'+value['field']+'</td><td><a href="/#!/information/?payload='+encodeURIComponent(JSON.stringify(new_payload))+'">'+value['value']+'</a></td><td>'+value['percentage']+'</td><td>'+value['sentence']+'</tr>';
      });
      header += '</table>';
    }
  }
  header += '<h3>Rankings</h3>';
  $.each(data['group_counts'], function(j, value2) {
      header += '<table class="data_table"><tr><th colspan="2">'+value2[0]+'</th></tr>';
      $.each(value2[1], function(h, value3) {
          header += '<tr><td>'+JSON.stringify(value3[0])+'</td><td>'+value3[1]+'</td></tr>';
      });
      header += '</table>';
  });
  header += '<h3>The data</h3>';
  header += '<div class="pages"></div>';
  //element.append(header);
  //header = '';
  
  var table_html = '<table class="data_table data_results"></table><div class="pages"></div></section>';
  element.append(header+table_html);
  table_html = '';
  if (page * per_page < number_of_records) {
      var rows = data['data'].slice((page-1) * per_page,page * per_page);
  } else {
      var rows = data['data'].slice((page-1) * per_page);
  }
  $.each(rows, function(j, value2) {
    table_html += '<tr><th></th>';
    
    if ('default_fields_to_display' in data['table']) {
      var fields = data['table']['default_fields_to_display'];
    } else {
      var fields = data['fields'];
    }
    $.each(fields, function(i, value) {
      table_html += '<th>'+value+'</th>';
    });
    table_html += '</tr>';
    table_html += '<tr>';
      var dict = {'table': data['table']['id'], 'get': value2['id']}
      dict = encodeURIComponent(JSON.stringify(dict));
      table_html += '<td><a href="/#!/information/?payload='+dict+'">Go to</a></td>';
    $.each(fields, function(h, value3) {
      table_html += cell(value2, value3); 
    });
    table_html += '</tr>';
    //appendLater(table_html, j*5)
    //$('.data_results').append(table_html);
    //console.log(table_html);
  });
  
  //table_html += '</table>';
  setTimeout(function() {$('.data_results').html(table_html);}, 1000);
    var number_of_records = data['number_of_rows'];
    var per_page = 10
    var pages = Math.floor(number_of_records / per_page);
    if (pages > 1) {
        if (number_of_records % per_page != 0) {
            pages += 1;
        }
        if (pages+1 < 20) {
          var end = pages + 1;
        } else {
          var end = 20;   
        }
        for (var i=1;i<end;i++) {
            $('.pages').append('<a href="" class="to_page_'+i+'">'+i+'</a>');
            //console.log(i+' '+pages);
            if (i != pages) {
              $('.pages').append(' | ');
            }
        }
    }
}
function addGetData(table, element, data, page) {
  element.html('');
  window.payload = data['payload'];
  //console.log(window.payload);  
  //console.log('fields '+data['fields']);
  var additional = '';
  if ('has_string_in_any_field' in window.payload) {
    additional = ' mentioning "'+window.payload['has_string_in_any_field']+'"';
    setTimeout(function() {highlight(window.payload['has_string_in_any_field'], $('.data_results td'))}, 1500);
  }
  var title = data['data']['id']+additional;
  var header = '<section class="content-header"><h1>'+title+'</h1></section>';
  element.append(header);
  header = '';
  document.title = title + " | Inside Your Government";
  header = '<section class="content"><a href="#!/information/?table='+data['table']['id']+'">Link to table without any subqueries</a> ';
  header += 'Raw data in JSON format at <span class="url"></span>';
  header += '<table>';
  $.each(Object.keys(data['data']), function(i, v) {
      header += '<tr><th>'+v+'</th><td>'+cell(data['data'][v])+'</td></tr>';
  });
  header += '</table>';
  element.html(header);
}
function addUrl(element, url) {
    console.log('url', url);
  window.location.hash = '!/information/'+url.substring(45);
  //console.log('add url '+url);
  setTimeout(function() {element.find('.url').html('<a href="'+url+'">'+url+'</a>');}, 500);
}
function getData(table, element, other) {
  element.text('Loading the data');
  var params = {'table': table};
  if (other) {
    var params = other;
    params['table'] = table;
  }
  $.ajax({
      url: 'https://api.insideyourgovernment.com/retrive/',
      data: {'payload': JSON.stringify(params)},
      dataType: 'json',
      complete : function(){
        //console.log('url', this.url);
          addUrl(element, this.url);
      },
      success: function(data){
        window.data = data;
        console.log('is get '+('get' in Object.keys(data['payload'])))
        if ('get' in Object.keys(data['payload'])) {
          addGetData(table, element, window.data, 1);  
        } else {
          addData(table, element, window.data, 1);
        }
      }
  });
}
function getDataForPayload(payload, element) {
    element.text('Loading the data');
  //console.log('type '+String(payload) == '[object Object]');
  if (String(payload) == '[object Object]') {
    $.ajax({
        url: 'https://api.insideyourgovernment.com/retrive/',
        data: {'payload': JSON.stringify(window.payload)},
        dataType: 'json',
        complete : function(){
          //console.log('url', this.url);
            addUrl(element, this.url);
        },
        success: function(data){
          var table = data['table'];
          window.data = data;
          console.log('is get '+('get' in Object.keys(data['payload'])))
        if ('get' in Object.keys(data['payload'])) {
          addGetData(table, element, window.data, 1);  
        } else {
          addData(table, element, window.data, 1);
        }
          if ('payload' in data) {
            if ('has_string_in_any_field' in data['payload']) {
              setTimeout(function() {$('.search_query').val(data['payload']['has_string_in_any_field'])}, 1000);
            }
          }
        }
    });
    
  } else {
    
    $.ajax({
        url: 'https://api.insideyourgovernment.com/retrive/?payload='+payload,
        
        dataType: 'json',
        complete : function(){
          //console.log('url', this.url);
            addUrl(element, this.url);
        },
        success: function(data){
          window.data = data;
          var table = data['table'];
          addData(table, element, data, 1);
          if ('payload' in data) {
            if ('has_string_in_any_field' in data['payload']) {
              setTimeout(function() {$('.search_query').val(data['payload']['has_string_in_any_field'])}, 500);
            }
          }
        }
    });
  }
}
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
function processHash() {
  setTimeout(function() {
    $('#share_buttons #facebook').html("<div class=\"fb-share-button\" data-href=\""+window.location+" data-layout=\"button\"><\/div>");
    $('#share_buttons #twitter').html("<a href=\"https:\/\/twitter.com\/share\" class=\"twitter-share-button\"{count} data-size=\"large\">Tweet<\/a>\r\n<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=\/^http:\/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\':\/\/platform.twitter.com\/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');<\/script>");
  }, 1000);
  var hash = window.location.hash;
  if (hash) {
    if (hash.endsWith('/')) {
      hash = hash.slice(3,-1);
    } else {
      hash = hash.slice(3);         
    }
    //console.log(hash);
    $('.main').hide();
    $('#nav a').removeClass('current');
    $("[href='/#!/"+hash+"/']").addClass('current');
    //console.log('substring '+hash.substring(0, 11));
    $('#working_space').text('');
    if (hash.substring(0, 9) == 'articles/') {
        //console.log('next substring '+hash.substring(9));
        $('#'+hash.substring(9)+'_article').show();
        document.title = $('#'+hash.substring(9)+'_article h2').text() + ' | Inside Your Government';
        gaTrack(window.location.hash.substring(2), document.title + ' | Inside Your Government');
        DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = hash.substring(9);  
            this.page.url = window.location;
          }
        });
    } else if (hash.substring(0, 19) == 'information/?table=') {
        var table = hash.substring(19);
        //console.log(table);
        getData(table, $('#working_space'));
        DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = hash.substring(9);  
            this.page.url = window.location;
          }
        });
    } else if (hash.substring(0, 21) == 'information/?payload=') {
        var payload = hash.substring(21);
        //console.log(table);
        getDataForPayload(payload, $('#working_space'));
        setTimeout(function() {DISQUS.reset({
          reload: true,
          config: function () {  
            this.page.identifier = hash.substring(9);  
            this.page.url = window.location;
          }
        })}, 1000);
    } else {
        
        document.title = $('#'+hash+'_main h1').text() + ' | Inside Your Government';
        gaTrack(window.location.hash.substring(2), document.title + ' | Inside Your Government');
        $('#'+hash+'_main').show();
        
    }    
    
  } else {
    window.location.hash = '#!/home/';
    processHash();
  }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Function to load and initiate the Analytics tracker
function gaTracker(id){
  $.getScript('//www.google-analytics.com/analytics.js'); // jQuery shortcut
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
  ga('create', id, 'auto');
  ga('send', 'pageview');
}


// Function to track a virtual page view
function gaTrack(path, title) {
  ga('set', { page: path, title: title });
  ga('send', 'pageview');
}


$(function() {
  $('#nav').height($('#nav a:link').outerHeight()+2);
  gaTracker('UA-70789642-1');
  $('#account_box').hide();
  $('.main').not('#home').hide();
  processHash();
  //$('ul'+hash+':first').show();
  $('body').on('click', 'a', function() {
    //console.log($(this).attr('href').substring(0, 1));
    if ($(this).attr('href').substring(0, 3) == "/#!" || $(this).attr('href').substring(0, 2) == "#!") {
      setTimeout(function(){processHash();},100);
    }
  });
  //console.log(document.cookie);
  //console.log(getCookie('session'));
  $.get('https://api.insideyourgovernment.com/get_session_info/', {'session': getCookie('session')}, function(data) {
      //console.log(data);
      $('#login_box').hide();
      $('#account_box').show(); 
      if (data['is_admin']) {
        $('.admin').show();
        $.get('https://api.insideyourgovernment.com/tables/', function(data) {
           $.each(data, function(i, value) {
             $('#tables_for_action').append('<option value="'+value+'">'+value+'</option>');
           });           
        });
      }
    }); 
  $('#login').click(function() {
    $.post('https://api.insideyourgovernment.com/login/', {'email': $('#email').val(), 'password': $('#password').val()}, function(data) {
        //console.log(typeof data);
        //console.log(data['session_id']);
      document.cookie="session="+data['session_id'];
      //console.log(document.cookie);
      //console.log(data);  
    });  
  });
  $.fn.getAttributes = function() {
    var attributes = {}; 
    if( this.length ) {
        $.each( this[0].attributes, function( index, attr ) {
            if (attr.name.substring(0,5) == 'data-') {
              if (attr.name == 'data-pluck') {
                attributes[ attr.name.slice(5) ] = JSON.parse(attr.value);
              } else {
                attributes[ attr.name.slice(5) ] = attr.value;
              }
            } else {
              attributes[ attr.name ] = attr.value;
            }
        } ); 
    }
    return attributes;
  };
  function addDivsOfTables(theObj, data) {
    //theObj.html(JSON.stringify(data));
    $.each(data['keys'], function(i, value) {
      var table = '<table class="data_table">';
      table += '<tr><th>Link</th>';
      $.each(data['table_fields'], function(j, value2) {
        table += '<th>'+value2+'</th>';
      });
      //console.log(value+' '+JSON.stringify(data[value]));
      $.each(data['data'][value], function(j, value2) {
        table += '<tr>';
        table += '<td><a href="/#!/information/?table='+value2[theObj.attr('data-field_for_url')]+'">'+value2[theObj.attr('data-field_to_name_link')]+'</a>';
        $.each(data['table_fields'], function(h, value3) {
          table += cell(value2, value3);
        });
        table += '</tr>';
      });
      table += '</tr>';
      table += '</table>';
      theObj.append('<div class="box_200"><h3>'+value+'</h3>'+table+'</div>');
    });
  }
  function getDivsOfTables(theObj) {
    var params = theObj.getAttributes();
    //console.log('https://api.insideyourgovernment.com/retrive/?payload='+encodeURIComponent(JSON.stringify(params)))
    $.get('https://api.insideyourgovernment.com/retrive/', {'payload': JSON.stringify(params)}, function(data) {
      //console.log(data);
        
      addDivsOfTables(theObj, data);
    });
  }
  $('.divs_of_tables').each(function() {
    getDivsOfTables($(this));
  });

  $('body').on('click', '.go', function() {
    var query = $(this).prev().val();
    getData($(this).attr('data-table'), $('#working_space'), {'has_string_in_any_field': query});
    setTimeout(function() {$('.search_query').val(query)}, 1000);
    setTimeout(function() {highlight($('.search_query').val(), $('#working_space td').not('.photo'))}, 1000);
  });
  $("body").on('keyup', '.search_query', function (e) {
    if (e.keyCode == 13) {
        $(this).parent().find('.go').trigger('click');
    }
  });
  $('body').on('change', '.boolean_field', function(e) {
    var f = $(this).attr('data-field');
    window.payload['filter'] = {};
    //console.log(JSON.stringify(window.payload));
    if ($(this).val() == 'both') {
      if ('filter' in window.payload) {
        if ($(this).attr('data-field') in window.payload['filter']) {
          delete window.payload['filter'][$(this).attr('data-field')];
        }
        if (Object.keys(window.payload['filter'])) {
          delete window.payload['filter'];
        }
      }      
    } else {
      //console.log($(this).val(), Boolean($(this).val()));
      window.payload['filter'][f] = ($(this).val() == 'true');
    }
    getDataForPayload(window.payload, $('#working_space'));
    
  });
  $('body').on('change', '.dropdown_selector', function(e) {
    var f = $(this).attr('data-field');
    window.payload['filter'] = {};
    //console.log(JSON.stringify(window.payload));
    if ($(this).val() == 'none') {
      if ('filter' in window.payload) {
        if ($(this).attr('data-field') in window.payload['filter']) {
          delete window.payload['filter'][$(this).attr('data-field')];
        }
        //if (Object.keys(window.payload['filter'])) {
        //  delete window.payload['filter'];
        //}
      }      
    } else {
      //console.log($(this).val(), Boolean($(this).val()));
      window.payload['filter'][f] = $(this).val();
    }
    getDataForPayload(window.payload, $('#working_space'));
    
  }); 
   $('body').on('click', '.pages a', function(e) {
        e.preventDefault();
        $('.pages a').removeClass('current');
        $('.to_page_'+$(this).text()).addClass('current');
        window['page'] = parseInt($(this).text());
        getDataForPayload(window.data, $('#working_space'));
        //addData(window.data['table']['id'], $('#working_space'), window.data, $(this).text());
   });
});