(function($){

  $.fn.fillintheblanks = function(options){
  
    var defaults = {
      blanks_by_line: 1,
      symbol: '_',
      size: 1,
      original: 'original',
      result: 'result' 
    };

    options = $.extend(defaults, options);
    return this.each(function(){
      $(this).submit(function(e){
        var original = $(this).find('textarea[name="'+options.original+'"]').val();
        var lines = original.split(/\n/);
        var words, word, words_to_convert;
        var len;
        var already_picked, already_blanked;
        var result = '';
        for(i in lines){
          words = lines[i].split(/ /);

          if(words.length > 0){
            words_to_convert = []; 
            already_picked = [];

            while(words_to_convert.length < options.blanks_by_line && words_to_convert.length < words.length){
              word = Math.floor(Math.random()*(words.length));
              already_blanked = false;
              for(x in already_picked)
                if(word == already_picked[x]){
                  already_blanked = true;
                  break;
                }
              if(!already_blanked){
                len = words[word].length * options.size;
                words_to_convert.push([word, len]);
                already_picked.push(word);
              }
            }

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

            if(i > 0)
              result += "\n";

            for(w in words)
              result += words[w] + " ";

            result = result.replace(/ $/, "");
          }
        }

        $(this).find('textarea[name="'+options.result+'"]').val(result);
        e.preventDefault();
      });

    });

  };

})(jQuery);
