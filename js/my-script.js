jQuery(document).ready(function(){
    cookieLoad()

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
    let inputL_inClone =  JSON.parse(JSON.stringify(inputL_in));
    let RenderArray = []
    let pilkaSrez = +$('input[name="t_disk"]').val()
    ///ЦИКЛ ДЛЯ СОЗДАНИЯ МАССИВА РЕНДЕРИНГА
    do{
        let minInputL = inputL.reduce((a , b) => a.val < b.val ? a : b , 0).val;
        let maxInputL_in = inputL_inClone.reduce((a , b) => a.val > b.val ? a : b , 0).val;
        if(maxInputL_in >= minInputL && inputL_inClone.length){
            inputL_in.forEach((element , index) => {
                let inputLClone = JSON.parse(JSON.stringify(inputL)).filter(e => e.val <= element.val).sort((a , b) => a.val > b.val ? 1 : -1)
                for(let i = 1; i <= element.counter; i++){
                    minSrez(element.val , inputLClone, inputL_inClone,  RenderArray);
                }
            })
        }
        else if($('input[name="l_zag"]').val() >= minInputL){
            let element = +$('input[name="l_zag"]').val();
            let inputLClone = JSON.parse(JSON.stringify(inputL)).filter(e => e.val <= +$('input[name="l_zag"]').val()).sort((a , b) => a.val > b.val ? 1 : -1)
            minSrez(element , inputLClone, inputL_inClone,  RenderArray);
        }
        else{
            break;
        }
    }while(inputL.length)

    function minSrez(element , Array , Array_in , RenderArray){
        let limit = element;
        let delNumber = 0;
        let delArray = [];
        //РАСЧЕТ ДЛЯ ОПРЕДЕЛЕНИЯ МИНИМАЛЬНОГО СРЕЗА
        let ArrayReverse = [...Array.sort((a, b) => a.val < b.val ? 1 : -1)]
        Array.sort((a, b) => a.val > b.val ? 1 : -1).forEach(elem => {
            for(let j = 1; j <= elem.counter; j++){
              let value = elem.val;
              let valueArr = [{val: elem.val , materialName: elem.materialName}];
              ArrayReverse.forEach(el =>{
                for(let k = el.counter; k > 0; k--){
                  if(j == k && elem == el)continue;
                  if(value + el.val + pilkaSrez > value && value + el.val + pilkaSrez <= limit){
                    value = value + el.val + pilkaSrez;
                    valueArr.push({val: el.val , materialName: el.materialName})
                  }
                }
              })
              if(value > delNumber){
                delNumber = value;
                delArray = JSON.parse(JSON.stringify(valueArr));
              }
            }
        })
        //СОЗДАЛ МАССИВ ДЛЯ РЕНДЕРИНГА
        if(delArray.length){
            let strOutCounter = [];
            delArray.forEach(elem =>{
                if(!!strOutCounter.find(e => e.val == elem.val && e.materialName == elem.materialName) && strOutCounter.length){
                    strOutCounter.find(e => e.val == elem.val && e.materialName == elem.materialName).counter++
                }else{
                    strOutCounter.push({
                        val: elem.val, counter: 1, materialName: elem.materialName,
                    })
                }
            })
            if(!!RenderArray.find(e => e.str_in_val == element && JSON.stringify(e.str_out) == JSON.stringify(strOutCounter))){
                RenderArray.find(e => e.str_in_val == element && JSON.stringify(e.str_out) == JSON.stringify(strOutCounter)).str_in_counter++
            }else{
                RenderArray.push({
                str_in_val: element , str_in_counter: 1,
                str_out: strOutCounter,
                })
            }
        }
        //УДАЛЕНИЕ ИСПОЛЬЗОВАННЫХ ЭЛЕМЕНТОВ ИЗ РАСЧЕТОВ
        if(Array_in.reduce((a , b) => a.val > b.val ? a : b , 0).val >= Array.reduce((a , b) => a.val < b.val ? a : b , 0).val && Array_in.length){
            let Array_inDelIndex = Array_in.findIndex(e => e.val == element);
            if(Array_in[Array_inDelIndex].counter == 1){
                Array_in.splice(Array_inDelIndex , 1)
            }else{
                Array_in[Array_inDelIndex].counter--
            }
        }
        for(let item of delArray){
            let indexDel = Array.findIndex(e =>e.val == item.val && e.materialName == item.materialName);
            let indexDel_inputL = inputL.findIndex(e => e.val == item.val && e.materialName == item.materialName);
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
    }

    //ОЧИСТКА usedInputL ОТ ОСТАТКОВ inputL
    inputL.forEach(elem => {
        usedInputL = usedInputL.filter(e => e.val !== elem.val)
    })
    //СОЗДАНИЕ МАССИВА С ОСТАТКАМИ
    let usefulRemainsArr = JSON.parse(JSON.stringify(inputL_inClone));
    RenderArray.forEach(element =>{
        let sumUsedMaterial = element.str_out.reduce((a , b) => a + b.val * b.counter , 0) + pilkaSrez * element.str_out.reduce((a , b) => a + b.counter , 0);
        let remains = element.str_in_val - sumUsedMaterial >= 0 ? element.str_in_val - sumUsedMaterial : 0;
        if(remains !== 0 && remains >= +$('input[name="usefulRemainsInput"]').val()){
            for(let i = 0; i < element.str_in_counter; i++){
                if(usefulRemainsArr.find(e => e.val == remains)){
                    usefulRemainsArr.find(e => e.val == remains).counter++
                }else{
                    usefulRemainsArr.push({val:remains , counter: 1})
                }
            }
        }
    })
    usefulRemainsArr = usefulRemainsArr.sort((a, b) => a.val > b.val ? 1 : -1)
    //СОЗДАНИЕ usedInput_in 
    let usedInput_in = []
    RenderArray.forEach(element =>{
        if(!!usedInput_in.find(e => e.val == element.str_in_val)){
            usedInput_in.find(e => e.val == element.str_in_val).counter += element.str_in_counter
        }else{
            usedInput_in.push({
                val: element.str_in_val , counter: element.str_in_counter
            })
        }
    })
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
    //         if(!!RenderArray.find(e => e.str_in_val == element) && !!RenderArray.find(e => e.str_out.toString() == delArray.toString())){
    //             RenderArray.find(e => e.str_out.toString() == delArray.toString()).str_in_counter++
    //         }else{
    //             RenderArray.push({
    //             str_in_val: element , str_in_counter: 1,
    //             str_out: delArray,
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
    //     element.str_out.forEach(e => {
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
          $(".str_out").length > 1 ? ($(e).parent().remove()) : $('input[name="l[]"], input[name="c[]"], input[name="id[]"]').val("");
          r(), s() ,i();
      }(this), m("out")
    }))
    $(".in").on("click", ".del_in", (function() {
      ! function(e) {
          $(".str_in").length > 1 ? ($(e).parent().remove()) : $('input[name="l_in[]"], input[name="c_in[]"], input[name="id_in[]"]').val("");
          r(), a() ,i()
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
    //СКРЫТИЕ 
    $(".show_sizemarker").click((function() {
        $(".sizemarkers").toggle(), y(), v()
    }))
    //МОДАЛЬНОЕ ОКНО
    $(".show_waste").on('click' , function(e){
        $(".modal")[0].style.display = 'flex'
    })
    $(".button_no").on('click' , function(e){
        e.preventDefault()
        $(".modal")[0].style.display = 'none'
    })
    $(".button_yes").on('click' , function(e){
        $(".str_in").each((function() {
            $(".str_in").length > 1 && $(this).remove()
        }))
        r(), a();
        removeCookieSmct_in();
        $(".str_out").each((function() {
            $(".str_out").length > 1 && $(this).remove()
        }))
        r(), s();
        removeCookieSmct_out();
        
        for(let i of usefulRemainsArr){
            $('input[name="l_in[]"]:last').val(i.val)
            $('input[name="c_in[]"]:last').val(i.counter)
            n(), r();
        }
        i()
        $(".modal")[0].style.display = 'none'
    })
    window.onclick = function(event){
        if(event.target == $(".modal")[0]){
            $(".modal")[0].style.display = 'none'
        }
    }
    //АВТОУВЕЛИЧЕНИЕ TEXTAREA ПРИ ПЕРЕПОЛНЕНИИ
    $("#cut-name").on('keyup', function(){
        if(this.scrollTop > 0){
          this.style.height = this.scrollHeight + "px";
        }
    });
    //КЛИК НА КНОПКУ TOP-DROP
    $(".top-drop").on("click", (function() {
        $(this).toggleClass("active")
    }))
    $(".add-lang").click((function() {
        $(".slide-form").slideDown("fast"), $(".top-drop li").find("a, span").addClass("active")
    }))
    $(".close-forms").click((function() {
        $(".slide-form").slideUp("fast"), $(".top-drop li").find("a, span").removeClass("active")
    }))
    let selectMaterial = []
    $(".support-submit").on("click" , (function(){
        if($(".materialInput").val() !== '' && $(".materialInput").val() !== null){
            $("<option>" + $(".materialInput").val() +"</option>").appendTo(".selectMaterial")
            $('.selectMaterial option:last').prop('selected', true);
            $(".materialInput").val('')
        }
        $('.selectMaterial option:selected').html()
        if($(".otherInput").val() !== '' && $(".otherInput").val() !== null){
            $("<option>" + $(".otherInput").val() +"</option>").appendTo(".selectType")
            $(".selectType option:last").prop('selected' , true)
            $(".otherInput").val('')
        }
        if($(".colorInput").val() !== '' && $(".colorInput").val() !== null){
            $("<option>" + $(".colorInput").val() +"</option>").appendTo(".selectColor")
            $(".selectColor option:last").prop('selected' , true);
            $(".colorInput").val('')
        }
        let selectMaterial = ""
        $('.selectMaterial option').each((index , elem) =>{
            selectMaterial += elem.value + ","
        })
        selectMaterial = selectMaterial.slice(0, -1) 
        console.log(selectMaterial)
        return false;
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
        let e, t, n, r, i = "", a = "" , selectMaterial = "";
        $(".str_out").each((function() {
            e = $(this).find('input[name="l[]"]').val(), t = $(this).find('input[name="c[]"]').val(), id = encodeURIComponent($(this).find('input[name="id[]"]').val()), e > 0 && t > 0 && (i = i + e + "-" + t + "-" + id + ",")
        })), 
        $(".str_in").each((function() {
            n = $(this).find('input[name="l_in[]"]').val(), r = $(this).find('input[name="c_in[]"]').val(), ii = encodeURIComponent($(this).find('input[name="id_in[]"]').val()), n > 0 && r > 0 && (a = a + n + "-" + r + "-" + ii + ",")
        })),
        $('.selectMaterial option').each((index , elem) =>{
            selectMaterial += elem.value + ","
        }),
        i = i.slice(0, -1), 
        a = a.slice(0, -1), 
        selectMaterial = selectMaterial.slice(0, -1),
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
        }),
        $.cookie("smct_usefulRemainsInput", $('input[name="usefulRemainsInput"]').val(), {
            expires: 365
        });
        // $.cookie("smct_topBar", , {
        //     expires: 365
        // });
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
    function cookieLoad(){
        if (null != $.cookie("smct_l") && "" != $.cookie("smct_l") && $('input[name="l_zag"]').val($.cookie("smct_l")), null != $.cookie("smct_tdisk") && "" != $.cookie("smct_tdisk") && $('input[name="t_disk"]').val($.cookie("smct_tdisk")), null != $.cookie("smct_usefulRemainsInput") && "" != $.cookie("smct_usefulRemainsInput") && $('input[name="usefulRemainsInput"]').val($.cookie('smct_usefulRemainsInput')), null != $.cookie("smct_l_zag_id") && "" != $.cookie("smct_l_zag_id") && $('input[name="l_zag_id"]').val($.cookie("smct_l_zag_id")), null != $.cookie("smct_ed") && "" != $.cookie("smct_ed") && $('input[name="ed"]').val($.cookie("smct_ed")), null != $.cookie("smct_out") && $.cookie("smct_out").length > 3) {
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
    }

    function smartcutRes(){
        let UsedOtkhod = 0;

        $('<label class="cutting_name" spellcheck="false" style="min-height: 320px;" contenteditable="true">'
            + ('<textarea id="cut-name" placeholder="Название и описание" value style="">'+'</textarea>')
        +'</label>').appendTo(".smartcut_res")

        if(RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) !== 0 ){
            $('<b class="id-in-map" style="margin:0 0 20px; padding:0; display:block;">' + 'Схема раскроя:' +'</b>').appendTo(".smartcut_res");

            //СОЗДАНИЕ TABLE MAP
            RenderArray.map(element =>{
                let srezSize = element.str_in_val;
                let srezCounter = element.str_in_counter;
                let sumUsedMaterial = element.str_out.reduce((a , b) => a + b.val * b.counter, 0) + pilkaSrez * element.str_out.reduce((a , b) => a + b.counter, 0);
                let sumWidthUsedMaterial = (element.str_out.reduce((a , b) => a + b.val * b.counter , 0) + pilkaSrez * element.str_out.reduce((a , b) => a + b.counter, 0)) / element.str_in_val * 100;
                let remains = element.str_in_val - sumUsedMaterial >= 0 ? element.str_in_val - sumUsedMaterial : 0;
                let widthRemains = 100 - sumWidthUsedMaterial;
                let usedUnderMaterial = 0;
                UsedOtkhod += remains;
                if(remains !== 0){
                    return (
                    $('<table class="map_item">'
                        +'<tbody>'
                            +'<tr>'
                                +'<td>' 
                                    + srezSize + ' x ' + srezCounter
                                +'</td>'
                                +element.str_out.map((e , index) => {
                                    let usedMaterial = e.val;
                                    let userCounter = e.counter;
                                    let usedMaterialName = e.materialName;
                                    let widthUsedMaterial = e.val *  e.counter / element.str_in_val * 100;
                                    if(userCounter !== 1){
                                        if(usedMaterialName !== ''){
                                            if(pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '(x' + userCounter + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '(x' + userCounter + ')' + '</td>'
                                                )
                                            }
                                        }else{
                                            if(pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(x' + userCounter + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(x' + userCounter + ')' + '</td>'
                                                )
                                            }
                                        }
                                    }else{
                                        if(usedMaterialName !== ''){
                                            if(pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '</td>'
                                                )
                                            }
                                        }else{
                                            if(pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                                                )
                                            }
                                        }
                                    }
                                }).join('')
                                +'<td class="waste_item" style=\"width:' + widthRemains + '%' +'\"' + '>' + remains + $('input[name="ed"]').val() +'</td>'
                            +'</tr>'
                            +'<tr class="sizemarkers">'
                                +'<td>' + '</td>'
                                +element.str_out.map((e , index) => {
                                    let userCounter = e.counter;
                                    let widthUsedMaterial = e.val / element.str_in_val * 100;
                                    if(pilkaSrez !== 0){
                                        let arr = [];
                                        for(let i = 1; i <= userCounter; i++){
                                            usedUnderMaterial += e.val;
                                            arr.push(
                                                '<td>'
                                                    +'<div>' 
                                                        +'<span>' + usedUnderMaterial + $('input[name="ed"]').val() + '</span>'
                                                    +'</div>'
                                                +'</td>')
                                        }
                                        arr.push('<td>' + '</td>')
                                        return (arr.join(''))
                                    }else{
                                        let arr = [];
                                        for(let i = 1; i <= userCounter; i++){
                                            usedUnderMaterial += e.val;
                                            arr.push(
                                                '<td>'
                                                    +'<div>' 
                                                        +'<span>' + usedUnderMaterial + $('input[name="ed"]').val() + '</span>'
                                                    +'</div>'
                                                +'</td>')
                                        }
                                        return (arr.join(''))
                                    }
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
                                +element.str_out.map((e , index) => {
                                    let usedMaterial = e.val;
                                    let userCounter = e.counter;
                                    let usedMaterialName = e.materialName;
                                    let widthUsedMaterial = e.val * e.counter / element.str_in_val * 100;
                                    if(userCounter !== 1){
                                        if(usedMaterialName !== ''){
                                            if(((element.str_in_val - usedMaterial * element.str_out.length - pilkaSrez * (element.str_out.length - 1)) !== 0 || (index !== element.str_out.length - 1)) && pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '(x' + userCounter + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }
                                            else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '(x' + userCounter + ')' + '</td>'
                                                )
                                            }
                                        }else{
                                            if(((element.str_in_val - usedMaterial * element.str_out.length - pilkaSrez * (element.str_out.length - 1)) !== 0 || (index !== element.str_out.length - 1)) && pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(x' + userCounter + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }
                                            else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(x' + userCounter + ')' + '</td>'
                                                )
                                            }
                                        }
                                    }else{
                                        if(usedMaterialName !== ''){
                                            if(((element.str_in_val - usedMaterial * element.str_out.length - pilkaSrez * (element.str_out.length - 1)) !== 0 || (index !== element.str_out.length - 1)) && pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }
                                            else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '(' + usedMaterialName + ')' + '</td>'
                                                )
                                            }
                                        }else{
                                            if(((element.str_in_val - usedMaterial * element.str_out.length - pilkaSrez * (element.str_out.length - 1)) !== 0 || (index !== element.str_out.length - 1)) && pilkaSrez !== 0){
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                                                    +'<td id="pilkaSrez">' + '</td>'
                                                )
                                            }
                                            else{
                                                return (
                                                    '<td colspan=\"' + userCounter +'\"' + 'style=\"width:' + widthUsedMaterial + '%' +'\"' + '>' + usedMaterial + $('input[name="ed"]').val() + '</td>'
                                                )
                                            }
                                        }
                                    }
                                }).join('')
                            +'</tr>'
                            +'<tr class="sizemarkers">' 
                                +'<td>' +'</td>'
                                +element.str_out.map((e , index) => {
                                    let userCounter = e.counter;
                                    let widthUsedMaterial = e.val * e.counter / element.str_in_val * 100;
                                    if(pilkaSrez !== 0 && index !== element.str_out.length - 1){
                                        let arr = [];
                                        for(let i = 1; i <= userCounter; i++){
                                            usedUnderMaterial += e.val;
                                            arr.push(
                                                '<td>'
                                                    +'<div>' 
                                                        +'<span>' + usedUnderMaterial + $('input[name="ed"]').val() + '</span>'
                                                    +'</div>'
                                                +'</td>')
                                        }
                                        arr.push('<td>' + '</td>')
                                        return (arr.join(''))
                                    }
                                    else if(((element.str_in_val - e.val * element.str_out.length - pilkaSrez * (element.str_out.length - 1)) !== 0 || (index !== element.str_out.length - 1)) && pilkaSrez !== 0){
                                        let arr = [];
                                        for(let i = 1; i <= userCounter; i++){
                                            usedUnderMaterial += e.val;
                                            arr.push(
                                                '<td>'
                                                    +'<div>' 
                                                        +'<span>' + usedUnderMaterial + $('input[name="ed"]').val() + '</span>'
                                                    +'</div>'
                                                +'</td>')
                                        }
                                        arr.push('<td>' + '</td>')
                                        return (arr.join(''))
                                    }
                                    else{
                                        let arr = [];
                                        for(let i = 1; i <= userCounter; i++){
                                            usedUnderMaterial += e.val;
                                            arr.push(
                                                '<td>'
                                                    +'<div>' 
                                                        +'<span>' + usedUnderMaterial + $('input[name="ed"]').val() + '</span>'
                                                    +'</div>'
                                                +'</td>')
                                        }
                                        return (arr.join(''))
                                    }
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
            +$('<div class="string">' + 'Отход: ' 
                +((RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) - usedInputL.reduce((a , b) => a += b.val * b.counter , 0)) / RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) * 100).toFixed(5) + '% ' 
                +'<br/>'
                +'(' + 'Используемый: ' + UsedOtkhod + $('input[name="ed"]').val() + ')' 
                +'<br/>'
                +'(' + 'Неиспользуемый: ' + (RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) - usedInputL.reduce((a , b) => a += b.val * b.counter, 0) - UsedOtkhod) + $('input[name="ed"]').val() + ')'
                +'<br/>'
                +'(' + 'Всего: ' + (RenderArray.reduce((a , b) => a += b.str_in_val * b.str_in_counter , 0) - usedInputL.reduce((a , b) => a += b.val * b.counter, 0)) + $('input[name="ed"]').val() + ')'
            +'</div>').appendTo(".smartcut_res");

            +$('<br/>').appendTo(".smartcut_res");
            $('<div class="">'
                +'<b>Использовано: </b>'
                +usedInput_in.map(element => {
                    if(element.counter != 0){
                        return '<br/>' + '<string>' + element.val + $('input[name="ed"]').val() + ' x ' + element.counter + ' шт.' + '</string>'
                    }else{
                        return;
                    }
                }).join('')
                +'<br/>'
                +'<string>' + ' = ' + usedInput_in.reduce((a , b) => a += b.val * b.counter , 0) + $('input[name="ed"]').val() + '</string>'
            +'</div>').appendTo(".smartcut_res")

            +$('<br/>').appendTo(".smartcut_res");
            $('<div class="">'
                +'<b>Отрезки: </b>'
                +usedInputL.map(element => {
                    return '<br/>' + '<string>' + element.val + $('input[name="ed"]').val() + ' - ' + element.counter + ' шт. ' + element.materialName + '</string>'
                }).join('')
            +'</div>').appendTo(".smartcut_res")
            console.log(usedInputL)

        }
  
    }
})