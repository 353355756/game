$(document).ready(function () {

  // because of the bootstrap component has this kind of function
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = '你确定删除吗?';
    bootbox.confirm(msg, '取消', '确认', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });
  // add the tags some style
  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

});
