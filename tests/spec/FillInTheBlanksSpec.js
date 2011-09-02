describe('Fill In The Blanks', function() {

  beforeEach(function(){
    $('body').append('<form id="frm-fill"><textarea name="original">text</textarea><textarea name="result"></textarea></form>');
    $('#frm-fill').fillintheblanks();
  });

  afterEach(function(){
    $('#frm-fill').remove();
  });

  it('Should convert normal text to text with blanks', function(){
    $('#frm-fill').submit();
    expect($('textarea[name="result"]').val()).toEqual('____');
  });

  it('Should convert at least one word at each line to a blank', function(){
    $('textarea[name="original"]').val('Testing multi line texts.\nSecond line of this text.\nThird line!');
    $('#frm-fill').submit();
    var lines = $('textarea[name="result"]').val().split(/\n/);
    for(x in lines)
      expect(lines[x]).toContain('_');
  });

  it('Should convert specified number of words at each line to a blank', function(){
    $('#frm-fill').unbind('submit');
    $('textarea[name="original"]').val('Testing multi line texts.\nSecond line of this text.\nThird line with more than three words!');
    $('#frm-fill').fillintheblanks({ blanks_by_line: 3 }).submit();
    var test_lines = $('textarea[name="result"]').val().split(/\n/);
    var test_words;
    var blank_count;
    for(x in test_lines){
       test_words = test_lines[x].split(/ /);
       blank_count = 0;
       for(y in test_words){
        if(test_words[y].indexOf('_') > -1)
          blank_count++;
       }
       expect(blank_count).toEqual(3);
    }
  });

  it('Should have blanks with the specified size', function(){
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ size: 3 }).submit();
    expect($('textarea[name="result"]').val()).toEqual('____________');
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ size: 12 }).submit();
    expect($('textarea[name="result"]').val()).toEqual('________________________________________________');
  });

  it('Should use the correct symbol for blanks', function(){
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ symbol: '=' }).submit();
    expect($('textarea[name="result"]').val()).toEqual('====');
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ symbol: ' ' }).submit();
    expect($('textarea[name="result"]').val()).toEqual('    ');
  });

  it('Should user the correct symbom with the specified size', function(){
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ symbol: '=', size: 2 }).submit();
    expect($('textarea[name="result"]').val()).toEqual('========');
    $('#frm-fill').unbind('submit');
    $('#frm-fill').fillintheblanks({ symbol: ' ', size: 5 }).submit();
    expect($('textarea[name="result"]').val()).toEqual('                    ');
  });

  it('Should ignore punctuation', function(){
    $('textarea[name="original"]').val('text.');
    $('#frm-fill').submit();
    expect($('textarea[name="result"]').val()).toEqual('____.');
    $('textarea[name="original"]').val('text?');
    $('#frm-fill').submit();
    expect($('textarea[name="result"]').val()).toEqual('____?');
    $('textarea[name="original"]').val('text!');
    $('#frm-fill').submit();
    expect($('textarea[name="result"]').val()).toEqual('____!');
  });

  it('Should ignore words on the ignore list', function(){
    $('#frm-fill').unbind('submit');
    $('textarea[name="original"]').val('Testing test\ntesting');
    $('#frm-fill').fillintheblanks({ ignore: ['testing'] }).submit();
    expect($('textarea[name="result"]').val()).toEqual('Testing ____\ntesting');
  });

  it('Should ignore numeric values', function(){
    $('textarea[name="original"]').val('50.9 test\ntest 12');
    $('#frm-fill').submit();
    expect($('textarea[name="result"]').val()).toEqual('50.9 ____\n____ 12');
  });

  it('Should ignore words smaller than the specified minimum size', function(){
  
  });

  it('Should ignore words bigger than the maximum size', function(){
  
  });

});
