(function($){

  $.fn.fillintheblanks = function(options){
  
    var defaults = {
      blanks_by_line: 1,
      symbol: '_',
      size: 1,
      original: 'original',
      result: 'result',
      ignore: ['the', 'in', 'on', 'as'],
      minimum_word_size: 2,
      maximum_word_size: -1
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

    var select_words = function(words){
      var words_to_convert = []; 
      var blanked_words = [];
      var word, len;

      while(words_to_convert.length < options.blanks_by_line && words_to_convert.length < words.length){
        word = Math.floor(Math.random()*(words.length));
        if(!in_array(word, blanked_words)){
          len = words[word].length * options.size;
          words_to_convert.push([word, len]);
          blanked_words.push(word);
        }
      }
      return words_to_convert;
    };

    var convert_words = function(words, words_to_convert){
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

    return this.each(function(){
      $(this).submit(function(e){
        var original = $(this).find('textarea[name="'+options.original+'"]').val();
        var lines = original.split(/\n/);
        var result = '';

        for(i in lines){
          var words = lines[i].split(/ /);
          if(words.length > 0){
            var words_to_convert = select_words(words);
            words = convert_words(words, words_to_convert);
            if(i > 0) result += "\n";
            for(w in words) result += words[w] + " ";
            result = result.replace(/ $/, "");
          }
        }

        $(this).find('textarea[name="'+options.result+'"]').val(result);
        e.preventDefault();
      });
    });

  };

})(jQuery);
