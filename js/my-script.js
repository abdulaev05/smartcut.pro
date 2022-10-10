
jQuery(document).ready(function(){
  if (null != $.cookie("smct_l") && "" != $.cookie("smct_l") && $('input[name="l_zag"]').val($.cookie("smct_l")), null != $.cookie("smct_tdisk") && "" != $.cookie("smct_tdisk") && $('input[name="t_disk"]').val($.cookie("smct_tdisk")), null != $.cookie("smct_l_zag_id") && "" != $.cookie("smct_l_zag_id") && $('input[name="l_zag_id"]').val($.cookie("smct_l_zag_id")), null != $.cookie("smct_ed") && "" != $.cookie("smct_ed") && $('input[name="ed"]').val($.cookie("smct_ed")), null != $.cookie("smct_out") && $.cookie("smct_out").length > 3) {
      nc = $.cookie("smct_out").split(",");
      let t = '<tr class="str_out">' + $(".str_out:last").html() + "</tr>";
      nc.length > 0 && $(".str_out").remove();
      for (let n = 0; n < nc.length; ++n) {
          ar = nc[n].split("-");
          let e = ar[0],
              r = ar[1],
              o = ar.slice(2).join("-");
          ar[0] > 0 && ar[1] && ($(".out > tbody > tr:last").before(t), $(".str_out:last input[name='l[]']").val(e), $(".str_out:last input[name='c[]']").val(r), $(".str_out:last input[name='id[]']").val(decodeURIComponent(o)))
      }
      $(".out > tbody > tr:last").before(t), r(), s()
      console.log("hello")
  }
  if (null != $.cookie("smct_in") && $.cookie("smct_in").length > 3) {
      nci = $.cookie("smct_in").split(",");
      var o = '<tr class="str_in">' + $(".str_in:last").html() + "</tr>";
      nci.length > 0 && $(".str_in").remove();
      for (let n = 0; n < nci.length; ++n) {
          ari = nci[n].split("-");
          let e = ari[0],
              t = ari[1],
              r = ari.slice(2).join("-");
          ari[0] > 0 && ari[1] && ($(".in > tbody > tr:last").before(o), $(".str_in:last").find('input[name="l_in[]"]').val(e), $(".str_in:last").find('input[name="c_in[]"]').val(t), $(".str_in:last").find('input[name="id_in[]"]').val(decodeURIComponent(r)))
      }
      $(".in > tbody > tr:last").before(o), r(), a()
  }

  $(".res_buttons").css({
    display: "flex"
  })
  smartcutRes()
  
  $(".start").on("click" , (() =>{
    i();
  }))


  let inputL = [];
  $('.out .str_out input[name="l[]"]').each((index , elem) =>{
    let i = $('.out .str_out input[name="c[]"]')[index].value;
    for(i ; i > 0 ; i--){
        inputL = [...inputL , elem.value]
    }
  })
  console.log(inputL.sort((a , b ) => a - b));

  
  let inputL_in = [];
  $('.in .str_in input[name="l_in[]"]').each((index , elem) =>{
    let i = $('.in .str_in input[name="c_in[]"]')[index].value;
    for(i ; i > 0 ; i--){
        inputL_in = [...inputL_in , elem.value]
    }
  })
  console.log(inputL_in.sort((a , b ) => a - b));

  






  $(".add").click((function() {
    return t(), $('input[name="l[]"]').last().focus(), !1
  }))
  $("#add_in").click((function() {
    return n(), $('input[name="l_in[]"]').last().focus(), !1
  }))





  $(".out").on("click", ".del", (function() {
    ! function(e) {
        $(".str_out").length > 1 ? ($(e).parent().remove(), r(), s()) : $('input[name="l[]"], input[name="c[]"], input[name="id[]"]').val("");
        i();
    }(this), m("out")
  }))
  $(".in").on("click", ".del_in", (function() {
    ! function(e) {
        $(".str_in").length > 1 ? ($(e).parent().remove(), r(), a()) : $('input[name="l_in[]"], input[name="c_in[]"], input[name="id_in[]"]').val("");
        i()
    }(this), m("in")
  }))
  $(".all_del").click((function() {
    $(".str_out").each((function() {
        $(".str_out").length > 1 && $(this).remove()
    }))
    r();
    removeCookieSmct_out();
  }))
  $(".all_del_in").click((function() {
    $(".str_in").each((function() {
        $(".str_in").length > 1 && $(this).remove()
    }))
    r();
    removeCookieSmct_in();
  }))
  




  function l() {
      $(".pro-user .show_waste").addClass("active"), $(".waste").show()
  }
  function a() {
      var e = 0;
      $('input[name="c_in[]"]').each((function() {
          e += 1 * $(this).val()
      })), $("#count_summ_in").html(e > 0 ? "(" + e + ")" : "")
  }
  function t() {
      $(".str_out:last").after('<tr class="str_out">' + $(".str_out:last").html() + "</tr>"), r();
  }
  function n() {
      $(".str_in:last").after('<tr class="str_in">' + $(".str_in:last").html() + "</tr>"), r()
  }
  function r() {
      var e = 2;
      $(".num_in").each((function() {
          $(this).html(e), e++
      })), e = 1, $(".num").each((function() {
          $(this).html(e), e++
      }))
  }
  function s() {
    var e = 0;
    $('input[name="c[]"]').each((function() {
        e += 1 * $(this).val()
    })), $("#count_summ").html(e > 0 ? "(" + e + ")" : "")
  }
  function u(e) {
    $.magnificPopup.open({
        items: {
            src: '<div class="white-popup">' + e + "</div>"
        }
    }), $("button.button").eq(0).focus(), setTimeout((function() {
        $("button.button").eq(0).focus()
    }), 50)
  }
  function m(e) {
      return null != e && e === e.window
  }
  function y() {
      $("#smartcut_res").css("min-width", "");
      var e = 0;
      $(".map_item").each((function() {
          $(this).width() > e && (e = $(this).width())
      })), $("#smartcut_res").width() < e && $("#smartcut_res").css("min-width", e + 30 + "px")
  }
  function v() {
      $(window).scrollTop() + $(window).height() > $("#smartcut_res").offset().top - 30 && $(window).scrollTop() + $(window).height() < $("#smartcut_res").offset().top + $("#smartcut_res").height() ? $(".top").css("left", "calc(50% + " + ($("#smartcut_res").width() / 2 + 32) + "px)") : $(".top").css("left", "")
  }
  function i() {
      var e, t, n, r, i = "", a = "";
      $(".str_out").each((function() {
          e = $(this).find('input[name="l[]"]').val(), t = $(this).find('input[name="c[]"]').val(), id = encodeURIComponent($(this).find('input[name="id[]"]').val()), e > 0 && t > 0 && (i = i + e + "-" + t + "-" + id + ",")
      })), 
      $(".str_in").each((function() {
          n = $(this).find('input[name="l_in[]"]').val(), r = $(this).find('input[name="c_in[]"]').val(), ii = encodeURIComponent($(this).find('input[name="id_in[]"]').val()), n > 0 && r > 0 && (a = a + n + "-" + r + "-" + ii + ",")
      })), 
      i = i.slice(0, -1), 
      a = a.slice(0, -1), 
      $.cookie("smct_out", i, {
          expires: 365
      }), 
      $.cookie("smct_in", a, {
          expires: 365
      }), 
      $.cookie("smct_l", $('input[name="l_zag"]').val(), {
          expires: 365
      }), 
      $.cookie("smct_tdisk", $('input[name="t_disk"]').val(), {
          expires: 365
      }), 
      $.cookie("smct_l_zag_id", $('input[name="l_zag_id"]').val(), {
          expires: 365
      }), 
      $.cookie("smct_ed", $('input[name="ed"]').val(), {
          expires: 365
      });
       console.log($.cookie("smct_out"))
       console.log($.cookie("smct_in"))
  }
  function removeCookieSmct_out(){
    $.cookie("smct_out", '', {
        expires: 365
    })
  }
  function removeCookieSmct_in(){
    $.cookie("smct_in", '', {
        expires: 365
    }), 
    $.cookie("smct_l", '', {
        expires: 365
    }), 
    $.cookie("smct_l_zag_id", '', {
        expires: 365
    })
  }
  function smartcutRes(){
    $(".smartcut_res").append('<p class="" style="margin:0; padding:0;">' + 'Used:' +'</p>')
    createMapItem();
  }
  function createMapItem(){
    $(".smartcut_res").append('<tabel class=\"map_item' + '' + '\"' + 'style="width:100%;"></tabel>'); 
        $(".map_item").append('<caption class="id-in-map" style="">' + 'Mark:' +'</caption>');
        $(".map_item").append('<tbody class="mapItemTBody" style=""></tbody>');
            $(".mapItemTBody").append('<tr class="mainItem" style=""></tr>');
                $(".mainItem").append('<td class="itemRaskhod" style="">' + '</td>');
                $(".mainItem").append('<td class="srez" style=""></td>');
                    $(".srez").append('<span class="" style="">' + '</span>');
                $(".mainItem").append('<td class="waste_item" style="">esf</td>');
                
            $(".mapItemTBody").append('<tr class="sizemarkersTr" style=""></tr>');
                $(".sizemarkersTr").append('<td class="sizemarkers" style=""></td>');



  }
  function calc(){

  }
//   c()
//   function c() {
//     let e = new Date,
//         t = document.getElementById("smartcut_res");
//     let n = $("#pdf-format").val(),
//         r = $("#pdf-orientation").val();
//     console.log(n + " " + r);
//     let o = $.cookie("smct_cut_name"),
//         i = void 0 !== o && "" != o ? o : "smartcut.pro";
//     let a = window.location.search;
//     null != new URLSearchParams(a).get("style") && (i = "cutting_");
//     let s = {
//         margin: [.4, .3, .4, .3],
//         filename: i + " " + e.toLocaleDateString().replace(/\./g, "-") + "_" + e.toLocaleTimeString().replace(/:/g, "") + ".pdf",
//         html2canvas: {
//             scale: 2
//         },
//         jsPDF: {
//             unit: "in",
//             format: n,
//             orientation: r
//         },
//         pagebreak: {
//             mode: ["css", "legacy"]
//         }
//     };
//     return html2pdf().set(s).from(t).save().then(e => {
//         $(".pdf-made").prop("disabled", !1), console.log("pdf export success")
//     }).catch(e => {
//         $(".pdf-made").prop("disabled", !1), console.log("pdf export error")
//     }), setTimeout((function() {
//         $(".cutting_name").removeClass("hidden"), "" == $(".cutting_name textarea").val() && $(".cutting_name").show(), $(".list-items-open").show()
//     }), 5e3), $.magnificPopup.close(), !1
// }
  
})