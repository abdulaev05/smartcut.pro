
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

    $('.start').on('click' , (() =>{
        i()
    }))

    ////////РАСЧЕТЫ
    let inputL = [];
    $('.str_out').each(index =>{
        let str_out_value = $('input[name="l[]"]')[index].value;
        let str_out_counter = $('input[name="c[]"]')[index].value;
        let str_out_name = $('input[name="id[]"]')[index].value;
        if(str_out_value != 0 && str_out_counter != 0){
            inputL = [...inputL , {val : +str_out_value , counter: +str_out_counter , materialName: str_out_name}]
        }
    })
    inputL = inputL.sort((a , b) => a.val > b.val ? 1 : -1)
  
    
    let inputL_in = [];
    $('.str_in').each(index =>{
        let str_in_value = $('input[name="l_in[]"]')[index].value;
        let str_in_counter = $('input[name="c_in[]"]')[index].value;
        let str_in_name = $('input[name="id_in[]"]')[index].value;
        if(str_in_value != 0 && str_in_counter != 0){
            inputL_in = [...inputL_in , {val : +str_in_value , counter: +str_in_counter , materialName: str_in_name}]
        }
    })
    inputL_in = inputL_in.sort((a , b) => a.val > b.val ? 1 : -1)
    
    let usedInputL = JSON.parse(JSON.stringify(inputL))


    let RenderArray = []
    ///ЦИКЛ ДЛЯ СОЗДАНИЯ МАССИВА РЕНДЕРИНГА
    do{
        let minInputL = inputL.reduce((a , b) => a.val < b.val ? a : b , 0).val;
        let maxInputL_in = inputL_in.reduce((a , b) => a.val > b.val ? a : b , 0).val;
        if(maxInputL_in >= minInputL && inputL_in.length){
            inputL_in.forEach((element , index) => {
                let inputLClone = JSON.parse(JSON.stringify(inputL)).filter(e => e.val <= element.val).sort((a , b) => a.val - b.val)
                for(let i = 1; i <= element.counter; i++){
                    minSrez(element.val , inputLClone,  RenderArray);
                }
            })
        }
        else if($('input[name="l_zag"]').val() >= minInputL){
            let element = +$('input[name="l_zag"]').val();
            let inputLClone = JSON.parse(JSON.stringify(inputL)).filter(e => e.val <= +$('input[name="l_zag"]').val()).sort((a , b) => a.val - b.val)
            minSrez(element , inputLClone,  RenderArray);
        }
        else{
            break;
        }
    }while(inputL.length)

    function minSrez(element , Array , RenderArray){
        let limit = element;
        let delNumber = 0;
        let delArray = [];
        //РАСЧЕТ ДЛЯ ОПРЕДЕЛЕНИЯ МИНИМАЛЬНОГО СРЕЗА
        Array.sort((a, b) => a.val < b.val ? 1 : -1).forEach(elem => {
            for(let j = 1; j <= elem.counter; j++){
              let value = elem.val;
              let valueArr = [elem.val]
              Array.forEach(el =>{
                for(let k = el.counter; k > 0; k--){
                  if(j == k && elem == el)continue;
                  if(value + el.val > value && value + el.val <= limit){
                    value = value + el.val;
                    valueArr.push(el.val)
                  }
                }
              })
              if(value > delNumber){
                delNumber = value;
                delArray = [...valueArr];
              }
            }
        })
        //УДАЛЕНИЕ ИСПОЛЬЗОВАННЫХ ЭЛЕМЕНТОВ ИЗ РАСЧЕТОВ
        for(let item of delArray){
            let indexDel = Array.findIndex(e => e.val == item);
            let indexDel_inputL = inputL.findIndex(e => e.val == item);
            if(Array[indexDel].counter == 1){
                Array.splice(indexDel , 1)
            }else{
                Array[indexDel].counter--
            }
            if(inputL[indexDel_inputL].counter == 1){
                inputL.splice(indexDel_inputL , 1)
            }else{
                inputL[indexDel_inputL].counter--
            }
        }
        if(inputL_in.reduce((a , b) => a.val > b.val ? a : b , 0).val >= inputL.reduce((a , b) => a.val < b.val ? a : b , 0).val && inputL_in.length){
            let inputL_inDelIndex = inputL_in.findIndex(e => e.val == element);
            if(inputL_in[inputL_inDelIndex].counter == 1){
                inputL_in.splice(inputL_inDelIndex , 1)
            }else{
                inputL_in[inputL_inDelIndex].counter--
            }
        }
        // //СОЗДАЛ МАССИВ ДЛЯ РЕНДЕРИНГА
        if(delArray.length){
            if(!!RenderArray.find(e => e.str_in_val == element && e.str_out_val.toString() == delArray.toString())){
                RenderArray.find(e => e.str_in_val.toString() == element && e.str_out_val.toString() == delArray.toString()).str_in_counter++
            }else{
                RenderArray.push({
                str_in_val: element , str_in_counter: 1,
                str_out_val: delArray,
                })
            }
        }
    }

    //ОЧИСТКА usedInputL ОТ ОСТАТКОВ inputL
    inputL.forEach(elem => {
        usedInputL = usedInputL.filter(e => e.val !== elem.val)
    })

    //РЕНДЕРИНГ
    // RenderArray.forEach((element , index) => {
    //     let srezSize = element.str_in_val;
    //     let srezCounter = element.str_in_counter;
    //     createMapItem(index , srezSize , srezCounter)
    //     let sumUsedMaterial = 0;
    //     let sumWidthUsedMaterial = 0;
    //     element.str_out_val.forEach(e => {
    //         let usedMaterial;
    //         let widthUsedMaterial;
    //         usedMaterial = e;
    //         widthUsedMaterial = e / element.str_in_val * 100;
    //         createInputSrez(index , usedMaterial , widthUsedMaterial)

    //         sumUsedMaterial += e;
    //         sumWidthUsedMaterial += e / element.str_in_val * 100;
    //     })

    //     let remains = element.str_in_val - sumUsedMaterial;
    //     let widthRemains = 100 - sumWidthUsedMaterial;
    //     if(remains !== 0){
    //         createRemains(index , remains , widthRemains)
    //     }
    // })
    smartcutRes()
    
    
    // let indexCreateMapItem = 0;
    // let counterFor = 0;
    // let RenderArray = []
    // ///ЦИКЛ ДЛЯ СОЗДАНИЯ МАССИВА РЕНДЕРИНГА
    // do{
    //     if(Math.max(...inputL_inAllArr) >= Math.min(...inputLAllArr) && inputL_inAllArr.length){
    //         inputL_in.forEach((element , index) => {
    //             let inputLClone = [...inputLAllArr.filter(e => e <= element.val).sort((a , b) => a + b , 0)];
    //             for(let i = 0; i < element.counter; i++){
    //                 minSrez(element.val , inputLClone , inputLAllArr , inputL_inAllArr,  RenderArray);
    //             }
    //         })
    //     }
    //     else if($('input[name="l_zag"]').val() >= Math.min(...inputLAllArr)){
    //         let element = +$('input[name="l_zag"]').val();
    //         let inputLClone = [...inputLAllArr.filter(e => e <= $('input[name="l_zag"]').val()).sort((a , b) => a + b , 0)];
    //         minSrez(element , inputLClone , inputLAllArr , inputL_inAllArr,  RenderArray);
    //     }else{
    //         break;
    //     }
    // }while(inputLAllArr.length)

    
    // function minSrez(element , Array , inputLAllArr , inputL_inAllArr, RenderArray){
    //     let limit = element;
    //     let delNumber = 0;
    //     let delArray = [];
    //     //РАСЧЕТ ДЛЯ ОПРЕДЕЛЕНИЯ МИНИМАЛЬНОГО СРЕЗА
    //     for(let j = 0; j < Array.length; j++){
    //       let value = Array[j];
    //       let valueArr = [Array[j]]
    //       for(let k = Array.length - 1; k >= 0; k--){
    //         if(j == k)continue;
    //         if(value + Array[k] > value && value + Array[k] <= limit){
    //           value = value + Array[k];
    //           valueArr.push(Array[k])
    //         }
    //       }
    //       if(value > delNumber){
    //         delNumber = value;
    //         delArray = [...valueArr];
    //       }
    //     }
    //     //УДАЛЕНИЕ ИСПОЛЬЗОВАННЫХ ЭЛЕМЕНТОВ ИЗ РАСЧЕТОВ
    //     for(let item of delArray){
    //         let indexDel = Array.findIndex(e => e == item);
    //         let indexDel_inputLAllArr = inputLAllArr.findIndex(e => e == item);
    //         Array.splice(indexDel , 1)
    //         inputLAllArr.splice(indexDel_inputLAllArr , 1)
    //     }
    //     let inputL_inAllArrDelIndex = inputL_inAllArr.findIndex(e => e == element);
    //     inputL_inAllArr.splice(inputL_inAllArrDelIndex , 1)
    //     //СОЗДАЛ МАССИВ ДЛЯ РЕНДЕРИНГА
    //     if(delArray.length){
    //         if(!!RenderArray.find(e => e.str_in_val == element) && !!RenderArray.find(e => e.str_out_val.toString() == delArray.toString())){
    //             RenderArray.find(e => e.str_out_val.toString() == delArray.toString()).str_in_counter++
    //         }else{
    //             RenderArray.push({
    //             str_in_val: element , str_in_counter: 1,
    //             str_out_val: delArray,
    //             })
    //         }
    //     }
    // }
    // //РЕНДЕРИНГ
    // RenderArray.forEach((element , index) => {
    //     let srezSize = element.str_in_val;
    //     let srezCounter = element.str_in_counter;
    //     createMapItem(index , srezSize , srezCounter)
    //     let sumUsedMaterial = 0;
    //     let sumWidthUsedMaterial = 0;
    //     element.str_out_val.forEach(e => {
    //         let usedMaterial;
    //         let widthUsedMaterial;
    //         usedMaterial = e;
    //         widthUsedMaterial = e / element.str_in_val * 100;
    //         createInputSrez(index , usedMaterial , widthUsedMaterial)

    //         sumUsedMaterial += e;
    //         sumWidthUsedMaterial += e / element.str_in_val * 100;
    //     })

    //     let remains = element.str_in_val - sumUsedMaterial;
    //     let widthRemains = 100 - sumWidthUsedMaterial;
    //     if(remains !== 0){
    //         createRemains(index , remains , widthRemains)
    //     }
    // })

    ///////////////////////////////////////////////////////////////////////////

  
    $(".res_buttons").css({
      display: "flex"
    })

    $(".add").click((function() {
      return t(), $('input[name="l[]"]').last().focus(), !1
    }))
    $("#add_in").click((function() {
      return n(), $('input[name="l_in[]"]').last().focus(), !1
    }))
    //ДОБАВЛЕНИЕ ДОПОЛНИТЕЛЬНОГО INPUT ПРИ BLUR
    $(".out").on("input keyup change", 'input[name="c[]"]:last', (function() {
        $(this).val() > 0 && t()
    })) 
    $(".in").on("input keyup change", 'input[name="c_in[]"]:last', (function() {
        $(this).val() > 0 && n()
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
      r(), s();
      removeCookieSmct_out();
    }))
    $(".all_del_in").click((function() {
      $(".str_in").each((function() {
          $(".str_in").length > 1 && $(this).remove()
      }))
      r(), a();
      removeCookieSmct_in();
    }))
    
    //КНОПКА ДЛЯ PDF ФАЙЛА
    $(".pdf").click((function(){
        $(".res-wrp").printThis();
    }))
    //КНОПКА ДЛЯ ПОЛНОГО ЭКРАНА 
    $(".on-full-width").click((function() {
        $(".cutting_name textarea").css("width", ""), $(".on-full-width span").toggle(), $("#smartcut_res").toggleClass("full-width"), v()
    }))
  
  

    //АВТОУВЕЛИЧЕНИЕ TEXTAREA ПРИ ПЕРЕПОЛНЕНИИ
    $("#cut-name").on('keyup', function(){
        if(this.scrollTop > 0){
          this.style.height = this.scrollHeight + "px";
        }
    });
    
  
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


    function smartcutRes(srezSize , srezCounter){
        $('<label class="cutting_name" spellcheck="false" style="min-height: 320px;" contenteditable="true">'
            + ('<textarea id="cut-name" placeholder="Название и описание" value style="">'+'</textarea>')
        +'</label>').appendTo(".smartcut_res")

        $('<div class="" style="margin:0 0 20px; padding:0; display:block;">'
            +'<b>Использовано: </b>'
            +usedInputL.map((element , index) => {
                return '<br/>' + '<string>' + element.val + $('input[name="ed"]').val() + ' x ' + element.counter + ' шт.' + '</string>'
            }).join('')
            +'<br/>'
            +'<string>' + ' = ' + usedInputL.reduce((a , b) => a += b.val * b.counter , 0) + '</string>'
        +'</div>').appendTo(".smartcut_res")

        $('<b class="id-in-map" style="margin:0 0 20px; padding:0; display:block;">' + 'Схема раскроя:' +'</b>').appendTo(".smartcut_res");

        //СОЗДАНИЕ TABLE MAP
        RenderArray.map(element =>{
            let srezSize = element.str_in_val;
            let srezCounter = element.str_in_counter;
            let sumUsedMaterial = element.str_out_val.reduce((a , b) => a + b , 0);
            let sumWidthUsedMaterial = element.str_out_val.reduce((a , b) => a + b , 0) / element.str_in_val * 100;
            let remains = element.str_in_val - sumUsedMaterial;
            let widthRemains = 100 - sumWidthUsedMaterial;
            if(remains !== 0){
                return (
                $('<table class="map_item">'
                    +'<tbody>'
                        +'<tr>'
                            +'<td>' 
                                + srezSize + ' x ' + srezCounter
                            +'</td>'
                            +element.str_out_val.map(e => {
                                let usedMaterial;
                                let widthUsedMaterial;
                                usedMaterial = e;
                                widthUsedMaterial = e / element.str_in_val * 100;
                                return '<td style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                            }).join('')
                            +'<td class="waste_item" style=\"width:' + widthRemains + '%' +'\"' + '>' + remains + $('input[name="ed"]').val() +'</td>'
                        +'</tr>'
                        +'<tr class="sizemarkers">'
                            +'<td>' +'</td>'
                            +element.str_out_val.map(e => {
                                let usedMaterial;
                                let widthUsedMaterial;
                                usedMaterial = e;
                                widthUsedMaterial = e / element.str_in_val * 100;
                                return (
                                    '<td>'
                                        +'<div>' 
                                            +'<span>' + usedMaterial + $('input[name="ed"]').val() + '</span>'
                                        +'</div>'
                                    +'</td>')
                            }).join('')
                            +'<td class="marker-disk-waste">' +'</td>'
                        +'</tr>'
                    +'</tbody>'
                +'</table>').appendTo(".smartcut_res")
                )
            }else{
                return (
                $('<table class="map_item">'
                    +'<tbody>'
                        +'<tr>'
                            +'<td>' 
                                + srezSize + ' x ' + srezCounter
                            +'</td>'
                            +element.str_out_val.map(e => {
                                let usedMaterial;
                                let widthUsedMaterial;
                                usedMaterial = e;
                                widthUsedMaterial = e / element.str_in_val * 100;
                                return '<td style=\"border: 1px solid; padding: 4px 1px; background-color: #feffd0; text-align: center; width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                            }).join('')
                        +'</tr>'
                        +'<tr class="sizemarkers">' 
                            +'<td>' +'</td>'
                            +element.str_out_val.map(e => {
                                let usedMaterial;
                                let widthUsedMaterial;
                                usedMaterial = e;
                                widthUsedMaterial = e / element.str_in_val * 100;
                                return (
                                    '<td>'
                                        +'<div>' 
                                            +'<span>' + usedMaterial + $('input[name="ed"]').val() + '</span>'
                                        +'</div>'
                                    +'</td>')
                            }).join('')
                            +'<td class="marker-disk-waste">' +'</td>'
                        +'</tr>'
                    +'</tbody>'
                +'</table>').appendTo(".smartcut_res")
                )
            }
        })

        +$('<br/>').appendTo(".smartcut_res");
        +$('<br/>').appendTo(".smartcut_res");
        +$('<div class="string">' + 'Польза: ' + (usedInputL.reduce((a , b) => a += b.val * b.counter , 0) / RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) * 100).toFixed(5) + '%' + '</div>').appendTo(".smartcut_res");
        +$('<div class="string">' + 'Отход: ' + ((RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) - usedInputL.reduce((a , b) => a += b.val * b.counter , 0)) / RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) * 100).toFixed(5) + '% ' + '(' + (RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) - usedInputL.reduce((a , b) => a += b.val * b.counter , 0)) + $('input[name="ed"]').val() + ')' + '</div>').appendTo(".smartcut_res");
        console.log(RenderArray)
  
    }
    // function smartcutRes(){
    //   $(".smartcut_res").append('<label class="cutting_name" spellcheck="false" style="min-height: 320px;" contenteditable="true">'+'</label>')
    //     $(".cutting_name").append('<textarea id="cut-name" placeholder="Название и описание" value style="">'+'</textarea>')
    //   $(".smartcut_res").append
    //     ('<div class="" style="margin:0 0 20px; padding:0; display:block;">'
    //         + '<b>Использовано: </b>' 
    //         + '<br/>'
    //     +'</div>')
    //   $(".smartcut_res").append('<b class="id-in-map" style="margin:0 0 20px; padding:0; display:block;">' + 'Схема раскроя:' +'</b>');
  
    // }
    // function createMapItem(indexCreateMapItem , srezSize , srezCounter){
    //   $(".smartcut_res").append('<tabel class=\"map_item' + indexCreateMapItem + '\"' + 'style="width:100%; border-collapse:collapse; display:block; margin-bottom:20px;"></tabel>'); 
    //       $(".map_item" + indexCreateMapItem).append('<tbody class=\"mapItemTBody' + indexCreateMapItem + '\"' + 'style="width:100%;display:block;"></tbody>');
    //           $(".mapItemTBody" + indexCreateMapItem).append('<tr class=\"mainItem' + indexCreateMapItem + '\"' + 'style=""></tr>');
    //               $(".mainItem" + indexCreateMapItem).append('<td class=\"itemRaskhod' + indexCreateMapItem + '\"' + 'style="padding-right: 7px; white-space: nowrap;">' + srezSize + ' * ' + srezCounter + '</td>');
    //           $(".mapItemTBody" + indexCreateMapItem).append('<tr class=\"sizemarkers' + indexCreateMapItem + '\"' + 'style=""></tr>');
    //               $(".sizemarkers" + indexCreateMapItem).append('<td class="" style=""></td>');
  
  
  
    // }
    // function createInputSrez(indexCreateMapItem , usedMaterial , widthUsedMaterial){
    //     $(".mainItem" + indexCreateMapItem).append('<td class=\"srez' + indexCreateMapItem + '\"' + 'style=\"border: 1px solid; padding: 4px 1px; background-color: #feffd0; text-align: center; width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>');
    //     $(".sizemarkers" + indexCreateMapItem).append
    //     ('<td class="" style="background-color: #fff; border: none; border-right: 1px dashed; padding: 0 1px 4px 0; text-align: right;">'
    //         + ('<div style="position: relative; padding: 8px 0 0;">'
    //             + ('<span style="border-bottom: 0.5px solid #333; position: relative; margin: 0 2px; display: inline-block;">' + usedMaterial + $('input[name="ed"]').val() + '</span>')
    //         + '</div>')
    //     + '</td>');
    // }
    // function createRemains(indexCreateMapItem , remains , widthRemains){
    //     $(".mainItem" + indexCreateMapItem).append('<td class=\"waste_item' + indexCreateMapItem + '\"' + 'style=\"border: 1px solid; padding: 4px 1px; background-color: #eee; text-align: center; width:' + widthRemains + '%' +'\"' + '>' + remains + $('input[name="ed"]').val() +'</td>');

    // }


  // c()
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