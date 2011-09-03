(function($){

  $.fn.fillintheblanks = function(options){
  
    var defaults = {
      blanks_by_line: 1,
      symbol: '_',
      size: 1,
      original: 'original',
      result: 'result',
      ignore: [],
      min_size: 2,
      max_size: 0 
    };

    var options = $.extend(defaults, options || {});

    for(word in options.ignore)
      options.ignore[word] = options.ignore[word].toLowerCase();

    var in_array = function(needle, haystack){
      for(key in haystack)
        if(needle == haystack[key])
          return true;
      return false;
    };

    var _is_valid_word = function(word){
      return (!in_array(word.toLowerCase(), options.ignore) 
              && word.length >= options.min_size 
              && (options.max_size < 1 || word.length <= options.max_size)
              && (isNaN(parseFloat(word))));
    };

    var _select_words = function(words){
      var words_to_convert = []; 
      var checked_words = [];
      var word, len;

      while(words_to_convert.length < options.blanks_by_line && checked_words.length < words.length){
        word = Math.floor(Math.random()*(words.length));
        if(!in_array(word, checked_words)){
          checked_words.push(word);
          if(_is_valid_word(words[word])){
            len = words[word].length * options.size;
            words_to_convert.push([word, len]);
          }
        }
      }
      return words_to_convert;
    };

    var _convert_words = function(words, words_to_convert){
      for(w in words_to_convert){
        var matches = words[words_to_convert[w][0]].match(/[\.!\?,]$/g);
        words[words_to_convert[w][0]] = '';
        if(matches && matches.length > 0)
          words_to_convert[w][1] -= options.size;
        for(var x = 1; x <= words_to_convert[w][1]; x++)
          words[words_to_convert[w][0]] += options.symbol; 
        if(matches && matches.length > 0)
          words[words_to_convert[w][0]] += matches[0];
      }
      return words;
    };

    var _generate_line = function(line, words){
      var new_line = '';
      if(i > 0) new_line += "\n";
      for(w in words) new_line += words[w] + " ";
      return new_line.replace(/ $/, "");   
    };

    return this.each(function(){
      $(this).submit(function(e){
        var original = $(this).find('textarea[name="'+options.original+'"]').val();
        var lines = original.split(/\n/);
        var result = '';

        for(i in lines){
          var words = lines[i].split(/ /);
          if(words.length > 0){
            var words_to_convert = _select_words(words);
            words = _convert_words(words, words_to_convert);
            result += _generate_line(i, words);
          }
        }

        $(this).find('textarea[name="'+options.result+'"]').val(result);
        e.preventDefault();
      });
    });

  };

})(jQuery);
